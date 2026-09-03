import { Router } from 'express';
import {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from '../controllers/inquiryController';
import { requireAdminAuth } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validateMiddleware';
import { createInquirySchema, updateInquirySchema } from '../validators/inquiryValidator';
import { writeRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// POST /api/inquiries
// Public: Customer submits project inquiry from website with validation and rate limiting
router.post(
  '/',
  writeRateLimiter,
  validateBody(createInquirySchema),
  createInquiry
);

// GET /api/inquiries
// Protected: Admin retrieves all client leads
router.get('/', requireAdminAuth, getInquiries);

// PUT /api/inquiries/:id
// Protected: Admin updates status of lead
router.put(
  '/:id',
  requireAdminAuth,
  validateBody(updateInquirySchema),
  updateInquiryStatus
);

// DELETE /api/inquiries/:id
// Protected: Admin deletes lead
router.delete('/:id', requireAdminAuth, deleteInquiry);

export default router;
