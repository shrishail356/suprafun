// src/types/express/index.d.ts
import { ApiKey } from '../index';

declare global {
  namespace Express {
    interface Request {
      apiKey?: ApiKey;
    }
  }
}