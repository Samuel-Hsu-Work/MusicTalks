// Forum Controller
// Handles HTTP requests for forum-related endpoints

import { Request, Response } from 'express';
import forumService from '../services/forum.service';

/**
 * Get the latest topic (newest topic)
 * GET /api/forum/topic/latest
 */
export const getLatestTopic = async (req: Request, res: Response) => {
  try {
    const topic = await forumService.getLatestTopic();

    if (!topic) {
      return res.status(200).json({
        success: true,
        topic: null,
        message: 'No topics found',
      });
    }

    return res.status(200).json({
      success: true,
      topic,
    });
  } catch (error: any) {
    console.error('Error in getLatestTopic controller:', error);
    return res.status(500).json({
      error: error.message || 'Failed to fetch latest topic',
    });
  }
};

/**
 * Get all topics (ordered by newest first)
 * GET /api/forum/topics
 */
export const getAllTopics = async (req: Request, res: Response) => {
  try {
    const topics = await forumService.getAllTopics();

    return res.status(200).json({
      success: true,
      topics,
    });
  } catch (error: any) {
    console.error('Error in getAllTopics controller:', error);
    return res.status(500).json({
      error: error.message || 'Failed to fetch topics',
    });
  }
};

/**
 * Get comments for a specific topic
 * GET /api/forum/comments?topicId=xxx
 */
export const getComments = async (req: Request, res: Response) => {
  try {
    const { topicId } = req.query;

    if (!topicId || typeof topicId !== 'string') {
      return res.status(400).json({
        error: 'Topic ID is required',
      });
    }

    const comments = await forumService.getCommentsByTopicId(topicId);

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error: any) {
    console.error('Error in getComments controller:', error);
    return res.status(500).json({
      error: error.message || 'Failed to fetch comments',
    });
  }
};

/**
 * Create a new comment
 * POST /api/forum/comments
 * Body: { topicId: string, username: string, text: string }
 */
export const createComment = async (req: Request, res: Response) => {
  try {
    const { topicId, username, text } = req.body;

    // Validate required fields
    if (!topicId || typeof topicId !== 'string') {
      return res.status(400).json({
        error: 'Topic ID is required',
      });
    }

    if (!username || typeof username !== 'string') {
      return res.status(400).json({
        error: 'Username is required',
      });
    }

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        error: 'Comment text is required',
      });
    }

    if (text.trim().length === 0) {
      return res.status(400).json({
        error: 'Comment cannot be empty',
      });
    }

    if (text.length > 1000) {
      return res.status(400).json({
        error: 'Comment is too long (max 1000 characters)',
      });
    }

    const comment = await forumService.createComment(topicId, username, text);

    return res.status(201).json({
      success: true,
      comment,
    });
  } catch (error: any) {
    console.error('Error in createComment controller:', error);
    
    if (error.message === 'Topic not found') {
      return res.status(404).json({
        error: 'Topic not found',
      });
    }

    return res.status(500).json({
      error: error.message || 'Failed to create comment',
    });
  }
};
