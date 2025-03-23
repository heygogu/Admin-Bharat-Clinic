import mongoose, { Schema } from "mongoose"

// Lab Results Schema
const LabResultSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ["X-Ray", "Blood Test", "Scan", "Other"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  details: {
    type: String,
  },
  fileUrl: {
    type: String,
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
    required: true,
  },
  createdBy: {
    type: String,
  },
})

// Create a standalone model for lab results
const LabResultModel = mongoose.models.LabResult || mongoose.model("LabResult", LabResultSchema)

export { LabResultSchema }
export default LabResultModel

