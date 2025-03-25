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
      diagnosis: { $exists: true, $ne: "" },
    })

    // Count diagnoses
    const diagnosisCounts = {}

    appointments.forEach((appointment) => {
      if (appointment.diagnosis) {
        // Split by commas to handle multiple diagnoses
        const diagnoses = appointment.diagnosis.split(",").map((d) => d.trim())

        diagnoses.forEach((diagnosis) => {
          if (!diagnosisCounts[diagnosis]) {
            diagnosisCounts[diagnosis] = 0
          }
          diagnosisCounts[diagnosis]++
        })
      }
    })

    // Sort diagnoses by count and take top 10
    const sortedDiagnoses = Object.keys(diagnosisCounts)
      .sort((a, b) => diagnosisCounts[b] - diagnosisCounts[a])
      .slice(0, 10)

    // Format the data for the chart
    const data = sortedDiagnoses.map((diagnosis) => ({
      name: diagnosis,
      value: diagnosisCounts[diagnosis],
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error fetching diagnosis data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch diagnosis data" }, { status: 500 })
  }
}

