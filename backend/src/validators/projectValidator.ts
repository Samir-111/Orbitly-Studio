import { z } from 'zod';

// Zod schema to validate project creation data
export const createProjectSchema = z.object({
  title: z
    .string({ required_error: 'Project title is required' })
    .min(2, 'Title must be at least 2 characters')
    .max(120, 'Title cannot exceed 120 characters'),
  slug: z
    .string({ required_error: 'Slug is required' })
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens (e.g. project-name)'),
  thumbnail: z
    .string({ required_error: 'Thumbnail URL is required' })
    .url('Thumbnail must be a valid URL'),
  shortDescription: z
    .string({ required_error: 'Short description is required' })
    .min(10, 'Short description must be at least 10 characters')
    .max(300, 'Short description cannot exceed 300 characters'),
  description: z
    .string({ required_error: 'Full description is required' })
    .min(20, 'Description must be at least 20 characters'),
  tags: z
    .array(z.string())
    .default([]),
  client: z.string().optional(),
  year: z.string().optional(),
  deliverables: z.array(z.string()).optional(),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  results: z.string().optional(),
  isPublished: z.boolean().default(false),
});

// Zod schema to validate project update data (partial allowed for partial updates)
export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
