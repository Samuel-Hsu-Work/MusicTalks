import { Router } from 'express';
import { register, login, logout } from '../controllers/auth.controller';

const router = Router();

// Auth routes
// POST /api/auth/register - Register a new user
router.post('/register', register);

// POST /api/auth/login - Login an existing user
router.post('/login', login);

// POST /api/auth/logout - Logout (client-side token removal)
router.post('/logout', logout);

export default router;
