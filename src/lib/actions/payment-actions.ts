"use server"

import { revalidatePath } from "next/cache"
import connectDB from "@/lib/db"
import Payment from "@/lib/models/payment"
import Appointment from "@/lib/models/appointment"
import { z } from "zod"

// Schema for payment creation/update
const paymentSchema = z.object({
  patientId: z.string().min(1, { message: "Patient is required." }),
  amount: z.coerce.number().min(0.01, { message: "Amount must be greater than 0." }),
  method: z.enum(["Cash", "G-Pay", "Card", "Other"], { required_error: "Payment method is required." }),
  notes: z.string().optional(),
  appointmentId: z.string().optional(),
})

export type PaymentFormData = z.infer<typeof paymentSchema>

// Get all payments
export async function getPayments() {
  try {
    await connectDB()
    const payments = await Payment.find({})
      .populate("patient", "name")
      .populate("appointment")
      .sort({ date: -1 })

    return { success: true, data: JSON.parse(JSON.stringify(payments)) }
  } catch (error) {
    console.error("Error fetching payments:", error)
    return { success: false, error: "Failed to fetch payments" }
  }
}

// Get payments for a specific patient
export async function getPatientPayments(patientId: string) {
  try {
    await connectDB()
    const payments = await Payment.find({ patient: patientId })
      .populate("appointment")
      .sort({ date: -1 })
    return { success: true, data: JSON.parse(JSON.stringify(payments)) }
  } catch (error) {
    console.error("Error fetching patient payments:", error)
    return { success: false, error: "Failed to fetch patient payments" }
  }
}

// Get a single payment by ID
export async function getPaymentById(id: string) {
  try {
    await connectDB()
    const payment = await Payment.findById(id)
      .populate("patient", "name")
      .populate("appointment")

    if (!payment) {
      return { success: false, error: "Payment not found" }
    }

    return { success: true, data: JSON.parse(JSON.stringify(payment)) }
  } catch (error) {
    console.error("Error fetching payment:", error)
    return { success: false, error: "Failed to fetch payment" }
  }
}

// Create a new payment
export async function createPayment(formData: PaymentFormData) {
  try {
    // Validate form data
    const validatedData = paymentSchema.parse(formData)

    await connectDB()

    // Create the payment
    const newPayment = new Payment({
      patient: validatedData.patientId,
      amount: validatedData.amount,
      method: validatedData.method,
      notes: validatedData.notes || "",
      appointment: validatedData.appointmentId || null,
      date: new Date(),
      createdBy: "Staff", // In a real app, this would be the current user
    })

    await newPayment.save()

    // If this payment is associated with an appointment, update the appointment's payment info
    if (validatedData.appointmentId) {
      const appointment = await Appointment.findById(validatedData.appointmentId)
      if (appointment) {
        await appointment.addPayment(
          validatedData.amount,
          validatedData.method,
          validatedData.notes || ""
        )
      }
    }

    revalidatePath("/payments")
    revalidatePath(`/patients/${validatedData.patientId}`)
    if (validatedData.appointmentId) {
      revalidatePath(`/appointments/${validatedData.appointmentId}`)
    }

    return { success: true, data: JSON.parse(JSON.stringify(newPayment)) }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    console.error("Error creating payment:", error)
    return { success: false, error: "Failed to create payment" }
  }
}

// Update a payment
export async function updatePayment(id: string, formData: PaymentFormData) {
  try {
    // Validate form data
    const validatedData = paymentSchema.parse(formData)

    await connectDB()
    const payment = await Payment.findById(id)

    if (!payment) {
      return { success: false, error: "Payment not found" }
    }

    // Store old values for comparison
    const oldAmount = payment.amount
    const oldAppointmentId = payment.appointment ? payment.appointment.toString() : null

    // Update the payment
    payment.amount = validatedData.amount
    payment.method = validatedData.method
    payment.notes = validatedData.notes || ""
    payment.appointment = validatedData.appointmentId || null

    await payment.save()

    // If appointment changed or amount changed, we need to update the appointments
    if (oldAppointmentId !== validatedData.appointmentId || oldAmount !== validatedData.amount) {
      // If there was an old appointment, update its payment info
      if (oldAppointmentId) {
        const oldAppointment = await Appointment.findById(oldAppointmentId)
        if (oldAppointment) {
          // Remove the old payment amount
          oldAppointment.paidAmount -= oldAmount
          oldAppointment.balance = oldAppointment.totalAmount - oldAppointment.paidAmount
          await oldAppointment.save()
          
          // Also remove this payment from the appointment's payments array
          oldAppointment.payments = oldAppointment.payments.filter(
            (p: any) => p._id.toString() !== id
          )
          await oldAppointment.save()
        }
      }

      // If there's a new appointment, update its payment info
      if (validatedData.appointmentId) {
        const newAppointment = await Appointment.findById(validatedData.appointmentId)
        if (newAppointment) {
          // Add the new payment
          await newAppointment.addPayment(
            validatedData.amount,
            validatedData.method,
            validatedData.notes || ""
          )
        }
      }
    }

    revalidatePath("/payments")
    revalidatePath(`/patients/${validatedData.patientId}`)
    if (oldAppointmentId) {
      revalidatePath(`/appointments/${oldAppointmentId}`)
    }
    if (validatedData.appointmentId) {
      revalidatePath(`/appointments/${validatedData.appointmentId}`)
    }

    return { success: true, data: JSON.parse(JSON.stringify(payment)) }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    console.error("Error updating payment:", error)
    return { success: false, error: "Failed to update payment" }
  }
}

