import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Patient from "@/lib/models/patient"

export async function GET() {
  try {
    await connectDB()

    // Get all patients
    const patients = await Patient.find({})

    // Count patients by gender
    const genderCounts = {
      Male: 0,
      Female: 0,
      Other: 0,
    }

    patients.forEach((patient) => {
      if (patient.gender === "M") {
        genderCounts["Male"]++
      } else if (patient.gender === "F") {
        genderCounts["Female"]++
      } else {
        genderCounts["Other"]++
      }
    })

    // Format the data for the chart
    const data = Object.keys(genderCounts).map((gender) => ({
      name: gender,
      value: genderCounts[gender],
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error fetching patient gender data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch patient gender data" }, { status: 500 })
  }
}

