import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

//“We use Zod to validate incoming API request data and prevent invalid data from reaching our business logic or database.”
// Interface extending Express Request to attach authenticated user payload
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

// Authentication & Admin Authorization Middleware
// 1. Checks if Authorization header is present with a Bearer token
// 2. Verifies the JWT signature using the secret key
// 3. Inspects the user's role to confirm it is 'admin'
// 4. Returns 401 if unauthenticated, 403 if authenticated but not admin
export const requireAdminAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    // Check for Authorization header format: "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Please provide a valid Bearer token.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'orbitly_studio_super_secret_jwt_key_2025';

    // Verify JWT token
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    // Strict role check: user must be an admin to access admin routes
    if (decoded.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Access denied. Administrator privileges required.',
      });
      return;
    }

    // Attach decoded user info to the request object for controller use
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please log in again.',
    });
  }
};
