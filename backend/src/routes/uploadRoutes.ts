import { Router } from 'express';
import { uploadImage, deleteImage } from '../controllers/uploadController';
import { requireAdminAuth } from '../middleware/authMiddleware';
import { handleSingleImageUpload } from '../middleware/uploadMiddleware';
import { writeRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// POST /api/upload
// Protected: Admin uploads an image (Max 5MB, JPG/PNG/WebP) directly to Cloudinary
router.post(
  '/',
  writeRateLimiter,
  requireAdminAuth,
  handleSingleImageUpload('image'),
  uploadImage
);

// DELETE /api/upload
// Protected: Admin removes an image from Cloudinary by publicId
router.delete(
  '/',
  writeRateLimiter,
  requireAdminAuth,
  deleteImage
);

export default router;
