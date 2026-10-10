import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config/env";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const tokenFromCookie = req.cookies?.["__Secure-api-token"] || req.cookies?.["api-token"];
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : undefined;

  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication token is missing or invalid.",
        timestamp: new Date().toISOString(),
        request_id: req.headers["x-request-id"] || null
      }
    });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    (req as any).user = payload;
    next();
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Invalid token signature";
    return res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: `Authentication failed: ${reason}`,
        timestamp: new Date().toISOString(),
        request_id: req.headers["x-request-id"] || null
      }
    });
  }
};

export const optionalAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  const tokenFromCookie = req.cookies?.["__Secure-api-token"] || req.cookies?.["api-token"];
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : undefined;

  const token = tokenFromCookie || tokenFromHeader;
  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    (req as any).user = payload;
  } catch {
    // Silently continue for unauthenticated / expired tokens on optional routes
  }
  next();
};

