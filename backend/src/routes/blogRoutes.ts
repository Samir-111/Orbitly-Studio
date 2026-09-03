import { Router } from 'express';
import {
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '../controllers/blogController';
import { requireAdminAuth } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validateMiddleware';
import { createBlogSchema, updateBlogSchema } from '../validators/blogValidator';
import { writeRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// GET /api/blog
// Public access for published blog posts; Admin access with ?all=true
router.get('/', getBlogPosts);

// GET /api/blog/:slug
// Public access for published single blog post by slug
router.get('/:slug', getBlogPostBySlug);

// POST /api/blog
// Protected: Admin-only blog post creation with write rate-limiting and validation
router.post(
  '/',
  writeRateLimiter,
  requireAdminAuth,
  validateBody(createBlogSchema),
  createBlogPost
);

// PUT /api/blog/:id
// Protected: Admin-only blog post update with write rate-limiting and validation
router.put(
  '/:id',
  writeRateLimiter,
  requireAdminAuth,
  validateBody(updateBlogSchema),
  updateBlogPost
);

// DELETE /api/blog/:id
// Protected: Admin-only blog post deletion with write rate-limiting
router.delete('/:id', writeRateLimiter, requireAdminAuth, deleteBlogPost);

export default router;
