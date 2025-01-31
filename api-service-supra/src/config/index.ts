// src/config/index.ts
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/api-service'
  },
  rateLimits: {
    FREE: 100,      // 100 requests per day
    PRO: 10000,     // 10,000 requests per day
    BUSINESS: 50000 // 50,000 requests per day
  }
};