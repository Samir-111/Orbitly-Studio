import { Request, Response, NextFunction } from 'express';

// Middleware to handle 404 Not Found for non-existent API routes
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.method} ${req.originalUrl}' does not exist.`,
  });
};

// Global Express Central Error Handler
// Catches all uncaught synchronous and asynchronous errors across controllers
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('[Error Handler] Caught unexpected error:', err);

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    res.status(400).json({
      success: false,
      message: `A record with that ${field} already exists. Please choose a different one.`,
    });
    return;
  }

  // Handle Mongoose CastError (invalid ObjectId or format)
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: `Invalid ID format provided for ${err.path}.`,
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred.';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
