import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  patientMrn: string; 
  providerNpi: string; 
  scheduledTime: Date;
  status: 'Scheduled' | 'Arrived' | 'Completed' | 'Cancelled';
  
  // Clinical Details
  chiefComplaint: string; // Reason for visit
  knownIssues: string[]; // e.g., ["Type 2 Diabetes", "Hypertension"]
  
  // Front-End Revenue Cycle (The 2025 Focus)
  financialClearance: {
    eligibilityVerified: boolean;
    priorAuthRequired: boolean;
    priorAuthStatus: 'N/A' | 'Pending' | 'Approved' | 'Denied';
  };
}

const AppointmentSchema: Schema = new Schema({
  patientMrn: { type: String, required: true, ref: 'PolicyHolder' },
  providerNpi: { type: String, required: true, ref: 'Provider' },
  scheduledTime: { type: Date, required: true },
  status: { type: String, enum: ['Scheduled', 'Arrived', 'Completed', 'Cancelled'], default: 'Scheduled' },
  
  chiefComplaint: { type: String, required: true },
  knownIssues: [{ type: String }],
  
  financialClearance: {
    eligibilityVerified: { type: Boolean, default: false },
    priorAuthRequired: { type: Boolean, default: false },
    priorAuthStatus: { type: String, enum: ['N/A', 'Pending', 'Approved', 'Denied'], default: 'N/A' },
  },
});

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);