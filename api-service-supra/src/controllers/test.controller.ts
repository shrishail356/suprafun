// src/controllers/test.controller.ts
import { Request, Response } from 'express';

export const testEndpoint = async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Hello from protected API endpoint!",
    plan: req.apiKey?.plan
  });
};