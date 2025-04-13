// First, modify your model file to force recompilation
import mongoose, { Schema } from "mongoose"

// Lab Results Schema 
const LabResultSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  appointment: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
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
  },
  createdBy: {
    type: String,
    default: "Lab Technician"
  }
});

// Force delete the model if it exists to ensure a clean registration
if (mongoose.models.LabResult) {
  delete mongoose.models.LabResult;
}

// Create a standalone model for lab results
const LabResultModel = mongoose.model("LabResult", LabResultSchema);
export {LabResultSchema}
export default LabResultModel;