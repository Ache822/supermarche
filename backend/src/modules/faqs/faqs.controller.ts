import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { faqCreateSchema, faqUpdateSchema } from "./faqs.schema";
import { Faq } from "./faqs.model";
import { getPaginatedData } from "../../common/utils/pagination";
import { getRequestedLanguage, localizeArray } from "../../common/utils/localize";
import { autoTranslateObject } from "../../common/services/autoTranslate.service";
import { Article } from "../articles/articles.model";

// Helper to safely extract string from string or localized object
const extractStringField = (val: any, fallback = ""): string => {
  if (typeof val === "string") return val;
  if (val && typeof val === "object") {
    return val.en || val.fr || Object.values(val)[0] || fallback;
  }
  return fallback;
};

// Helper to query FAQ by either MongoDB ObjectId or custom string ID
const findFaqByIdOrString = async (identifier: string) => {
  if (!identifier || identifier === "undefined" || identifier === "null") return null;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const doc = await Faq.findById(identifier);
    if (doc) return doc;
  }
  return await Faq.findOne({ $or: [{ id: identifier }, { _id: identifier }] });
};

export const getPublicFaqsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, featured, page } = req.query;
    const filter: any = { is_published: true };

    if (category) filter.category = String(category);
    if (featured === "true") filter.is_featured = true;

    if (page && String(page) !== "all") {
      filter.$or = [{ page: String(page) }, { page: "all" }, { page: { $exists: false } }];
    }

    let faqs: any[] = [];
    if (mongoose.connection.readyState >= 1) {
      try {
        faqs = await Faq.find(filter).sort({ display_order: 1, createdAt: -1 }).lean();
      } catch {
        // Ignore DB error
      }
    }

    if (faqs.length === 0) {
      faqs = [
        {
          id: "faq-1",
          category: "Delivery",
          question: "How fast is cooking gas delivered to my home?",
          answer: "Gas cylinders are delivered and safety installed within 30 to 45 minutes of order placement.",
          display_order: 1,
          is_published: true,
          is_featured: true,
          translations: {
            fr: {
              question: "À quelle vitesse le gaz de cuisine est-il livré ?",
              answer: "Les bouteilles de gaz sont livrées et installées en toute sécurité dans un délai de 30 à 45 minutes."
            }
          }
        },
        {
          id: "faq-2",
          category: "Services",
          question: "Can I become a Supermarche service provider?",
          answer: "Yes! Fill out our online Provider Application form under 'Become a Partner' and our team will contact you via WhatsApp or Email.",
          display_order: 2,
          is_published: true,
          is_featured: true,
          translations: {
            fr: {
              question: "Puis-je devenir un prestataire de services Supermarche ?",
              answer: "Oui ! Remplissez notre formulaire de candidature en ligne et notre équipe vous contactera via WhatsApp ou Email."
            }
          }
        },
        {
          id: "faq-3",
          category: "Payment",
          question: "What payment methods are accepted?",
          answer: "We accept Mobile Money (MTN MoMo, Orange Money) and Cash on Delivery.",
          display_order: 3,
          is_published: true,
          is_featured: true,
          translations: {
            fr: {
              question: "Quels modes de paiement sont acceptés ?",
              answer: "Nous acceptons Mobile Money (MTN MoMo, Orange Money) et le paiement en espèces à la livraison."
            }
          }
        }
      ];
    }

    const requestedLang = getRequestedLanguage(req);
    const localizedFaqs = localizeArray(faqs, requestedLang);

    let sectionTitle = requestedLang === "fr" ? "Foire Aux Questions" : "Frequently Asked Questions";
    let sectionDescription = requestedLang === "fr"
      ? "Trouvez des réponses rapides aux questions fréquemment posées sur nos services et notre processus."
      : "Find quick answers to common questions about our services and process.";

    if (localizedFaqs.length > 0) {
      if (localizedFaqs[0].sectionTitle) sectionTitle = localizedFaqs[0].sectionTitle;
      if (localizedFaqs[0].sectionDescription) sectionDescription = localizedFaqs[0].sectionDescription;
    }

    res.status(200).json({
      page: page ? String(page) : "all",
      category: category ? String(category) : "all",
      sectionTitle,
      sectionDescription,
      count: localizedFaqs.length,
      data: localizedFaqs
    });
  } catch (error) {
    next(error);
  }
};

