// src/routes/index.ts
import { Router } from 'express';
import { createApiKey } from '../controllers/apiKey.controller';
import { testEndpoint } from '../controllers/test.controller';
import { authenticateApiKey } from '../middleware/auth';
import { checkRateLimit } from '../middleware/rateLimit';
const router = Router();

// Public endpoint to generate API key
router.post('/generate-key', createApiKey);

// Protected test endpoint
router.get('/test', authenticateApiKey, checkRateLimit, testEndpoint);

export default router;