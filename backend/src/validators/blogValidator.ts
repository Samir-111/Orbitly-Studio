import { z } from 'zod';

// Zod schema to validate blog post creation data
export const createBlogSchema = z.object({
  title: z
    .string({ required_error: 'Blog post title is required' })
    .min(3, 'Title must be at least 3 characters')
    .max(150, 'Title cannot exceed 150 characters'),
  slug: z
    .string({ required_error: 'Slug is required' })
    .min(3, 'Slug must be at least 3 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens (e.g. blog-post-title)'),
  thumbnail: z
    .string({ required_error: 'Thumbnail URL is required' })
    .url('Thumbnail must be a valid URL'),
  thumbnailPublicId: z.string().optional().nullable(),
  excerpt: z
    .string({ required_error: 'Excerpt summary is required' })
    .min(10, 'Excerpt must be at least 10 characters')
    .max(300, 'Excerpt cannot exceed 300 characters'),
  content: z
    .string({ required_error: 'Blog post content is required' })
    .min(30, 'Content must be at least 30 characters'),
  author: z.string().default('Orbitly Studio Team'),
  readTime: z.string().default('4 min read'),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

// Zod schema to validate blog post updates (partial)
export const updateBlogSchema = createBlogSchema.partial();

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
