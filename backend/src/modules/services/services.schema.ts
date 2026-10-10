import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional().default(""),
  iconName: z.string().optional().default("Grid"),
  display_order: z.number().optional().default(0),
  is_active: z.boolean().optional().default(true),
  parent: z.string().nullable().optional().default(null),
  translations: z.record(z.any()).optional()
});

export const updateCategorySchema = createCategorySchema.partial();

export const serviceCreateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1, "Category ObjectId reference is required"),
  description: z.string().min(1),
  priceRange: z.string().min(1),
  estimatedTime: z.string().min(1),
  iconName: z.string().min(1),
  isLive: z.boolean().default(true),
  featured: z.boolean().optional().default(false),
  imageUrl: z.string().optional(),
  translations: z.record(z.any()).optional()
});

export const createServiceSchema = serviceCreateSchema;
export const serviceUpdateSchema = serviceCreateSchema.partial().omit({ id: true });
export const updateServiceSchema = serviceUpdateSchema;

export const batchToggleVisibilitySchema = z.object({
  serviceIds: z.array(z.string()).min(1, "At least one service ID is required"),
  isLive: z.boolean()
});

export const batchVisibilitySchema = batchToggleVisibilitySchema;
