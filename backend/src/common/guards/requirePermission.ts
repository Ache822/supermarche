import { NextFunction, Request, Response } from "express";

export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userAccess = (req.user as any)?.access;
    const permissions = (req.user as any)?.permissions ?? [];

    // SUPER_ADMIN Access Bypass (or wildcard '*' permission)
    if (userAccess === "SUPER_ADMIN" || permissions.includes("*")) {
      return next();
    }

    if (!permissions.includes(permission)) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action.",
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    next();
  };
};
