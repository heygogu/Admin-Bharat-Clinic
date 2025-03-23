import mongoose, { Schema } from "mongoose"

// Waiting List Schema
const WaitingListSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  waitingSince: {
    type: Date,
    default: Date.now,
  },
  reason: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Waiting", "Called", "Completed", "Cancelled"],
    default: "Waiting",
  },
  calledAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  notes: {
    type: String,
  },
})

// Helper method to update status
WaitingListSchema.methods.updateStatus = function (status) {
  this.status = status

  if (status === "Called") {
    this.calledAt = new Date()
  } else if (status === "Completed") {
    this.completedAt = new Date()
  }

  return this.save()
}

export { WaitingListSchema }
export default mongoose.models.WaitingList || mongoose.model("WaitingList", WaitingListSchema)

