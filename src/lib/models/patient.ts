import mongoose, { Schema } from "mongoose"

// Patient Schema
const PatientSchema = new Schema({
  
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum: ["M", "F", "Other"],
  },
  address: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  medicalHistory: {
    type: String,
  },

  waitingStatus: {
    isWaiting: { type: Boolean, default: false },
    waitingSince: { type: Date },
    reason: { type: String },
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
PatientSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})



// Helper method to update waiting status
PatientSchema.methods.updateWaitingStatus = function (isWaiting:any, reason = "") {
  this.waitingStatus = {
    isWaiting,
    waitingSince: isWaiting ? new Date() : null,
    reason: reason,
  }
  return this.save()
}

export default mongoose.models.Patient || mongoose.model("Patient", PatientSchema)

export {PatientSchema}