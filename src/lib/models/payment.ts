import mongoose, { Schema } from "mongoose"

// Payment Schema
const PaymentSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  method: {
    type: String,
    enum: ["Cash", "G-Pay", "Card", "Other"],
    default: "Cash",
  },
  notes: {
    type: String,
  },
  appointment: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
  },
  createdBy: {
    type: String,
  },
},{timestamps:true})

// Create a standalone model for payments that aren't tied to an appointment
const PaymentModel = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema)

export { PaymentSchema }
export default PaymentModel

