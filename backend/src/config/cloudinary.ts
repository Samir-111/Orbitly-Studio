import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

/**
 * Upload an in-memory file buffer directly to Cloudinary using streams.
 * Avoids saving files to disk, ensuring 100% compatibility with stateless hosts like Render.
 */
export const uploadStreamToCloudinary = (
  buffer: Buffer,
  folder: string = 'orbitly_studio/thumbnails'
): Promise<{ url: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    // Check if Cloudinary credentials are configured
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return reject(
        new Error(
          'Cloudinary is not properly configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'
        )
      );
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto:good' }, // Automatic quality optimization
          { fetch_format: 'auto' }, // Automatic WebP/AVIF format serving
        ],
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          return reject(error || new Error('Failed to upload image to Cloudinary.'));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    // Convert Buffer to readable stream and pipe to Cloudinary
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

/**
 * Safely delete an asset from Cloudinary by its publicId.
 * Does not throw fatal errors if deletion fails, to avoid breaking MongoDB updates.
 */
export const deleteFromCloudinary = async (publicId?: string | null): Promise<boolean> => {
  if (!publicId || typeof publicId !== 'string' || publicId.trim() === '') {
    return false;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
      invalidate: true,
    });
    return result.result === 'ok';
  } catch (error) {
    console.warn(`[Cloudinary] Warning: Failed to delete image with publicId: ${publicId}`, error);
    return false;
  }
};

export default cloudinary;
