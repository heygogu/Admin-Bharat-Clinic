import mongoose, { Schema } from "mongoose"
import { PaymentSchema } from "./payment"
import { LabResultSchema } from "./labresult"

const AppointmentSchema = new Schema({
  serialNumber: {
    type: String,
    required: true,
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  // For quick access without needing to populate the patient field
  patientDetails: {
    name: { type: String },
    age: { type: Number },
    gender: { type: String },
    address: { type: String },
    phoneNumber: { type: String },
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  reason: {
    type: String,
  },
  diagnosis: {
    type: String,
  },
  treatment: {
    type: String,
  },
  followUpDate: {
    type: Date,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  paidAmount: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0,
  },
  payments: [PaymentSchema],
  labResults: [LabResultSchema],
  handledBy: {
    type: String,
  },
  notes: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Scheduled", "In Progress", "Completed", "Cancelled", "No-Show"],
    default: "Scheduled",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Pre-save hook to calculate balance
AppointmentSchema.pre("save", function (next) {
  // Calculate the balance based on total and paid amounts
  this.balance = this.totalAmount - this.paidAmount

  // Auto-set the day of the week based on the appointment date
  if (this.date) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    this.day = daysOfWeek[this.date.getDay()]
  }

  this.updatedAt = new Date()
  next()
})

// Helper method to add a payment
AppointmentSchema.methods.addPayment = function (amount, method = "Cash", notes = "") {
  this.payments.push({
    amount,
    method,
    date: new Date(),
    notes,
  })

  this.paidAmount += amount
  this.balance = this.totalAmount - this.paidAmount

  return this.save()
}

// Helper method to add a lab result
AppointmentSchema.methods.addLabResult = function (type, details, fileUrl = "", notes = "") {
  this.labResults.push({
    type,
    details,
    fileUrl,
    notes,
    date: new Date(),
  })

  return this.save()
}

// Helper method to update status
AppointmentSchema.methods.updateStatus = function (status) {
  this.status = status
  return this.save()
}


export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema)

