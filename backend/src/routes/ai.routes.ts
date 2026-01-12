// AI Routes
// Defines API routes for AI-related endpoints

import { Router } from 'express';
import * as aiController from '../controllers/ai.controller';

const router = Router();

// POST /api/ai/explain-notation - Explain a music notation
router.post('/explain-notation', aiController.explainNotation);

// POST /api/ai/chat - Generic AI chat endpoint
router.post('/chat', aiController.chat);

export default router;
