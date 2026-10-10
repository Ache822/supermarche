import { z } from "zod";

export const submitApplicationSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    contactType: z.enum(["whatsapp", "email"], {
      errorMap: () => ({ message: "Contact type must be either 'whatsapp' or 'email'" })
    }),
    contactValue: z.string().min(3, "Contact detail is required"),
    location: z.string().min(2, "Location is required"),
    serviceType: z.string().min(2, "Service type is required")
  })
  .superRefine((data, ctx) => {
    if (data.contactType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.contactValue.trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid email address for email contact option.",
          path: ["contactValue"]
        });
      }
    } else if (data.contactType === "whatsapp") {
      const cleanPhone = data.contactValue.replace(/[\s\-\(\)]/g, "");
      const phoneRegex = /^(\+?[0-9]{8,15})$/;
      if (!phoneRegex.test(cleanPhone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid phone number (e.g. +237670000000) for WhatsApp contact option.",
          path: ["contactValue"]
        });
      }
    }
  });

export const updateApplicationStatusSchema = z.object({
  status: z.string().transform((val) => {
    const upper = val.toUpperCase();
    if (upper === "APPROVED") return "ACCEPTED";
    if (upper === "DECLINED") return "REJECTED";
    return upper;
  }).pipe(
    z.enum(["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"], {
      errorMap: () => ({ message: "Invalid application status" })
    })
  )
});

export const sendApplicationEmailSchema = z.object({
  subject: z.string().min(1, "Subject line is required"),
  body: z.string().min(1, "Email body message is required"),
  recipientEmail: z.string().email("Valid recipient email address required").optional(),
  badgeText: z.string().optional().default("Pro Application Update"),
  subHeaderBadge: z.string().optional().default("Partner Operations"),
  highlightBoxText: z.string().optional(),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional()
});

export type SubmitApplicationInput = z.infer<typeof submitApplicationSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
export type SendApplicationEmailInput = z.infer<typeof sendApplicationEmailSchema>;
