// Forum Routes
// Defines API routes for forum-related endpoints

import { Router } from 'express';
import * as forumController from '../controllers/forum.controller';

const router = Router();

// GET /api/forum/topic/latest - Get the latest topic (newest topic)
router.get('/topic/latest', forumController.getLatestTopic);

// GET /api/forum/topics - Get all topics (past topics)
router.get('/topics', forumController.getAllTopics);

// GET /api/forum/comments - Get comments for a topic
router.get('/comments', forumController.getComments);

// POST /api/forum/comments - Create a new comment
router.post('/comments', forumController.createComment);

export default router;
