import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters."),
  slug: z.string().min(2, "Slug must be at least 2 characters."),
  description: z.string().optional(),
  iconName: z.string().optional(),
  display_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
  parent: z.string().nullable().optional(),
  translations: z.record(z.any()).optional()
});

export const updateCategorySchema = createCategorySchema.partial();

export const createProductSchema = z.object({
  id: z.string().min(2, "Product ID must be at least 2 characters."),
  title: z.string().min(2, "Title must be at least 2 characters."),
  category: z.string().min(1, "Category ID is required."),
  description: z.string().min(5, "Description must be at least 5 characters."),
  shortDescription: z.string().optional(),
  price: z.number().nonnegative().optional().default(0),
  compareAtPrice: z.number().optional(),
  priceRange: z.string().optional().default("$$"),
  estimatedTime: z.string().optional().default("Fast Delivery"),
  images: z.array(z.string()).optional().default([]),
  imageUrl: z.string().optional(),
  iconName: z.string().optional().default("ShoppingBag"),
  stockQuantity: z.number().int().nonnegative().optional().default(50),
  inStock: z.boolean().optional().default(true),
  isLive: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional(),
  sku: z.string().optional(),
  translations: z.record(z.any()).optional()
});

export const updateProductSchema = createProductSchema.partial();

export const batchVisibilitySchema = z.object({
  productIds: z.array(z.string()).optional(),
  serviceIds: z.array(z.string()).optional(),
  isLive: z.boolean()
});
