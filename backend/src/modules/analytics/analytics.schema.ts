import { z } from "zod";

export const trackVisitorHitSchema = z.object({
  sessionId: z.string().min(1, "sessionId is required"),
  path: z.string().min(1, "path is required"),
  device: z.string().optional(),
  deviceType: z.string().optional(),
  referrer: z.string().optional(),
  timestamp: z.string().optional()
});

export type TrackVisitorHitInput = z.infer<typeof trackVisitorHitSchema>;
