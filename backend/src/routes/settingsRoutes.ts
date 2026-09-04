import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { requireAdminAuth } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validateMiddleware';
import { updateSettingsSchema } from '../validators/settingsValidator';
import { writeRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public endpoint to retrieve current studio settings
router.get('/', getSettings);

// Protected admin-only endpoint to update studio settings with rate limiting & Zod validation
router.put(
  '/',
  requireAdminAuth,
  writeRateLimiter,
  validateBody(updateSettingsSchema),
  updateSettings
);

export default router;
