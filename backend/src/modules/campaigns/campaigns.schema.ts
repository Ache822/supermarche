import { z } from "zod";

export const subscribeSchema = z.object({
  email: z.string().email("Valid email address required"),
  source: z.string().optional().default("website_organic")
});

export const broadcastSchema = z.object({
  subject: z.string().optional(),
  title: z.string().optional(),
  body: z.string().optional(),
  contentHtml: z.string().optional(),
  recipientName: z.string().optional(),
  highlightBoxText: z.string().optional(),
  ctaText: z.string().optional().default("Claim Discount Now"),
  ctaUrl: z.string().optional().default("https://supermarche.cm/services"),
  segment: z.string().optional().default("all"),
  audience: z.string().optional(),
  targetCity: z.string().optional(),
  isDraft: z.boolean().optional(),
  testEmail: z.string().email().optional()
}).transform((data) => ({
  ...data,
  subject: data.subject || data.title || "Supermarche Official Announcement",
  body: data.body || data.contentHtml || "No content body provided."
}));

export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type BroadcastInput = z.infer<typeof broadcastSchema>;