export const searchFaqsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = req.query.q ? String(req.query.q).trim() : "";
    if (!q) {
      return res.status(200).json({ query: "", faqs: [], articles: [] });
    }

    const regex = new RegExp(q, "i");
    const requestedLang = getRequestedLanguage(req);

    const [rawFaqs, rawArticles] = await Promise.all([
      Faq.find({
        is_published: true,
        $or: [{ question: regex }, { answer: regex }, { subCategory: regex }, { category: regex }]
      })
        .limit(10)
        .lean(),
      Article.find({
        is_published: true,
        $or: [{ title: regex }, { summary: regex }, { content: regex }, { category: regex }]
      })
        .limit(10)
        .lean()
    ]);

    const faqs = localizeArray(rawFaqs, requestedLang);
    const articles = localizeArray(rawArticles, requestedLang);

    res.status(200).json({
      query: q,
      faqs,
      articles
    });
  } catch (error) {
    next(error);
  }
};

export const listAllFaqsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getPaginatedData(req, Faq, {}, { sort: "display_order" });
    const requestedLang = getRequestedLanguage(req);
    const localizedFaqs = localizeArray(result.data, requestedLang);

    res.status(200).json({
      data: localizedFaqs,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
};

export const createFaqHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = faqCreateSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_FAILED",
          message: "FAQ validation failed.",
          details: parseResult.error.errors.map((error) => ({
            field: error.path.join("."),
            issue: error.message
          })),
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    const rawData = parseResult.data;
    const questionStr = extractStringField(rawData.question, "");
    const answerStr = extractStringField(rawData.answer, "");

    const faqData: Record<string, any> = {
      ...rawData,
      question: questionStr,
      answer: answerStr
    };

    // Auto-generate French translations if not provided manually
    if (!faqData.translations?.fr?.question || !faqData.translations?.fr?.answer) {
      const autoFr = await autoTranslateObject(
        { question: questionStr, answer: answerStr },
        ["question", "answer"],
        "fr"
      );
      faqData.translations = {
        ...(faqData.translations || {}),
        fr: {
          ...(faqData.translations?.fr || {}),
          ...autoFr
        }
      };
    }

    const newFaq = await Faq.create(faqData as any);
    res.status(201).json({ success: true, id: newFaq._id, data: newFaq });
  } catch (error) {
    next(error);
  }
};

export const updateFaqHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id || id === "undefined" || id === "null") {
    return res.status(400).json({
      error: {
        code: "VALIDATION_FAILED",
        message: "Invalid or missing FAQ ID parameter in request URL path.",
        timestamp: new Date().toISOString()
      }
    });
  }

  const parseResult = faqUpdateSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_FAILED",
        message: "FAQ update validation failed.",
        details: parseResult.error.errors.map((error) => ({
          field: error.path.join("."),
          issue: error.message
        })),
        timestamp: new Date().toISOString(),
        request_id: req.headers["x-request-id"] || null
      }
    });
  }

  try {
    const faqDoc = await findFaqByIdOrString(id);
    if (!faqDoc) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "FAQ not found.",
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    const rawData = parseResult.data;
    const updateData: Record<string, any> = { ...rawData };

    if (rawData.question !== undefined) updateData.question = extractStringField(rawData.question, faqDoc.question);
    if (rawData.answer !== undefined) updateData.answer = extractStringField(rawData.answer, faqDoc.answer);

    const docObject = faqDoc.toObject();
    const existingTranslations = docObject.translations || {};

    // Auto-generate French translations if question or answer is updated
    if (updateData.question || updateData.answer) {
      const autoFr = await autoTranslateObject(
        {
          question: updateData.question || faqDoc.question,
          answer: updateData.answer || faqDoc.answer
        },
        ["question", "answer"],
        "fr"
      );
      updateData.translations = {
        ...existingTranslations,
        ...(updateData.translations || {}),
        fr: {
          ...(existingTranslations.fr || {}),
          ...(updateData.translations?.fr || {}),
          ...autoFr
        }
      };
    }

    Object.assign(faqDoc, updateData);
    await faqDoc.save();

    res.status(200).json({ success: true, data: faqDoc });
  } catch (error) {
    next(error);
  }
};

export const deleteFaqHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id || id === "undefined" || id === "null") {
    return res.status(400).json({
      error: {
        code: "VALIDATION_FAILED",
        message: "Invalid or missing FAQ ID parameter in request URL path.",
        timestamp: new Date().toISOString()
      }
    });
  }

  try {
    const faqDoc = await findFaqByIdOrString(id);
    if (!faqDoc) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "FAQ not found.",
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    await Faq.findByIdAndDelete(faqDoc._id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
