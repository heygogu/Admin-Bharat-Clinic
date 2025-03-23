"use server"

import { revalidatePath } from "next/cache"
import connectDB from "@/lib/db"
import Prescription from "@/lib/models/prescription"
import Patient from "@/lib/models/patient"
import { z } from "zod"

// Schema for medication
const medicationSchema = z.object({
  name: z.string().min(2, { message: "Medication name must be at least 2 characters." }),
  dosage: z.string().min(1, { message: "Dosage is required." }),
  frequency: z.string().min(1, { message: "Frequency is required." }),
  duration: z.string().min(1, { message: "Duration is required." }),
})

// Schema for prescription creation/update
const prescriptionSchema = z.object({
  patientId: z.string().min(1, { message: "Patient is required." }),
  medications: z.array(medicationSchema).min(1, { message: "At least one medication is required." }),
  notes: z.string().optional(),
  appointmentId: z.string().optional(),
})

export type PrescriptionFormData = z.infer<typeof prescriptionSchema>

// Get all prescriptions
export async function getPrescriptions() {
  try {
    await connectDB()
    const prescriptions = await Prescription.find({}).populate("patient", "name").sort({ date: -1 })

    return { success: true, data: JSON.parse(JSON.stringify(prescriptions)) }
  } catch (error) {
    console.error("Error fetching prescriptions:", error)
    return { success: false, error: "Failed to fetch prescriptions" }
  }
}

// Get prescriptions for a specific patient
export async function getPatientPrescriptions(patientId: string) {
  try {
    await connectDB()
    const prescriptions = await Prescription.find({ patient: patientId }).sort({ date: -1 })
    return { success: true, data: JSON.parse(JSON.stringify(prescriptions)) }
  } catch (error) {
    console.error("Error fetching patient prescriptions:", error)
    return { success: false, error: "Failed to fetch patient prescriptions" }
  }
}

// Get a single prescription by ID
export async function getPrescriptionById(id: string) {
  try {
    await connectDB()
    const prescription = await Prescription.findById(id).populate("patient", "name")

    if (!prescription) {
      return { success: false, error: "Prescription not found" }
    }

    return { success: true, data: JSON.parse(JSON.stringify(prescription)) }
  } catch (error) {
    console.error("Error fetching prescription:", error)
    return { success: false, error: "Failed to fetch prescription" }
  }
}

// Create a new prescription
export async function createPrescription(formData: PrescriptionFormData) {
  try {
    // Validate form data
    const validatedData = prescriptionSchema.parse(formData)

    await connectDB()

    // Create the prescription
    const newPrescription = new Prescription({
      patient: validatedData.patientId,
      medications: validatedData.medications,
      notes: validatedData.notes || "",
      appointment: validatedData.appointmentId || null,
      prescribedBy: "Doctor", // In a real app, this would be the current user
    })

    await newPrescription.save()

    // Also add the prescription to the patient's record
    const patient = await Patient.findById(validatedData.patientId)
    if (patient) {
      await patient.addPrescription({
        date: new Date(),
        medications: validatedData.medications,
        notes: validatedData.notes || "",
      })
    }

    revalidatePath("/prescriptions")
    revalidatePath(`/patients/${validatedData.patientId}`)
    if (validatedData.appointmentId) {
      revalidatePath(`/appointments/${validatedData.appointmentId}`)
    }

    return { success: true, data: JSON.parse(JSON.stringify(newPrescription)) }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    console.error("Error creating prescription:", error)
    return { success: false, error: "Failed to create prescription" }
  }
}

// Update a prescription
export async function updatePrescription(id: string, formData: PrescriptionFormData) {
  try {
    // Validate form data
    const validatedData = prescriptionSchema.parse(formData)

    await connectDB()
    const prescription = await Prescription.findById(id)

    if (!prescription) {
      return { success: false, error: "Prescription not found" }
    }

    // Update the prescription
    prescription.medications = validatedData.medications
    prescription.notes = validatedData.notes || ""
    prescription.updatedAt = new Date()

    await prescription.save()

    revalidatePath("/prescriptions")
    revalidatePath(`/patients/${validatedData.patientId}`)
    if (prescription.appointment) {
      revalidatePath(`/appointments/${prescription.appointment}`)
    }

    return { success: true, data: JSON.parse(JSON.stringify(prescription)) }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    console.error("Error updating prescription:", error)
    return { success: false, error: "Failed to update prescription" }
  }
}

// Delete a prescription
export async function deletePrescription(id: string) {
  try {
    await connectDB()
    const prescription = await Prescription.findById(id)

    if (!prescription) {
      return { success: false, error: "Prescription not found" }
    }

    const patientId = prescription.patient
    const appointmentId = prescription.appointment

    await Prescription.findByIdAndDelete(id)

    revalidatePath("/prescriptions")
    revalidatePath(`/patients/${patientId}`)
    if (appointmentId) {
      revalidatePath(`/appointments/${appointmentId}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting prescription:", error)
    return { success: false, error: "Failed to delete prescription" }
  }
}

