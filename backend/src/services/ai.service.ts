// AI Service
// Contains business logic for AI-powered features using Vercel AI SDK

import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { env } from '../config/env';

export class AIService {
  private model;

  constructor() {
    // Initialize OpenAI model using Vercel AI SDK
    // The SDK will use OPENAI_API_KEY from environment variables
    this.model = openai('gpt-3.5-turbo');
  }

  /**
   * Explain a music notation with AI
   * @param notation - The name of the music notation (e.g., "Treble Clef")
   * @param mode - Explanation mode: 'music' for music theory, 'career' for career analogy
   * @param background - Optional career background for analogy mode
   * @returns AI-generated explanation
   */
  async explainNotation(
    notation: string,
    mode: 'music' | 'career' = 'music',
    background?: string
  ): Promise<string> {
    try {
      // Construct the prompt based on mode
      let prompt: string;
      
      if (mode === 'music') {
        prompt = `Explain the music notation "${notation}" with a focus on music theory. Be clear, educational, and concise. Respond in English.`;
      } else {
        if (!background) {
          throw new Error('Career background is required for career analogy mode');
        }
        prompt = `Explain the music notation "${notation}" by making an analogy to a ${background}. Make it relatable and easy to understand. Respond in English.`;
      }

      // Generate text using Vercel AI SDK
      const { text } = await generateText({
        model: this.model,
        prompt,
      });

      return text;
    } catch (error) {
      console.error('AI service error:', error);
      throw new Error('Failed to generate explanation. Please try again.');
    }
  }

  /**
   * Generate a generic AI response (for future use)
   * @param prompt - The user's prompt
   * @returns AI-generated response
   */
  async generateResponse(prompt: string): Promise<string> {
    try {
      const { text } = await generateText({
        model: this.model,
        prompt,
      });

      return text;
    } catch (error) {
      console.error('AI service error:', error);
      throw new Error('Failed to generate response. Please try again.');
    }
  }
}

export default new AIService();
