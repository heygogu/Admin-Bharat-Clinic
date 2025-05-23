import mongoose, { Schema } from "mongoose"
import { PaymentSchema } from "./payment"
import { LabResultSchema } from "./labresult"

const AppointmentSchema = new Schema({
  serialNumber: {
    type: String,
    required: true,
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: false,
  },
  // For quick access without needing to populate the patient field
  patientDetails: {
    name: { type: String },
    age: { type: Number },
    gender: { type: String },
    address: { type: String },
    phoneNumber: { type: String },
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  reason: {
    type: String,
  },
  diagnosis: {
    type: String,
  },
  treatment: {
    type: String,
  },
  followUpDate: {
    type: Date,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  paidAmount: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0,
  },
  payments: [PaymentSchema],
  labResults: [LabResultSchema],
  handledBy: {
    type: String,
  },
  notes: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Scheduled", "In Progress", "Completed", "Cancelled", "No-Show"],
    default: "Scheduled",
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

// Pre-save hook to calculate balance
AppointmentSchema.pre("save", function (next) {
  // Calculate the balance based on total and paid amounts
  this.balance = this.totalAmount - this.paidAmount

  // Auto-set the day of the week based on the appointment date
  if (this.date) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const
    this.day = daysOfWeek[this.date.getDay()]
  }

  this.updatedAt = new Date()
  next()
})

// Helper method to add a payment
interface Payment {
  _id?: mongoose.Types.ObjectId;
  patient: mongoose.Types.ObjectId; // Add this line
  amount: number;
  method: string;
  date: Date;
  notes: string;
}

interface IAppointmentMethods {
  addPayment(amount: number, method?: string, notes?: string): Promise<any>;
}

AppointmentSchema.methods.addPayment = function(this: mongoose.Document & { 
  payments: Payment[];
  paidAmount: number;
  totalAmount: number;
  balance: number;
  patient: mongoose.Types.ObjectId;
}, amount: number, method: string = "Cash", notes: string = "", paymentId?: mongoose.Types.ObjectId): Promise<any> {
  this.payments.push({
    _id: paymentId || undefined, // Use undefined if paymentId is empty
    patient: this.patient, // Include the patient reference
    amount,
    method,
    date: new Date(),
    notes,
  });

  this.paidAmount += amount;
  this.balance = this.totalAmount - this.paidAmount;

  return this.save();
}

// Helper method to add a lab result
interface LabResult {
  _id?: mongoose.Types.ObjectId;
  patient: mongoose.Types.ObjectId;
  type: string;
  details: string;
  fileUrl: string;
  notes: string;
  date: Date;
}

interface IAppointmentLabMethods {
  addLabResult(type: string, details: string, fileUrl?: string, notes?: string): Promise<any>;
}

// AppointmentSchema.methods.addLabResult = function(this: mongoose.Document & {
//   labResults: LabResult[];
// }, type: string, details: string, fileUrl: string = "", notes: string = ""): Promise<any> {
//   this.labResults.push({
//     type,
//     details,
//     fileUrl,
//     notes,
//     date: new Date(),
//   });

//   return this.save();
// }

// Helper method to update status
interface IAppointmentStatusMethods {
  updateStatus(status: "Scheduled" | "In Progress" | "Completed" | "Cancelled" | "No-Show"): Promise<any>;
}

AppointmentSchema.methods.updateStatus = function(
  this: mongoose.Document & { status: string },
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled" | "No-Show"
): Promise<any> {
  this.status = status;
  return this.save();
}



AppointmentSchema.methods.addLabResult = function(this: mongoose.Document & {
  labResults: LabResult[];
  patient: mongoose.Types.ObjectId;
}, type: string, details: string, fileUrl: string = "", notes: string = "", labResultId: string = ""): Promise<any> {
  this.labResults.push({
    _id: labResultId ? new mongoose.Types.ObjectId(labResultId) : undefined,
    patient: this.patient, // Set patient from the appointment
    type,
    details,
    fileUrl,
    notes,
    date: new Date(),
  });
  
  return this.save();
}

if(mongoose.models.Appointment) {
  delete mongoose.models.Appointment
}
export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema)