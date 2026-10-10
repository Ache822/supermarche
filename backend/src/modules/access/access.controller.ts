import { Request, Response } from "express";
import { AVAILABLE_PERMISSIONS } from "../../config/permissions";

export const listPermissionsHandler = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      permissions: AVAILABLE_PERMISSIONS.map((p) => ({
        action: p,
        module: p.split(":")[0],
        description: null
      }))
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to list available permissions.",
        timestamp: new Date().toISOString(),
        request_id: req.headers["x-request-id"] || null
      }
    });
  }
};
