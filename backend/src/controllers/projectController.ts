import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Project } from '../models/Project';
import { AuthRequest } from '../middleware/authMiddleware';

// Helper to check if a request has a valid admin JWT
const isRequestAdmin = (req: Request): boolean => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }
    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'orbitly_studio_super_secret_jwt_key_2025';
    const decoded = jwt.verify(token, jwtSecret) as { role: string };
    return decoded.role === 'admin';
  } catch {
    return false;
  }
};

// GET /api/projects
// Public: Returns published projects only
// Admin (with ?all=true and valid token): Returns all projects including drafts
export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const includeAll = req.query.all === 'true';
    const isAdmin = isRequestAdmin(req);

    // Filter condition: public visitors ONLY see published items
    const filter = includeAll && isAdmin ? {} : { isPublished: true };

    const projects = await Project.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:slug
// Retrieves a single project by its slug
// Public visitors can only access published projects
export const getProjectBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const isAdmin = isRequestAdmin(req);

    const project = await Project.findOne({ slug });

    // If not found or if unpublished and requester is not an admin, return 404
    if (!project || (!project.isPublished && !isAdmin)) {
      res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/projects
// Protected: Admin creates a new project
export const createProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if slug is already taken
    const existingProject = await Project.findOne({ slug: req.body.slug });
    if (existingProject) {
      res.status(400).json({
        success: false,
        message: 'A project with this slug already exists. Please choose a unique slug.',
      });
      return;
    }

    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/projects/:id
// Protected: Admin updates an existing project
export const updateProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if slug is changing and already in use by another project
    if (req.body.slug) {
      const slugConflict = await Project.findOne({
        slug: req.body.slug,
        _id: { $ne: id },
      });
      if (slugConflict) {
        res.status(400).json({
          success: false,
          message: 'Another project is already using this slug. Please choose a unique slug.',
        });
        return;
      }
    }

    const project = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/projects/:id
// Protected: Admin deletes a project
export const deleteProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
