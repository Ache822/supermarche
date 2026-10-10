import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import {
  submitApplicationSchema,
  updateApplicationStatusSchema,
  sendApplicationEmailSchema
} from "./applications.schema";
import { Application } from "./applications.model";
import { getPaginatedData } from "../../common/utils/pagination";
import { sendEmail } from "../../common/services/email.service";
import { renderSupermarcheEmailHtml } from "../../common/templates/emailTemplateRenderer";

// Helper to query application by either MongoDB ObjectId or custom string ID (e.g. APP-2026-02)
const findApplicationByIdOrString = async (id: string) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const app = await Application.findById(id);
    if (app) return app;
  }
  return await Application.findOne({
    $or: [{ id }, { applicationId: id }]
  });
};

export const submitApplicationHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = submitApplicationSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_FAILED",
          message: "Application submission validation failed.",
          details: parseResult.error.errors.map((e) => ({
            field: e.path.join("."),
            issue: e.message
          })),
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    const application = await Application.create(parseResult.data);

    console.log(`[NOTIFICATION] New Provider Application submitted by ${application.fullName} for ${application.serviceType} in ${application.location}`);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      data: {
        id: application._id,
        submittedAt: application.submittedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

export const listApplicationsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = req.query.status ? String(req.query.status) : undefined;
    const filter = status ? { status } : {};

    const result = await getPaginatedData(req, Application, filter, { sort: "-createdAt" });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getApplicationByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const application = await findApplicationByIdOrString(id);

    if (!application) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Application not found.",
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatusHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const parseResult = updateApplicationStatusSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_FAILED",
          message: "Status update validation failed.",
          details: parseResult.error.errors.map((e) => ({
            field: e.path.join("."),
            issue: e.message
          })),
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    const application = await findApplicationByIdOrString(id);

    if (!application) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Application not found.",
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    application.status = parseResult.data.status;
    await application.save();

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

export const sendApplicationEmailHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const parseResult = sendApplicationEmailSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_FAILED",
          message: "Application email validation failed.",
          details: parseResult.error.errors.map((e) => ({
            field: e.path.join("."),
            issue: e.message
          })),
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    const application = await findApplicationByIdOrString(id);

    if (!application) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Service provider application not found.",
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    // Determine target recipient email address
    const recipientEmail =
      parseResult.data.recipientEmail ||
      (application.contactType === "email" ? application.contactValue : null);

    if (!recipientEmail) {
      return res.status(400).json({
        error: {
          code: "MISSING_RECIPIENT_EMAIL",
          message: "Applicant registered via WhatsApp phone line. Please provide recipientEmail in request body to deliver via email.",
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    // Render reusable email template with applicant details
    const emailHtml = await renderSupermarcheEmailHtml({
      title: parseResult.data.subject,
      body: parseResult.data.body,
      recipientName: application.fullName,
      badgeText: parseResult.data.badgeText,
      subHeaderBadge: parseResult.data.subHeaderBadge,
      highlightBoxText: parseResult.data.highlightBoxText,
      ctaText: parseResult.data.ctaText,
      ctaUrl: parseResult.data.ctaUrl
    });

    // Dispatch email via Nodemailer/Mailtrap
    const dispatchResult = await sendEmail({
      to: recipientEmail,
      subject: parseResult.data.subject,
      text: parseResult.data.body.replace(/<[^>]*>/g, ""),
      html: emailHtml
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      dispatch: dispatchResult
    });
  } catch (error) {
    next(error);
  }
};
