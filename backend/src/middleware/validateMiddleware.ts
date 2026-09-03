import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

// Reusable Zod validation middleware for Express write endpoints
// Prevents invalid or malicious data from reaching database operations
export const validateBody = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Parse and validate request body against the specified Zod schema
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format validation issues into a clean, human-readable error map
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: 'Validation failed. Please check your input fields.',
          errors: formattedErrors,
        });
        return;
      }

      res.status(400).json({
        success: false,
        message: 'Invalid request data.',
      });
    }
  };
};
