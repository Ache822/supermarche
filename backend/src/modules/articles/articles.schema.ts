import { z } from "zod";

const stringOrLocalized = z.union([
  z.string().min(1, "Text is required"),
  z.record(z.string(), z.string()).refine((value) => Object.keys(value).length > 0, {
    message: "Localized fields must include at least one locale"
  })
]);

const baseArticleSchema = z.object({
  slug: z.string().optional(),
  title: stringOrLocalized,
  summary: stringOrLocalized.optional().default(""),
  content: stringOrLocalized.optional(),
  bodyText: stringOrLocalized.optional(),
  author: z.string().optional().default("Supermarche Team"),
  category: z.string().optional().default("General"),
  categoryId: z.string().optional(),
  verified: z.boolean().optional().default(true),
  thumbnail_url: z.string().optional(),
  is_published: z.boolean().optional().default(true),
  display_order: z.number().int().nonnegative().optional().default(0),
  translations: z.record(z.any()).optional()
});

export const articleCreateSchema = baseArticleSchema.transform((data) => ({
  ...data,
  content: data.content || data.bodyText || ""
}));

export const articleUpdateSchema = baseArticleSchema.partial();
