// src/controllers/apiKey.controller.ts
import { Request, Response } from 'express';
import { ApiKeyModel } from '../models/ApiKey';
import { generateApiKey } from '../utils/apiKey';

export const createApiKey = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId || 'test-user'; // In production, get this from authentication
    const plan = req.body.plan || 'FREE';
    
    const apiKey = generateApiKey();
    
    const newApiKey = await ApiKeyModel.create({
      key: apiKey,
      userId,
      plan
    });

    res.status(201).json({
      success: true,
      data: {
        apiKey: apiKey,
        plan: newApiKey.plan
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate API key' 
    });
  }
};