import mongoose, { Schema, Document } from 'mongoose';

export interface IPolicyHolder extends Document {
  mrn: string;
  personalInfo: {
    fullName: { first: string; last: string; middle?: string };
    dob: Date;
    gender: string;
    contact: {
      address: string;
      city: string;
      state: string;
      zip: string;
      phone: string;
      email: string;
    };
  };
  policies: {
    type: 'Medical' | 'Vision' | 'Dental';
    providerName: string;
    planName: string;       // <--- NEW
    policyNumber: string;
    groupNumber?: string;
    subscriber: string;
    status: 'Active' | 'Expired' | 'Pending'; // <--- NEW
    copay: number;          // <--- NEW
    deductible: number;     // <--- NEW
    effectiveDate: { start: Date; end: Date };
  }[];
}

const PolicyHolderSchema: Schema = new Schema({
  mrn: { type: String, required: true, unique: true },
  personalInfo: {
    fullName: {
      first: { type: String, required: true },
      last: { type: String, required: true },
      middle: String,
    },
    dob: { type: Date, required: true },
    gender: String,
    contact: {
      address: String,
      city: String,
      state: String,
      zip: String,
      phone: String,
      email: String,
    },
  },
  policies: [
    {
      type: { type: String, required: true },
      providerName: { type: String, required: true },
      planName: { type: String, required: true }, // Added
      policyNumber: { type: String, required: true },
      groupNumber: String,
      subscriber: String,
      status: { type: String, default: 'Active' }, // Added
      copay: Number,      // Added
      deductible: Number, // Added
      effectiveDate: { start: Date, end: Date },
    },
  ],
});

export default mongoose.model<IPolicyHolder>('PolicyHolder', PolicyHolderSchema);