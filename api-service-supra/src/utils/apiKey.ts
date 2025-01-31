// src/utils/apiKey.ts
import crypto from 'crypto';

export const generateApiKey = (): string => {
  return `sk_${crypto.randomBytes(32).toString('hex')}`;
};