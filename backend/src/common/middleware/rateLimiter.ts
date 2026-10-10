import rateLimit from "express-rate-limit";
import { config } from "../../config/env";

// Skip rate limiting in development mode for seamless local testing
const skipInDevelopment = () => config.nodeEnv === "development";

// Rate limiter for login requests (Prevents brute-force credential guessing)
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInDevelopment,
  message: {
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many login attempts. Please try again after 15 minutes.",
      timestamp: new Date().toISOString()
    }
  }
});

// Rate limiter for public form submissions (Prevents spam submission bots)
export const publicSubmissionRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Max 15 submissions per window
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInDevelopment,
  message: {
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Submission rate limit exceeded. Please wait a few minutes before submitting again.",
      timestamp: new Date().toISOString()
    }
  }
});

// General API protection rate limiter
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Max 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInDevelopment,
  message: {
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests from this IP. Please slow down.",
      timestamp: new Date().toISOString()
    }
  }
});
