import mongoose, { Schema } from "mongoose"

// Payment Schema
const PaymentSchema = new Schema({
  _id: { // Add this field to store the reference
    type: Schema.Types.ObjectId,
    ref: "Payment"
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


// Create a standalone model for payments that aren't tied to an appointment
const PaymentModel = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema)

export { PaymentSchema }
export default PaymentModel

