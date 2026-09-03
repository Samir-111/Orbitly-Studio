import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

// POST /api/auth/login
// Authenticates admin credentials and returns a signed JWT token
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by lowercase email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    // Verify bcrypt password hash
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    // Confirm that the user has admin role
    if (user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Access restricted to studio administrators.',
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || 'orbitly_studio_super_secret_jwt_key_2025';

    // Sign JWT token valid for 7 days
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
// Returns current authenticated user information from token
export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated.',
      });
      return;
    }

    const user = await User.findById(req.user.id).select('-passwordHash');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
