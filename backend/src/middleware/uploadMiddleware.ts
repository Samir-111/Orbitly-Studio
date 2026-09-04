import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';

// Configure multer with memory storage (no temporary files saved on disk)
const storage = multer.memoryStorage();

// Allowed image MIME types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new Error(
        `Invalid file type (${file.mimetype}). Only JPG, JPEG, PNG, and WebP images are allowed.`
      )
    );
  }
};

export const multerUpload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1, // Single file upload
  },
  fileFilter,
});

/**
 * Middleware wrapper to handle single image uploads and catch Multer limits/errors gracefully
 */
export const handleSingleImageUpload = (fieldName: string = 'image') => {
  const upload = multerUpload.single(fieldName);

  return (req: Request, res: Response, next: NextFunction): void => {
    upload(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({
            success: false,
            message: 'Image size exceeds the 5MB maximum limit. Please choose a smaller image.',
          });
          return;
        }
        res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`,
        });
        return;
      } else if (err) {
        res.status(400).json({
          success: false,
          message: err.message || 'An error occurred during file upload.',
        });
        return;
      }
      next();
    });
  };
};
