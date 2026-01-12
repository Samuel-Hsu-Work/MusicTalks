import { Router } from 'express';
import authRoutes from './auth.routes';
import aiRoutes from './ai.routes';
import cronRoutes from './cron.routes';
import forumRoutes from './forum.routes';

const router = Router();

// Route definitions
router.use('/auth', authRoutes);
router.use('/ai', aiRoutes);
router.use('/cron', cronRoutes);
router.use('/forum', forumRoutes);
// router.use('/users', userRoutes); // Add more routes here as needed

export default router;
