import { z } from 'zod';

// Zod schema to validate admin updates to studio settings
export const updateSettingsSchema = z.object({
  studioEmail: z
    .string({ required_error: 'Studio email is required' })
    .email('Please provide a valid studio email address')
    .trim(),
  location: z
    .string({ required_error: 'Location is required' })
    .min(2, 'Location must be at least 2 characters')
    .trim(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
