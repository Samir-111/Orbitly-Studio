import { z } from 'zod';

// Zod schema to validate public project inquiries submitted from the website
export const createInquirySchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please provide a valid email address'),
  service: z
    .string({ required_error: 'Primary need/service is required' })
    .min(1, 'Please select a primary need'),
  budget: z
    .string({ required_error: 'Estimated budget is required' })
    .min(1, 'Please select or enter an estimated budget'),
  message: z
    .string({ required_error: 'Project requirements/message is required' })
    .min(10, 'Message must be at least 10 characters'),
});

export const updateInquirySchema = z.object({
  status: z.enum(['new', 'contacted', 'archived']).optional(),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
export type UpdateInquiryInput = z.infer<typeof updateInquirySchema>;
