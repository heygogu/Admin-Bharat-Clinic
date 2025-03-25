import mongoose, { Schema } from "mongoose"

// Lab Results Schema
const LabResultSchema = new Schema({
  _id: { // Add this field to store the reference
    type: Schema.Types.ObjectId,
    ref: "LabResult"
  },
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
  }
});


// Create a standalone model for lab results
const LabResultModel = mongoose.models.LabResult || mongoose.model("LabResult", LabResultSchema)

export { LabResultSchema }
export default LabResultModel