// Delete a payment
export async function deletePayment(id: string) {
  try {
    await connectDB()
    const payment = await Payment.findById(id)

    if (!payment) {
      return { success: false, error: "Payment not found" }
    }

    const patientId = payment.patient
    const appointmentId = payment.appointment

    // If this payment is associated with an appointment, update the appointment's payment info
    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId)
      if (appointment) {
        // Remove the payment amount from the appointment
        appointment.paidAmount -= payment.amount
        appointment.balance = appointment.totalAmount - appointment.paidAmount
        
        // Also remove this payment from the appointment's payments array
        appointment.payments = appointment.payments.filter(
          (p: any) => p._id.toString() !== id
        )
        
        await appointment.save()
      }
    }

    await Payment.findByIdAndDelete(id)

    revalidatePath("/payments")
    revalidatePath(`/patients/${patientId}`)
    if (appointmentId) {
      revalidatePath(`/appointments/${appointmentId}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting payment:", error)
    return { success: false, error: "Failed to delete payment" }
  }
}

// Get total revenue
export async function getTotalRevenue(period: string = "month") {
  try {
    await connectDB()
    
    const now = new Date()
    let startDate: Date
    let previousStartDate: Date
    
    switch(period) {
      case "week":
        startDate = new Date(now)
        startDate.setDate(startDate.getDate() - 7)
        
        previousStartDate = new Date(startDate)
        previousStartDate.setDate(previousStartDate.getDate() - 7)
        break
      case "year":
        startDate = new Date(now)
        startDate.setFullYear(startDate.getFullYear() - 1)
        
        previousStartDate = new Date(startDate)
        previousStartDate.setFullYear(previousStartDate.getFullYear() - 1)
        break
      case "month":
      default:
        startDate = new Date(now)
        startDate.setMonth(startDate.getMonth() - 1)
        
        previousStartDate = new Date(startDate)
        previousStartDate.setMonth(previousStartDate.getMonth() - 1)
        break
    }
    
    // Get current period revenue
    const currentPeriodPayments = await Payment.find({
      date: { $gte: startDate, $lte: now }
    })
    
    const currentTotal = currentPeriodPayments.reduce(
      (sum: number, payment: any) => sum + payment.amount, 
      0
    )
    
    // Get previous period revenue for comparison
    const previousPeriodPayments = await Payment.find({
      date: { $gte: previousStartDate, $lt: startDate }
    })
    
    const previousTotal = previousPeriodPayments.reduce(
      (sum: number, payment: any) => sum + payment.amount, 
      0
    )
    
    // Calculate percentage change
    const change = previousTotal === 0 
      ? 100 // If previous total was 0, we consider it a 100% increase
      : ((currentTotal - previousTotal) / previousTotal) * 100
    
    return { 
      success: true, 
      data: { 
        total: currentTotal,
        change: change,
        period
      } 
    }
  } catch (error) {
    console.error("Error calculating total revenue:", error)
    return { success: false, error: "Failed to calculate total revenue" }
  }
}
// Get recent payments (last 5)
export async function getRecentPayments() {
  try {
    await connectDB()
    const payments = await Payment.find({})
      .sort({ date: -1 })
      .limit(5)
      .populate("patient", "name")
      .populate("appointment", "date serialNumber")
    
    return { success: true, data: JSON.parse(JSON.stringify(payments)) }
  } catch (error) {
    console.error("Error fetching recent payments:", error)
    return { success: false, error: "Failed to fetch recent payments" }
  }
}

