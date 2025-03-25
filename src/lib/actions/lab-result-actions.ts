"use server"

import { revalidatePath } from "next/cache"
import connectDB from "@/lib/db"
import LabResult from "@/lib/models/labresult"
import Appointment from "@/lib/models/appointment"
import { z } from "zod"

// Schema for lab result creation/update
const labResultSchema = z.object({
  patientId: z.string().min(1, { message: "Patient is required." }),
  type: z.enum(["X-Ray", "Blood Test", "Scan", "Other"], { required_error: "Please select a lab result type." }),
  details: z.string().min(5, { message: "Details must be at least 5 characters." }),
  notes: z.string().optional(),
  fileUrl: z.string().optional(),
  appointmentId: z.string().optional(),
})

export type LabResultFormData = z.infer<typeof labResultSchema>

// Get all lab results
export async function getLabResults() {
  try {
    await connectDB()
    const labResults = await LabResult.find({}).populate("patient", "name").sort({ date: -1 })

    return { success: true, data: JSON.parse(JSON.stringify(labResults)) }
  } catch (error) {
    console.error("Error fetching lab results:", error)
    return { success: false, error: "Failed to fetch lab results" }
  }
}

// Get lab results for a specific patient
export async function getPatientLabResults(patientId: string) {
  try {
    await connectDB()
    const labResults = await LabResult.find({ patient: patientId }).sort({ date: -1 })
    return { success: true, data: JSON.parse(JSON.stringify(labResults)) }
  } catch (error) {
    console.error("Error fetching patient lab results:", error)
    return { success: false, error: "Failed to fetch patient lab results" }
  }
}

// Get a single lab result by ID
export async function getLabResultById(id: string) {
  try {
    await connectDB()
    const labResult = await LabResult.findById(id).populate("patient", "name")

    if (!labResult) {
      return { success: false, error: "Lab result not found" }
    }

    return { success: true, data: JSON.parse(JSON.stringify(labResult)) }
  } catch (error) {
    console.error("Error fetching lab result:", error)
    return { success: false, error: "Failed to fetch lab result" }
  }
}



// Update a lab result
export async function updateLabResult(id: string, formData: LabResultFormData) {
  try {
    // Validate form data
    const validatedData = labResultSchema.parse(formData)

    await connectDB()
    const labResult = await LabResult.findById(id)

    if (!labResult) {
      return { success: false, error: "Lab result not found" }
    }

    // Update the lab result
    labResult.type = validatedData.type
    labResult.details = validatedData.details
    labResult.notes = validatedData.notes || ""
    labResult.fileUrl = validatedData.fileUrl || ""

    await labResult.save()

    revalidatePath("/lab-results")
    revalidatePath(`/patients/${validatedData.patientId}`)
    if (labResult.appointment) {
      revalidatePath(`/appointments/${labResult.appointment}`)
    }

    return { success: true, data: JSON.parse(JSON.stringify(labResult)) }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    console.error("Error updating lab result:", error)
    return { success: false, error: "Failed to update lab result" }
  }
}

// Delete a lab result
export async function deleteLabResult(id: string) {
  try {
    await connectDB()
    const labResult = await LabResult.findById(id)

    if (!labResult) {
      return { success: false, error: "Lab result not found" }
    }

    const patientId = labResult.patient
    const appointmentId = labResult.appointment

    await LabResult.findByIdAndDelete(id)

    revalidatePath("/lab-results")
    revalidatePath(`/patients/${patientId}`)
    if (appointmentId) {
      revalidatePath(`/appointments/${appointmentId}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting lab result:", error)
    return { success: false, error: "Failed to delete lab result" }
  }
}

// 1. Ensure consistent reference pattern in createLabResult
export async function createLabResult(formData: LabResultFormData) {
  try {
    // Validate form data
    const validatedData = labResultSchema.parse(formData)

    await connectDB()

    // Create the lab result
    const newLabResult = new LabResult({
      patient: validatedData.patientId,
      type: validatedData.type,
      details: validatedData.details,
      notes: validatedData.notes || "",
      fileUrl: validatedData.fileUrl || "",
      appointment: validatedData.appointmentId || null,
      createdBy: "Lab Technician", // In a real app, this would be the current user
    })

    await newLabResult.save()

    // If this lab result is associated with an appointment, add it to the appointment
    if (validatedData.appointmentId) {
      const appointment = await Appointment.findById(validatedData.appointmentId)
      if (appointment) {
        // IMPORTANT FIX: Include the lab result ID when adding to appointment
        await appointment.addLabResult(
          validatedData.type,
          validatedData.details,
          validatedData.fileUrl || "",
          validatedData.notes || "",
          newLabResult._id // Add this parameter to track the reference
        )
      }
    }

    revalidatePath("/lab-results")
    revalidatePath(`/patients/${validatedData.patientId}`)
    if (validatedData.appointmentId) {
      revalidatePath(`/appointments/${validatedData.appointmentId}`)
    }

    return { success: true, data: JSON.parse(JSON.stringify(newLabResult)) }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    console.error("Error creating lab result:", error)
    return { success: false, error: "Failed to create lab result" }
  }
}