"use server"

import { revalidatePath } from "next/cache"
import connectDB from "@/lib/db"
import Patient from "@/lib/models/patient"
import { z } from "zod"

// Schema for patient creation/update
const patientSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.coerce.number().min(0, { message: "Age must be a positive number." }),
  gender: z.enum(["M", "F", "Other"], { required_error: "Please select a gender." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 characters." }),
  medicalHistory: z.string().optional(),
})

export type PatientFormData = z.infer<typeof patientSchema>

// Get all patients
export async function getPatients() {
  try {
    await connectDB()
    const patients = await Patient.find({}).sort({ createdAt: -1 })
    return { success: true, data: JSON.parse(JSON.stringify(patients)) }
  } catch (error) {
    console.error("Error fetching patients:", error)
    return { success: false, error: "Failed to fetch patients" }
  }
}

// Get recent patients (last 5)
export async function getRecentPatients() {
  try {
    await connectDB()
    const patients = await Patient.find({}).sort({ createdAt: -1 }).limit(5)
    return { success: true, data: JSON.parse(JSON.stringify(patients)) }
  } catch (error) {
    console.error("Error fetching recent patients:", error)
    return { success: false, error: "Failed to fetch recent patients" }
  }
}

// Get a single patient by ID
export async function getPatientById(id: string) {
  try {
    await connectDB()
    const patient = await Patient.findById(id)

    if (!patient) {
      return { success: false, error: "Patient not found" }
    }

    return { success: true, data: JSON.parse(JSON.stringify(patient)) }
  } catch (error) {
    console.error("Error fetching patient:", error)
    return { success: false, error: "Failed to fetch patient" }
  }
}

// Create a new patient
export async function createPatient(formData: PatientFormData) {
  try {
    // Validate form data
    const validatedData = patientSchema.parse(formData)

    await connectDB()
    //check if patient already exists using phone number and name
    const existingPatient = await Patient.findOne({
      $and: [
      { phoneNumber: validatedData.phoneNumber },
      { name: validatedData.name },
      ],
    })
    if (existingPatient) {
      return { success: false, error: "Patient already exists" }
    }
    // Create a new patient
    const newPatient = new Patient(validatedData)
    await newPatient.save()

    revalidatePath("/patients")
    return { success: true, data: JSON.parse(JSON.stringify(newPatient)) }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    console.error("Error creating patient:", error)
    return { success: false, error: "Failed to create patient" }
  }
}

// Update an existing patient
export async function updatePatient(id: string, formData: PatientFormData) {
  try {
    // Validate form data
    const validatedData = patientSchema.parse(formData)

    await connectDB()
    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      { ...validatedData, updatedAt: new Date() },
      { new: true, runValidators: true },
    )

    if (!updatedPatient) {
      return { success: false, error: "Patient not found" }
    }

    revalidatePath(`/patients/${id}`)
    revalidatePath("/patients")
    return { success: true, data: JSON.parse(JSON.stringify(updatedPatient)) }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    console.error("Error updating patient:", error)
    return { success: false, error: "Failed to update patient" }
  }
}

// Delete a patient
export async function deletePatient(id: string) {
  try {
    await connectDB()
    const deletedPatient = await Patient.findByIdAndDelete(id)

    if (!deletedPatient) {
      return { success: false, error: "Patient not found" }
    }

    revalidatePath("/patients")
    return { success: true }
  } catch (error) {
    console.error("Error deleting patient:", error)
    return { success: false, error: "Failed to delete patient" }
  }
}

// Update patient waiting status
export async function updatePatientWaitingStatus(id: string, isWaiting: boolean, reason = "") {
  try {
    await connectDB()
    const patient = await Patient.findById(id)

    if (!patient) {
      return { success: false, error: "Patient not found" }
    }

    await patient.updateWaitingStatus(isWaiting, reason)

    revalidatePath("/")
    revalidatePath("/patients")
    return { success: true }
  } catch (error) {
    console.error("Error updating patient waiting status:", error)
    return { success: false, error: "Failed to update patient waiting status" }
  }
}

// Get waiting patients
export async function getWaitingPatients() {
  try {
    await connectDB()
    const waitingPatients = await Patient.find({
      "waitingStatus.isWaiting": true,
    }).sort({ "waitingStatus.waitingSince": 1 })

    return { success: true, data: JSON.parse(JSON.stringify(waitingPatients)) }
  } catch (error) {
    console.error("Error fetching waiting patients:", error)
    return { success: false, error: "Failed to fetch waiting patients" }
  }
}

// Get prescriptions for a specific patient
export async function getPatientPrescriptions(patientId: string) {
  try {
    await connectDB()
    const patient = await Patient.findById(patientId)

    if (!patient) {
      return { success: false, error: "Patient not found" }
    }

    return { success: true, data: JSON.parse(JSON.stringify(patient.prescriptions)) }
  } catch (error) {
    console.error("Error fetching patient prescriptions:", error)
    return { success: false, error: "Failed to fetch patient prescriptions" }
  }
}

//get patient by name of phone number
export async function getPatientByNameOrPhone(search: string) {

  try {
    await connectDB()
    const patients = await Patient.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ],
    })

    return { success: true, data: JSON.parse(JSON.stringify(patients)) }
  } catch (error) {
    console.error("Error fetching patients by name or phone number:", error)
    return { success: false, error: "Failed to fetch patients" }
  }
}