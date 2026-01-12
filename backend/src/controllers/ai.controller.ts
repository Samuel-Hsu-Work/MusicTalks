// AI Controller
// Handles HTTP requests for AI-related endpoints

import { Request, Response } from 'express';
import aiService from '../services/ai.service';

/**
 * Explain a music notation using AI
 * POST /api/ai/explain-notation
 * Body: { notation: string, mode?: 'music' | 'career', background?: string }
 */
export const explainNotation = async (req: Request, res: Response) => {
  try {
    const { notation, mode, background } = req.body;

    // Validate required fields
    if (!notation || typeof notation !== 'string') {
      return res.status(400).json({
        error: 'Notation is required and must be a string',
      });
    }

    // Validate mode if provided
    if (mode && mode !== 'music' && mode !== 'career') {
      return res.status(400).json({
        error: "Mode must be either 'music' or 'career'",
      });
    }

    // Call the AI service
    const explanation = await aiService.explainNotation(
      notation,
      mode || 'music',
      background
    );

    return res.status(200).json({
      success: true,
      explanation,
    });
  } catch (error: any) {
    console.error('Error in explainNotation controller:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate explanation',
    });
  }
};

/**
 * Generate a generic AI response (for future use)
 * POST /api/ai/chat
 * Body: { prompt: string }
 */
export const chat = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'Prompt is required and must be a string',
      });
    }

    const response = await aiService.generateResponse(prompt);

    return res.status(200).json({
      success: true,
      response,
    });
  } catch (error: any) {
    console.error('Error in chat controller:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate response',
    });
  }
};
