import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/appointment"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "month"

    const now = new Date()
    const startDate = new Date()

    // Set the start date based on the period
    switch (period) {
      case "week":
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "quarter":
        startDate.setMonth(now.getMonth() - 3)
        break
      case "year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setMonth(now.getMonth() - 1)
    }

    // Get all appointments in the period
    const appointments = await Appointment.find({
      date: { $gte: startDate, $lte: now },
    })

    // Define time slots
    const timeSlots = {
      "Morning (8-10 AM)": 0,
      "Mid-Morning (10-12 PM)": 0,
      "Afternoon (12-2 PM)": 0,
      "Mid-Afternoon (2-4 PM)": 0,
      "Evening (4-6 PM)": 0,
    }

    // Count appointments by time slot
    appointments.forEach((appointment) => {
      const time = appointment.time
      const hour = Number.parseInt(time.split(":")[0])

      if (hour >= 8 && hour < 10) {
        timeSlots["Morning (8-10 AM)"]++
      } else if (hour >= 10 && hour < 12) {
        timeSlots["Mid-Morning (10-12 PM)"]++
      } else if (hour >= 12 && hour < 14) {
        timeSlots["Afternoon (12-2 PM)"]++
      } else if (hour >= 14 && hour < 16) {
        timeSlots["Mid-Afternoon (2-4 PM)"]++
      } else if (hour >= 16 && hour < 18) {
        timeSlots["Evening (4-6 PM)"]++
      }
    })

    // Format the data for the chart
    const data = Object.keys(timeSlots).map((slot) => ({
      name: slot,
      value: timeSlots[slot],
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error fetching appointment time data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch appointment time data" }, { status: 500 })
  }
}

