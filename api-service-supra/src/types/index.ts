// src/types/index.ts
export interface ApiKey {
    id: string;
    key: string;
    userId: string;
    plan: 'FREE' | 'PRO' | 'BUSINESS';
    createdAt: Date;
    lastUsed: Date;
  }
  
  export interface Usage {
    id: string;
    apiKeyId: string;
    endpoint: string;
    timestamp: Date;
  }
  
  export interface RateLimit {
    FREE: number;
    PRO: number;
    BUSINESS: number;
  }