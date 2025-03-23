import mongoose, { Schema } from "mongoose"

// Medication Schema
const MedicationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
})

// Prescription Schema
const PrescriptionSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  appointment: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  medications: [MedicationSchema],
  notes: {
    type: String,
  },
  prescribedBy: {
    type: String,
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

// Pre-save hook to update the updatedAt field
PrescriptionSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

export { PrescriptionSchema, MedicationSchema }
export default mongoose.models.Prescription || mongoose.model("Prescription", PrescriptionSchema)

