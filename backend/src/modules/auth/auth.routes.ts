import { Router } from "express";
import { loginHandler, logoutHandler, meHandler } from "./auth.controller";
import { loginRateLimiter } from "../../common/middleware/rateLimiter";
import { authenticate } from "../../common/middleware/authMiddleware";

export const authRouter = Router();

authRouter.post("/login", loginRateLimiter, loginHandler);
authRouter.post("/logout", logoutHandler);
authRouter.get("/me", authenticate, meHandler);
