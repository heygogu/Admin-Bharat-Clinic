import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Patient from "@/lib/models/patient"

export async function GET() {
  try {
    await connectDB()

    // Get all patients
    const patients = await Patient.find({})

    // Define age groups
    const ageGroups = {
      "0-10": 0,
      "11-20": 0,
      "21-30": 0,
      "31-40": 0,
      "41-50": 0,
      "51-60": 0,
      "61+": 0,
    }

    // Count patients in each age group
    patients.forEach((patient) => {
      const age = patient.age

      if (age <= 10) {
        ageGroups["0-10"]++
      } else if (age <= 20) {
        ageGroups["11-20"]++
      } else if (age <= 30) {
        ageGroups["21-30"]++
      } else if (age <= 40) {
        ageGroups["31-40"]++
      } else if (age <= 50) {
        ageGroups["41-50"]++
      } else if (age <= 60) {
        ageGroups["51-60"]++
      } else {
        ageGroups["61+"]++
      }
    })

    // Format the data for the chart
    const data = Object.keys(ageGroups).map((group) => ({
      name: group,
      value: ageGroups[group],
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error fetching patient age data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch patient age data" }, { status: 500 })
  }
}

