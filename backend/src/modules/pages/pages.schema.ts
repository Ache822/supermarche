import { z } from "zod";

const localizedString = z.record(z.string(), z.string()).refine((value) => Object.keys(value).length > 0, {
  message: "Localized fields must include at least one locale"
});

export const pageCreateSchema = z.object({
  slug: z.string().min(1),
  meta_title: localizedString,
  meta_description: localizedString,
  is_published: z.boolean().default(false)
});

export const pageSectionSchema = z.object({
  page_id: z.string().min(1),
  category: z.string().min(1).describe("Used to group content in the admin dashboard"),
  type: z.string().min(1),
  display_order: z.number().int().nonnegative(),
  content: z.record(z.string(), z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    body: z.string().optional()
  }).passthrough()),
  is_active: z.boolean().default(true)
});
