import { AppPermission } from "./core";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        authId?: string;
        email: string;
        access: string;
        permissions: string[];
      };
    }
  }
}
