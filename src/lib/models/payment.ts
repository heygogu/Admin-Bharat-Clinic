import mongoose, { Schema } from "mongoose"

// Payment Schema
const PaymentSchema = new Schema({
  _id:{
    type: Schema.Types.ObjectId,
    auto: true,
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  appointment: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
  },
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
  }
});

if (mongoose.models.Payment) {
  delete mongoose.models.Payment;
}

// Create a standalone model for payments that aren't tied to an appointment
const PaymentModel = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema)

export { PaymentSchema }
export default PaymentModel

