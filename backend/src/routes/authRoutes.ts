import { Router } from 'express';
import { login, getMe } from '../controllers/authController';
import { requireAdminAuth } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validateMiddleware';
import { loginSchema } from '../validators/authValidator';
import { loginRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// POST /api/auth/login
// Public login endpoint protected by strict rate limiter & Zod validation
router.post('/login', loginRateLimiter, validateBody(loginSchema), login);

// GET /api/auth/me
// Protected endpoint to verify active admin session
router.get('/me', requireAdminAuth, getMe);

export default router;
