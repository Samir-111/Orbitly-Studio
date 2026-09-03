import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { BlogPost } from '../models/BlogPost';
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

// GET /api/blog
// Public: Returns published blog posts (featured first, then newest)
// Admin (with ?all=true and valid token): Returns all posts including drafts
export const getBlogPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const includeAll = req.query.all === 'true';
    const isAdmin = isRequestAdmin(req);

    // Public visitors strictly only see published posts
    const filter = includeAll && isAdmin ? {} : { isPublished: true };

    // Sort featured articles first, followed by newest posts
    const posts = await BlogPost.find(filter).sort({ featured: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/blog/:slug
// Retrieves a single blog post by its slug
// Draft posts are hidden from public visitors
export const getBlogPostBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const isAdmin = isRequestAdmin(req);

    const post = await BlogPost.findOne({ slug });

    // If not found or if unpublished and requester is not an admin, return 404
    if (!post || (!post.isPublished && !isAdmin)) {
      res.status(404).json({
        success: false,
        message: 'Blog post not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/blog
// Protected: Admin creates a new blog post
export const createBlogPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if slug is already taken
    const existingPost = await BlogPost.findOne({ slug: req.body.slug });
    if (existingPost) {
      res.status(400).json({
        success: false,
        message: 'A blog post with this slug already exists. Please choose a unique slug.',
      });
      return;
    }

    const post = await BlogPost.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully.',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/blog/:id
// Protected: Admin updates an existing blog post
export const updateBlogPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check for slug collision with other posts
    if (req.body.slug) {
      const slugConflict = await BlogPost.findOne({
        slug: req.body.slug,
        _id: { $ne: id },
      });
      if (slugConflict) {
        res.status(400).json({
          success: false,
          message: 'Another blog post is already using this slug. Please choose a unique slug.',
        });
        return;
      }
    }

    const post = await BlogPost.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Blog post not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully.',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/blog/:id
// Protected: Admin deletes a blog post
export const deleteBlogPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const post = await BlogPost.findByIdAndDelete(id);

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Blog post not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
