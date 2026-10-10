import { NextFunction, Request, Response } from "express";
import { config } from "../../config/env";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error Logged:", err);
  const status = err.status || 500;
  const code = err.code || (status === 500 ? "INTERNAL_ERROR" : "BAD_REQUEST");

  // In production, mask internal 500 error messages to prevent leakage of DB/stack traces
  const isProduction = config.nodeEnv === "production";
  const userMessage = (isProduction && status === 500)
    ? "An unexpected internal server error occurred. Please try again later."
    : (err.message || "An unexpected error occurred.");

  res.status(status).json({
    error: {
      code,
      message: userMessage,
      details: err.details || undefined,
      timestamp: new Date().toISOString(),
      request_id: req.headers["x-request-id"] || null
    }
  });
};
