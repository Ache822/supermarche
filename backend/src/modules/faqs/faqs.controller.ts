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
        // Customers
        {
          id: "faq-1",
          category: "customers",
          subCategory: "Orders & Shopping",
          question: "How do I place an order on Kim's Store?",
          answer: "Browse our collections (Fashion, Sneakers, Cosmetics, Tech, or Supermarket Pantry), add items to your shopping bag, and proceed to checkout with delivery across Douala, Yaoundé, Buea, or Bamenda.",
          display_order: 1,
          is_published: true,
          is_featured: true,
          translations: {
            fr: {
              question: "Comment passer une commande sur Kim's Store ?",
              answer: "Parcourez nos rayons (Mode, Sneakers, Cosmétiques, Tech ou Supermarché), ajoutez vos articles au panier et validez la commande avec livraison à Douala, Yaoundé, Buea ou Bamenda."
            }
          }
        },
        {
          id: "faq-2",
          category: "customers",
          subCategory: "Delivery & Timelines",
          question: "How fast is delivery and can I track my order?",
          answer: "Supermarket pantry essentials are delivered within 45 to 90 minutes. Fashion, sneakers, and tech products are delivered same-day or next-day with live SMS tracking.",
          display_order: 2,
          is_published: true,
          is_featured: true,
          translations: {
            fr: {
              question: "Quels sont les délais de livraison et puis-je suivre ma commande ?",
              answer: "Les essentiels du supermarché sont livrés en 45 à 90 minutes. La mode et les produits tech sont livrés le jour même ou le lendemain avec suivi GPS en direct."
            }
          }
        },
        {
          id: "faq-3",
          category: "customers",
          subCategory: "Payments & Mobile Money",
          question: "What payment methods are supported on Kim's Store?",
          answer: "We support MTN Mobile Money, Orange Money, Visa/Mastercard debit and credit cards, as well as Cash on Delivery with instant digital receipts.",
          display_order: 3,
          is_published: true,
          is_featured: true,
          translations: {
            fr: {
              question: "Quels modes de paiement sont acceptés sur Kim's Store ?",
              answer: "Nous acceptons MTN Mobile Money, Orange Money, les cartes bancaires Visa/Mastercard ainsi que le paiement en espèces à la livraison."
            }
          }
        },
        {
          id: "faq-4",
          category: "customers",
          subCategory: "Returns & Exchanges",
          question: "What if a shoe or clothing item does not fit my size?",
          answer: "We provide a hassle-free 7-day size exchange guarantee. Request a swap in your order history or chat with Kimzy, and our courier brings the right size.",
          display_order: 4,
          is_published: true,
          is_featured: true,
          translations: {
            fr: {
              question: "Que faire si la pointure ou la taille ne me convient pas ?",
              answer: "Nous offrons une garantie d'échange sous 7 jours. Demandez un échange via votre compte ou Kimzy, et notre livreur vous apporte la bonne taille."
            }
          }
        },
        // Pros (Merchants)
        {
          id: "faq-5",
          category: "pros",
          subCategory: "Merchant Onboarding",
          question: "How can local boutiques or fashion creators sell on Kim's Store?",
          answer: "Apply through our Merchant Partner portal. Submit your catalog, business registration or CNI, and start selling after a swift 48-hour onboarding review.",
          display_order: 5,
          is_published: true,
          is_featured: true,
          translations: {
            fr: {
              question: "Comment vendre mes créations ou ma boutique sur Kim's Store ?",
              answer: "Postulez via notre portail Partenaires Marchands. Soumettez votre catalogue pour vérification sous 48h."
            }
          }
        },
        {
          id: "faq-6",
          category: "pros",
          subCategory: "Payouts & Logistics",
          question: "When and how do Kim's Store partners receive payouts?",
          answer: "Sales revenue is automatically disbursed every Monday directly to your MTN Mobile Money or Orange Money merchant account with zero processing deductions.",
          display_order: 6,
          is_published: true,
          is_featured: true,
          translations: {
            fr: {
              question: "Quand et comment les vendeurs partenaires reçoivent-ils leurs paiements ?",
              answer: "Les revenus des ventes sont versés automatiquement chaque lundi directement sur votre compte MTN MoMo ou Orange Money."
            }
          }
        },
        // Account & Security
        {
          id: "faq-7",
          category: "account",
          subCategory: "Payment & MoMo Security",
          question: "How is my phone number and Mobile Money payment info protected?",
          answer: "Transactions are processed over encrypted banking tunnels with zero storage of your Mobile Money PIN. All OTP prompts are generated directly by MTN or Orange.",
          display_order: 7,
          is_published: true,
          is_featured: true,
          translations: {
            fr: {
              question: "Comment mon numéro et mes paiements Mobile Money sont-ils protégés ?",
              answer: "Les transactions sont traitées via des tunnels bancaires sécurisés sans enregistrement de code PIN. Les invites OTP proviennent directement de votre opérateur."
            }
          }
        },
        {
          id: "faq-8",
          category: "account",
          subCategory: "Password & Sign-In",
          question: "How do I reset my password or update my login credentials?",
          answer: "Click 'Forgot Password' on the login screen or access your Account Profile to receive an instant verification link or SMS OTP to reset your password.",
          display_order: 8,
          is_published: true,
          is_featured: true,
          translations: {
            fr: {
              question: "Comment réinitialiser mon mot de passe ou modifier mes identifiants ?",
              answer: "Cliquez sur 'Mot de passe oublié' sur l'écran de connexion ou accédez à votre profil pour recevoir un lien de réinitialisation sécurisé par SMS ou email."
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
