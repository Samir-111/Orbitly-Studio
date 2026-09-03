import { Router } from 'express';
import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController';
import { requireAdminAuth } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validateMiddleware';
import { createProjectSchema, updateProjectSchema } from '../validators/projectValidator';
import { writeRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// GET /api/projects
// Public access for published projects; Admin access with ?all=true
router.get('/', getProjects);

// GET /api/projects/:slug
// Public access for published single project by slug
router.get('/:slug', getProjectBySlug);

// POST /api/projects
// Protected: Admin-only project creation with write rate-limiting and validation
router.post(
  '/',
  writeRateLimiter,
  requireAdminAuth,
  validateBody(createProjectSchema),
  createProject
);

// PUT /api/projects/:id
// Protected: Admin-only project update with write rate-limiting and validation
router.put(
  '/:id',
  writeRateLimiter,
  requireAdminAuth,
  validateBody(updateProjectSchema),
  updateProject
);

// DELETE /api/projects/:id
// Protected: Admin-only project deletion with write rate-limiting
router.delete('/:id', writeRateLimiter, requireAdminAuth, deleteProject);

export default router;
