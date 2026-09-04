import { Request, Response, NextFunction } from 'express';
import { uploadStreamToCloudinary, deleteFromCloudinary } from '../config/cloudinary';
import { AuthRequest } from '../middleware/authMiddleware';

/**
 * POST /api/upload
 * Protected: Upload an image to Cloudinary
 */
export const uploadImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No image file provided. Please attach a valid image file.',
      });
      return;
    }

    // Upload memory buffer to Cloudinary
    const result = await uploadStreamToCloudinary(
      req.file.buffer,
      'orbitly_studio/thumbnails'
    );

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully to Cloudinary.',
      data: {
        url: result.url,
        publicId: result.publicId,
        fileName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
      },
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * DELETE /api/upload
 * Protected: Delete an image from Cloudinary by publicId
 */
export const deleteImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      res.status(400).json({
        success: false,
        message: 'publicId is required to delete an image.',
      });
      return;
    }

    const deleted = await deleteFromCloudinary(publicId);

    res.status(200).json({
      success: true,
      message: deleted ? 'Image deleted successfully from Cloudinary.' : 'Image was already removed or not found.',
    });
  } catch (error) {
    next(error);
  }
};
