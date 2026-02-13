import mongoose, { Schema, Document } from 'mongoose';

export interface IProvider extends Document {
  npi: string; // National Provider Identifier
  name: { first: string; last: string; title: string };
  specialty: string;
  department: string;
}

const ProviderSchema: Schema = new Schema({
  npi: { type: String, required: true, unique: true },
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true },
    title: { type: String, required: true }, // e.g., "MD", "DO", "OD"
  },
  specialty: { type: String, required: true },
  department: { type: String, required: true },
});

export default mongoose.model<IProvider>('Provider', ProviderSchema);