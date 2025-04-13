"use server"

import { revalidatePath } from "next/cache"
import connectDB from "@/lib/db"
import LabResult from "@/lib/models/labresult"
import Appointment from "@/lib/models/appointment"
import { z } from "zod"
import mongoose from "mongoose"
import appointment from "@/lib/models/appointment"
import patient from "../models/patient"

// Schema for lab result creation/update
const labResultSchema = z.object({
  patientId: z.string().min(1, { message: "Patient is required." }),
  type: z.enum(["X-Ray", "Blood Test", "Scan", "Other"], { required_error: "Please select a lab result type." }),
  details: z.string().min(5, { message: "Details must be at least 5 characters." }),
  notes: z.string().optional(),
  fileUrl: z.instanceof(File).optional(),
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
    // labResult.fileUrl = validatedData.fileUrl || ""

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
export async function createLabResult(formData: LabResultFormData,labImageURL: string) {
  try {
    // Validate form data
    const validatedData = labResultSchema.parse(formData)
    console.log("Validated data:", validatedData)
    console.log("Lab image URL:", labImageURL)
    await connectDB()

    // Create the lab result
    const newLabResult = await LabResult.create({
      _id: new mongoose.Types.ObjectId(),
       patient: mongoose.Types.ObjectId.isValid(validatedData.patientId) 
        ? new mongoose.Types.ObjectId(validatedData.patientId) 
        : validatedData.patientId,
      type: validatedData.type,
      details: validatedData.details,
      notes: validatedData.notes || "",
      fileUrl: labImageURL || "",
      appointment: validatedData.appointmentId
        ?new mongoose.Types.ObjectId(validatedData.appointmentId)
        : validatedData.appointmentId,
      createdBy: "Lab Technician",
    });
    // If this lab result is associated with an appointment, add it to the appointment
    if (validatedData.appointmentId) {
      const appointment = await Appointment.findById(validatedData.appointmentId)
      if (appointment) {
        console.log("Lab result to appointment:", appointment._id)
        // IMPORTANT FIX: Include the lab result ID when adding to appointment
        appointment.labResults.push({
          _id: newLabResult._id,
          patient: appointment.patient, // Important: Include the patient
          type: validatedData.type,
          details: validatedData.details,
          fileUrl: labImageURL || "",
          notes: validatedData.notes || "",
          date: new Date(),
          createdBy: "Lab Technician"
        });
        await appointment.save();
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