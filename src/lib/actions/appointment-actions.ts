"use server"

import { revalidatePath } from "next/cache"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/appointment"
import Patient from "@/lib/models/patient"
import { z } from "zod"

// Schema for appointment creation/update
const appointmentSchema = z.object({
  patientId: z.string().min(1, { message: "Patient is required." }),
  date: z.coerce.date({ required_error: "Appointment date is required." }),
  time: z.string().min(1, { message: "Appointment time is required." }),
  reason: z.string().min(2, { message: "Reason must be at least 2 characters." }),
  notes: z.string().optional(),
})

export type AppointmentFormData = z.infer<typeof appointmentSchema>

// Get all appointments
export async function getAppointments() {
  try {
    await connectDB()
    const appointments = await Appointment.find({}).sort({ date: 1 })
    return { success: true, data: JSON.parse(JSON.stringify(appointments)) }
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return { success: false, error: "Failed to fetch appointments" }
  }
}

// Get upcoming appointments
export async function getUpcomingAppointments() {
  try {
    await connectDB()
    const now = new Date()
    const appointments = await Appointment.find({
      date: { $gte: now },
      status: "Scheduled",
    })
      .sort({ date: 1 })
      .limit(5)

    return { success: true, data: JSON.parse(JSON.stringify(appointments)) }
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error)
    return { success: false, error: "Failed to fetch upcoming appointments" }
  }
}

// Get today's appointments
export async function getTodayAppointments() {
  try {
    await connectDB()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const appointments = await Appointment.find({
      date: { $gte: today, $lt: tomorrow },
    }).sort({ time: 1 })

    return { success: true, data: JSON.parse(JSON.stringify(appointments)) }
  } catch (error) {
    console.error("Error fetching today's appointments:", error)
    return { success: false, error: "Failed to fetch today's appointments" }
  }
}

// Get appointments for a specific patient
export async function getPatientAppointments(patientId: string) {
  try {
    await connectDB()
    const appointments = await Appointment.find({ patient: patientId }).sort({ date: -1 })
    return { success: true, data: JSON.parse(JSON.stringify(appointments)) }
  } catch (error) {
    console.error("Error fetching patient appointments:", error)
    return { success: false, error: "Failed to fetch patient appointments" }
  }
}

// Get a single appointment by ID
export async function getAppointmentById(id: string) {
  try {
    await connectDB()
    const appointment = await Appointment.findById(id)

    if (!appointment) {
      return { success: false, error: "Appointment not found" }
    }

    return { success: true, data: JSON.parse(JSON.stringify(appointment)) }
  } catch (error) {
    console.error("Error fetching appointment:", error)
    return { success: false, error: "Failed to fetch appointment" }
  }
}

// Create a new appointment
  export async function createAppointment(formData: AppointmentFormData) {
    try {
      // Validate form data
      const validatedData = appointmentSchema.parse(formData)

      await connectDB()



      // Get the patient
      const patient = await Patient.findById(validatedData.patientId)
      if (!patient) {
        return { success: false, error: "Patient not found" }
      }

      console.log("serial number before")

     
     const serialNumber = `AP${Date.now().toString(36).toUpperCase()}`;
      console.log("serial number after")


      // Create the appointment
      const newAppointment = new Appointment({
        serialNumber: serialNumber,
        patient: validatedData.patientId,
        patientDetails: {
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          address: patient.address,
          phoneNumber: patient.phoneNumber,
        },
        date: validatedData.date,
        time: validatedData.time,
        reason: validatedData.reason,
        notes: validatedData.notes,
        status: "Scheduled",
      })

      await newAppointment.save()

      revalidatePath("/appointments", 'page') // This will revalidate all pages under /appointments
      revalidatePath(`/patients/${validatedData.patientId}`)
      return { success: true, data: JSON.parse(JSON.stringify(newAppointment)) }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error: error.errors }
      }
      console.error("Error creating appointment:", error)
      return { success: false, error: "Failed to create appointment" }
    }
  }

// Update appointment status
export async function updateAppointmentStatus(id: string, status: string) {
  try {
    await connectDB()
    const appointment = await Appointment.findById(id)

    if (!appointment) {
      return { success: false, error: "Appointment not found" }
    }

    appointment.status = status
    await appointment.save()

    revalidatePath("/appointments", 'page') 
    revalidatePath(`/patients/${appointment.patient}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating appointment status:", error)
    return { success: false, error: "Failed to update appointment status" }
  }
}

// Update appointment details (diagnosis, treatment, etc.)
export async function updateAppointmentDetails(id: string, details: any) {
  try {
    await connectDB()
    const appointment = await Appointment.findById(id)

    if (!appointment) {
      return { success: false, error: "Appointment not found" }
    }

    // Update the appointment with the provided details
    Object.assign(appointment, details)
    await appointment.save()

    revalidatePath("/appointments", 'page') 
    revalidatePath(`/patients/${appointment.patient}`)
    return { success: true, data: JSON.parse(JSON.stringify(appointment)) }
  } catch (error) {
    console.error("Error updating appointment details:", error)
    return { success: false, error: "Failed to update appointment details" }
  }
}

// Delete an appointment
export async function deleteAppointment(id: string) {
  try {
    await connectDB()
    const appointment = await Appointment.findById(id)

    if (!appointment) {
      return { success: false, error: "Appointment not found" }
    }

    const patientId = appointment.patient
    await Appointment.findByIdAndDelete(id)

     revalidatePath("/appointments", 'page') 
    revalidatePath(`/patients/${patientId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting appointment:", error)
    return { success: false, error: "Failed to delete appointment" }
  }
}


export async function getAppointmentPayments(patientId: string) {

  try
  {
    await connectDB()
    const appointments = await Appointment.find({ patient: patientId }).sort({ date: -1 })
    return { success: true, data: JSON.parse(JSON.stringify(appointments)) }
  }
  catch (error) {
    console.error("Error fetching patient appointments:", error)
    return { success: false, error: "Failed to fetch patient appointments" }
  }
}

export async function getAppointmentByPatientId(patientId: string) {
  try {
    await connectDB()
    const appointments = await Appointment.find({ patient: patientId }).sort({ date: -1 })
    return { success: true, data: JSON.parse(JSON.stringify(appointments)) }
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return { success: false, error: "Failed to fetch appointments" }
  }
}