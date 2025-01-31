import mongoose, { Schema } from 'mongoose';
import { Usage } from '../types';

const usageSchema = new Schema<Usage>({
  apiKeyId: { type: String, required: true },
  endpoint: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const UsageModel = mongoose.model<Usage>('Usage', usageSchema);