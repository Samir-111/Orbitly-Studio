import rateLimit from 'express-rate-limit';

// Rate Limiting Security Middleware
// Why Rate Limiting is important:
// 1. Prevents brute-force credential stuffing attacks against the login endpoint
// 2. Protects the database and server from denial-of-service (DoS) and excessive spam writes
// 3. Ensures fair resource distribution among API consumers

// Strict limiter for authentication routes (Login)
// Limits an IP to 15 login requests per 15 minutes
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 15, // Limit each IP to 15 login requests per window
  standardHeaders: true, // Return standard RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: {
    success: false,
    message: 'Too many login attempts from this IP address. Please try again after 15 minutes.',
  },
});

// Moderate limiter for write operations (POST, PUT, DELETE)
// Limits an IP to 100 write operations per 15 minutes
export const writeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 write requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many modification requests. Please slow down and try again shortly.',
  },
});

// General public API limiter
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});
