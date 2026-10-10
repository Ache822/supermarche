import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().optional(),
  permissions: z.array(z.string()).min(1)
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  fullName: z.string().optional(),
  is_active: z.boolean().optional(),
  permissions: z.array(z.string()).min(1).optional()
});

export const inviteUserSchema = z.object({
  email: z.string().email("Valid email address is required"),
  permissions: z.array(z.string()).min(1, "At least one permission must be assigned"),
  expires_in_minutes: z.number().optional().default(1440)
});

export const acceptInviteSchema = z.object({
  token: z.string().min(1, "Invitation token is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  fullName: z.string().optional()
});
