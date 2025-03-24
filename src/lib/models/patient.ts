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
  prescriptions: [
    {
      date: { type: Date, default: Date.now },
      medications: [
        {
          name: { type: String, required: true },
          dosage: { type: String, required: true },
          frequency: { type: String, required: true },
          duration: { type: String, required: true },
        },
      ],
      notes: { type: String },
    },
  ],
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

// Helper method to add a prescription
PatientSchema.methods.addPrescription = function (prescription:any) {
  this.prescriptions.push(prescription)
  return this.save()
}

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