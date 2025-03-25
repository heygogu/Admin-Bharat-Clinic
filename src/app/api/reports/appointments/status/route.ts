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

    // Count appointments by status
    const statusCounts = {
      Scheduled: 0,
      "In Progress": 0,
      Completed: 0,
      Cancelled: 0,
      "No-Show": 0,
    }

    appointments.forEach((appointment) => {
      if (statusCounts[appointment.status] !== undefined) {
        statusCounts[appointment.status]++
      }
    })

    // Format the data for the chart
    const data = Object.keys(statusCounts).map((status) => ({
      name: status,
      value: statusCounts[status],
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error fetching appointment status data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch appointment status data" }, { status: 500 })
  }
}

