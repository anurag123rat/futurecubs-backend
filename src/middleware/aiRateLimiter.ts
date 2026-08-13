import rateLimit from "express-rate-limit";

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,              // 10 requests per minute per IP
  message: {
    success: false,
    error: "Too many requests. Please wait a moment and try again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});