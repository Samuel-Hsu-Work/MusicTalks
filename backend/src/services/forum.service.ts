// Forum Service
// Contains business logic for forum-related operations

import prisma from '../config/database';

export class ForumService {
  /**
   * Get the latest topic (newest topic by creation time)
   * @returns Latest topic or null if not found
   */
  async getLatestTopic() {
    const topic = await prisma.topic.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        comments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return topic;
  }

  /**
   * Get all topics
   * @returns Array of topics ordered by creation date (newest first)
   */
  async getAllTopics() {
    const topics = await prisma.topic.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return topics;
  }

  /**
   * Get comments for a specific topic
   * @param topicId - The topic ID
   * @returns Array of comments ordered by creation date (newest first)
   */
  async getCommentsByTopicId(topicId: string) {
    const comments = await prisma.comment.findMany({
      where: {
        topicId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return comments;
  }

  /**
   * Create a new comment
   * @param topicId - The topic ID
   * @param username - The username
   * @param text - The comment text
   * @returns The created comment
   */
  async createComment(topicId: string, username: string, text: string) {
    // Verify topic exists
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
    });

    if (!topic) {
      throw new Error('Topic not found');
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        topicId,
        username: username.trim(),
        text: text.trim(),
      },
    });

    return comment;
  }
}

export default new ForumService();
