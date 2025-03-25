import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/appointment"
import Payment from "@/lib/models/payment"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "month"
    
    const now = new Date()
    let startDate = new Date()
    
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
    
    // Get all payments in the period
    const payments = await Payment.find({
      date: { $gte: startDate, $lte: now }
    })
    
    // Get all appointments in the period
    const appointments = await Appointment.find({
      date: { $gte: startDate, $lte: now }
    })
    
    // Format the data based on the period
    let data:any = []
    
    if (period === "week") {
      // Group by day of week
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      const revenueByDay = Array(7).fill(0)
      
      payments.forEach(payment => {
        const day = new Date(payment.date).getDay()
        revenueByDay[day] += payment.amount
      })
      
      data = dayNames.map((name, index) => ({
        name,
        revenue: revenueByDay[index]
      }))
    } else if (period === "month") {
      // Group by day of month (last 30 days)
      const revenueByDay: Record<string, number> = {}
      const days = 30
      
      for (let i = 0; i < days; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        revenueByDay[dateStr] = 0
      }
      
      payments.forEach(payment => {
        const dateStr = new Date(payment.date).toISOString().split('T')[0]
        if (revenueByDay[dateStr] !== undefined) {
          revenueByDay[dateStr] += payment.amount
        }
      })
      
      data = Object.keys(revenueByDay)
        .sort()
        .map(date => ({
          name: date,
          revenue: revenueByDay[date]
        }))
    } else if (period === "quarter") {
      // Group by week
      const revenueByWeek: Record<string, number> = {}
      const weeks = 12
      
      for (let i = 0; i < weeks; i++) {
        const date = new Date()
        date.setDate(date.getDate() - (i * 7))
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        const weekLabel = `Week ${weeks - i}`
        revenueByWeek[weekLabel] = 0
      }
      
      payments.forEach(payment => {
        const paymentDate = new Date(payment.date)
        const weeksSinceNow = Math.floor((now.getTime() - paymentDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
        if (weeksSinceNow < weeks) {
          const weekLabel = `Week ${weeks - weeksSinceNow}`
          revenueByWeek[weekLabel] += payment.amount
        }
      })
      
      data = Object.keys(revenueByWeek)
        .sort((a, b) => {
          const numA = parseInt(a.split(' ')[1])
          const numB = parseInt(b.split(' ')[1])
          return numA - numB
        })
        .map(week => ({
          name: week,
          revenue: revenueByWeek[week]
        }))
    } else if (period === "year") {
      // Group by month
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ]
      const revenueByMonth = Array(12).fill(0)
      
      payments.forEach(payment => {
        const month = new Date(payment.date).getMonth()
        revenueByMonth[month] += payment.amount
      })
      
      // Reorder months to start from current month going back 12 months
      const currentMonth = now.getMonth()
      const orderedMonths = []
      
      for (let i = 0; i < 12; i++) {
        const monthIndex = (currentMonth - i + 12) % 12
        orderedMonths.push({
          name: monthNames[monthIndex],
          revenue: revenueByMonth[monthIndex]
        })
      }
      
      data = orderedMonths.reverse()
    }
    
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error fetching revenue data:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch revenue data" },
      { status: 500 }
    )
  }
}
