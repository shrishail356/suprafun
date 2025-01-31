import mongoose, { Schema } from 'mongoose';
import { ApiKey } from '../types';

const apiKeySchema = new Schema<ApiKey>({
  key: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  plan: { 
    type: String, 
    enum: ['FREE', 'PRO', 'BUSINESS'],
    default: 'FREE'
  },
  createdAt: { type: Date, default: Date.now },
  lastUsed: { type: Date, default: Date.now }
});

export const ApiKeyModel = mongoose.model<ApiKey>('ApiKey', apiKeySchema);