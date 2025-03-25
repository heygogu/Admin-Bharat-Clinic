import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Patient from "@/lib/models/patient"

export async function GET() {
  try {
    await connectDB()

    // Get the 5 most recently updated patients
    const patients = await Patient.find({}).sort({ updatedAt: -1 }).limit(5)

    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(patients)),
    })
  } catch (error) {
    console.error("Error fetching recent patients:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch recent patients" }, { status: 500 })
  }
}

