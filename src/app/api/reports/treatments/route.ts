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
      treatment: { $exists: true, $ne: "" },
    })

    // Count treatments
    const treatmentCounts = {}

    appointments.forEach((appointment) => {
      if (appointment.treatment) {
        // Split by commas to handle multiple treatments
        const treatments = appointment.treatment.split(",").map((t) => t.trim())

        treatments.forEach((treatment:any) => {
          if (!treatmentCounts[treatment]) {
            treatmentCounts[treatment] = 0
          }
          treatmentCounts[treatment]++
        })
      }
    })

    // Sort treatments by count and take top 10
    const sortedTreatments = Object.keys(treatmentCounts)
      .sort((a, b) => treatmentCounts[b] - treatmentCounts[a])
      .slice(0, 10)

    // Format the data for the chart
    const data = sortedTreatments.map((treatment) => ({
      name: treatment,
      value: treatmentCounts[treatment],
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error fetching treatment data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch treatment data" }, { status: 500 })
  }
}

