// Cron Controller
// Handles scheduled/cron job endpoints (called by Python worker)

import { Request, Response } from 'express';
import prisma from '../config/database';
import aiService from '../services/ai.service';
import { env } from '../config/env';

/**
 * Generate a topic automatically (called by cron worker)
 * POST /api/cron/generate-topic
 * Headers: x-cron-secret: <CRON_SECRET>
 */
export const generateTopic = async (req: Request, res: Response) => {
  try {
    // Validate cron secret
    const cronSecret = req.headers['x-cron-secret'];
    
    if (!cronSecret || cronSecret !== env.cronSecret) {
      console.log('❌ Cron request unauthorized');
      return res.status(403).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    console.log('🕐 Received cron request, starting topic generation...');

    // Get current date in YYYY-MM-DD format for display purposes
    const currentDate = new Date().toISOString().split('T')[0];

    // Generate topic using AI
    let title: string;
    let content: string;

    if (!env.openaiApiKey) {
      console.warn('⚠️ OpenAI API key not configured, using default topic');
      title = 'Music Theory Learning Journey';
      content = 'Share your music theory learning methods and experiences. What resources and approaches have been most effective for you?';
    } else {
      try {
        // Generate topic using AI
        const prompt = `You are a music theory expert. Generate an interesting music theory discussion topic in English. 
The format should be:
First line: A concise title (no more than 15 words)
From the second line: Detailed discussion content and question guidance

Title should be engaging and concise. Content should be detailed and guide discussion.`;

        const aiResponse = await aiService.generateResponse(prompt);
        
        // Parse the response (first line is title, rest is content)
        const lines = aiResponse.trim().split('\n');
        title = lines[0] || 'Music Theory Discussion';
        content = lines.slice(1).join('\n').trim() || 'Share your thoughts and experiences about this music theory topic.';
      } catch (error: any) {
        console.error('❌ Error generating topic with AI:', error);
        // Fallback to default topic if AI fails
        title = 'Music Theory Learning Journey';
        content = 'Share your music theory learning methods and experiences. What resources and approaches have been most effective for you?';
      }
    }

    // Create new topic in database (no uniqueness check - allow multiple topics)
    const newTopic = await prisma.topic.create({
      data: {
        date: currentDate,
        title,
        content,
      },
    });

    console.log('✅ Topic generated successfully:', {
      id: newTopic.id,
      title: newTopic.title,
      date: newTopic.date,
    });

    return res.status(200).json({
      success: true,
      message: 'Topic generated successfully',
      data: {
        generated: true,
        topic: newTopic,
      },
    });
  } catch (error: any) {
    console.error('❌ Cron task failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate topic',
    });
  }
};
