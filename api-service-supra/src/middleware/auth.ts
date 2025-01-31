// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { ApiKeyModel } from '../models/ApiKey';

export const authenticateApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const apiKey = req.header('X-API-Key');
  
  if (!apiKey) {
    res.status(401).json({ error: 'API key is required' });
    return;
  }

  try {
    const keyDoc = await ApiKeyModel.findOne({ key: apiKey });
    
    if (!keyDoc) {
      res.status(401).json({ error: 'Invalid API key' });
      return;
    }

    req.apiKey = keyDoc;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
    return;
  }
};