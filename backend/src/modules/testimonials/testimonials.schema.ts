import { z } from "zod";

export const submitTestimonialSchema = z.object({
  authorName: z.string().min(2, "Author name must be at least 2 characters"),
  authorRole: z.string().optional().default("Verified Client"),
  avatarUrl: z.string().optional().nullable(),
  rating: z.number().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5").default(5),
  content: z.string().min(5, "Content review text must be at least 5 characters"),
  serviceUsed: z.string().optional().nullable(),
  consentToPublish: z.boolean({
    required_error: "Explicit consent to publish checkbox is required"
  })
});

export const updateTestimonialStatusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"], {
    errorMap: () => ({ message: "Status must be PENDING, APPROVED, or REJECTED" })
  })
});

export const toggleFeaturedSchema = z.object({
  isFeatured: z.boolean({
    required_error: "isFeatured boolean flag is required"
  })
});

export type SubmitTestimonialInput = z.infer<typeof submitTestimonialSchema>;
export type UpdateTestimonialStatusInput = z.infer<typeof updateTestimonialStatusSchema>;
export type ToggleFeaturedInput = z.infer<typeof toggleFeaturedSchema>;
