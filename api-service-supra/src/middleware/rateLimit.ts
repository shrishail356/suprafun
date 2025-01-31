// src/middleware/rateLimit.ts
import { Request, Response, NextFunction } from 'express';
import { UsageModel } from '../models/Usage';
import { config } from '../config';

export const checkRateLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const apiKey = req.apiKey;
  const now = new Date();
  const dayStart = new Date(now.setHours(0,0,0,0));

  try {
    const dailyUsage = await UsageModel.countDocuments({
      apiKeyId: apiKey?.id,
      timestamp: { $gte: dayStart }
    });

    if (dailyUsage >= config.rateLimits[apiKey?.plan || 'FREE']) {
      res.status(429).json({ 
        error: 'Rate limit exceeded',
        limit: config.rateLimits[apiKey?.plan || 'FREE'],
        usage: dailyUsage
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Rate limit check failed' });
    return;
  }
};