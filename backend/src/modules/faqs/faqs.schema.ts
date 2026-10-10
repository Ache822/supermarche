import { z } from "zod";

const stringOrLocalized = z.union([
  z.string().min(1, "Text is required"),
  z.record(z.string(), z.string()).refine((value) => Object.keys(value).length > 0, {
    message: "Localized fields must include at least one locale"
  })
]);

export const faqCreateSchema = z.object({
  page: z.string().optional().default("help"),
  category: z.string().optional().default("customers"),
  subCategory: z.string().optional().default("General"),
  sectionTitle: z.string().optional(),
  sectionDescription: z.string().optional(),
  question: stringOrLocalized,
  answer: stringOrLocalized,
  articleSlug: z.string().optional().nullable(),
  anchorId: z.string().optional().nullable(),
  display_order: z.number().int().nonnegative().optional().default(0),
  is_published: z.boolean().optional().default(true),
  is_featured: z.boolean().optional().default(false),
  translations: z.record(z.any()).optional()
});

export const faqUpdateSchema = faqCreateSchema.partial();
