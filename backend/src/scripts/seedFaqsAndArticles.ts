import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "../config/database";
import { Faq } from "../modules/faqs/faqs.model";
import { Article } from "../modules/articles/articles.model";

const FAQ_SEED_DATA = [
  // --- CUSTOMER FAQs ---
  {
    page: "help",
    category: "customers",
    subCategory: "Booking & Requests",
    question: "How do I book a service on Supermarche?",
    answer: "Download the Supermarche Mobile App on iOS or Android. Select your required errand or repair (e.g., Gas Refill, Market Errands, Deep Cleaning), set your GPS pin in Douala or Yaoundé, add job description or photos, and confirm dispatch.",
    articleSlug: "guide-to-supermarche-service-booking",
    is_featured: true,
    is_published: true,
    display_order: 1,
    translations: {
      fr: {
        question: "Comment réserver un service sur Supermarche ?",
        answer: "Téléchargez l'application mobile Supermarche sur iOS ou Android. Sélectionnez votre cours ou réparation requise (ex. Recharge Gaz, Achats au Marché, Nettoyage), définissez votre point GPS à Douala ou Yaoundé, et confirmez l'envoi."
      }
    }
  },
  {
    page: "help",
    category: "customers",
    subCategory: "Booking & Requests",
    question: "What is the policy for rescheduling or cancelling a request?",
    answer: "You can cancel or reschedule any pending request free of charge before a Supermarche Pro is dispatched. If cancelled after a Pro is en route (within 10 minutes of arrival), a nominal 1,000 FCFA runner compensation fee applies.",
    articleSlug: "guide-to-supermarche-service-booking",
    is_featured: true,
    is_published: true,
    display_order: 2,
    translations: {
      fr: {
        question: "Quelle est la politique de modification ou d'annulation ?",
        answer: "Vous pouvez annuler ou modifier toute demande en attente gratuitement avant l'envoi d'un Pro. Si annulé après le départ du Pro, des frais de compensation de 1 000 FCFA s'appliquent."
      }
    }
  },
  {
    page: "help",
    category: "customers",
    subCategory: "Booking & Requests",
    question: "How do emergency requests work (gas leaks, burst pipes)?",
    answer: "Mark your booking as 'Urgent Dispatch' in the app. Our priority radar dispatches the nearest verified Supermarche runner within 5 minutes, backed by 24/7 direct telephone support.",
    articleSlug: "guide-to-supermarche-service-booking",
    is_featured: false,
    is_published: true,
    display_order: 3,
    translations: {
      fr: {
        question: "Comment fonctionnent les demandes d'urgence (fuite de gaz, tuyaux percés) ?",
        answer: "Marquez votre réservation comme 'Envoi Urgent' dans l'application. Notre radar de priorité dépêche le coursier vérifié le plus proche en moins de 5 minutes."
      }
    }
  },
  {
    page: "help",
    category: "customers",
    subCategory: "Payments & Pricing",
    question: "What payment methods are accepted on Supermarche?",
    answer: "We support Online Payment via MTN Mobile Money, Orange Money, and Visa/Mastercard credit/debit cards, as well as On-Site Payment (Cash to Pro) upon job completion.",
    articleSlug: "payment-methods-and-escrow-refunds",
    is_featured: true,
    is_published: true,
    display_order: 4,
    translations: {
      fr: {
        question: "Quels modes de paiement sont acceptés sur Supermarche ?",
        answer: "Nous acceptons le paiement en ligne via MTN Mobile Money, Orange Money, Visa/Mastercard, ainsi que le paiement en espèces sur place à la fin du travail."
      }
    }
  },
  {
    page: "help",
    category: "customers",
    subCategory: "Payments & Pricing",
    question: "How are service prices, diagnostics, and extra materials calculated?",
    answer: "Standard errands (cooking gas, market delivery) have transparent fixed prices shown in-app. For complex repairs, a standard 2,000 FCFA diagnostic fee covers on-site inspection. If extra replacement parts are required, the Pro provides an itemized digital receipt in the app before purchase.",
    articleSlug: "payment-methods-and-escrow-refunds",
    is_featured: false,
    is_published: true,
    display_order: 5,
    translations: {
      fr: {
        question: "Comment sont calculés les prix des services et diagnostics ?",
        answer: "Les courses standard ont des prix fixes transparents. Pour les réparations complexes, des frais de diagnostic de 2 000 FCFA couvrent l'inspection sur place."
      }
    }
  },
  {
    page: "help",
    category: "customers",
    subCategory: "Payments & Pricing",
    question: "How do refunds and dispute resolution work?",
    answer: "If a job is incomplete or unsatisfactory, tap 'Report Issue' in your app order history or chat with Supermarche Bot Live Support within 48 hours. Funds held in Mobile Money escrow are refunded directly to your MoMo/Orange Money wallet after review.",
    articleSlug: "payment-methods-and-escrow-refunds",
    is_featured: true,
    is_published: true,
    display_order: 6,
    translations: {
      fr: {
        question: "Comment fonctionnent les remboursements et la résolution des litiges ?",
        answer: "Si un travail est incomplet, appuyez sur 'Signaler un problème' dans l'historique ou discutez avec le support en direct sous 48 heures. Les fonds retenus en séquestre MoMo sont remboursés après examen."
      }
    }
  },

  // --- SERVICE PRO (PROS) FAQs ---
  {
    page: "become-a-provider",
    category: "pros",
    subCategory: "Getting Started & Onboarding",
    question: "How do I register as a Supermarche Service Pro?",
    answer: "Download the 'Supermarche Provider' app, submit your CNI copy, proof of residence, trade certification or references, and complete our 30-minute safety orientation session.",
    articleSlug: "pro-onboarding-and-verification-guide",
    is_featured: true,
    is_published: true,
    display_order: 10,
    translations: {
      fr: {
        question: "Comment m'inscrire en tant que Prestataire Supermarche Pro ?",
        answer: "Téléchargez l'application 'Supermarche Provider', soumettez votre CNI, justificatif de domicile, certification de métier et suivez la session d'orientation de 30 minutes."
      }
    }
  },
  {
    page: "become-a-provider",
    category: "pros",
    subCategory: "Getting Started & Onboarding",
    question: "How long does background check and profile verification take?",
    answer: "Profile verification typically takes 24 to 48 business hours. Once verified, you will receive an SMS and push notification to activate your account and start accepting nearby jobs.",
    articleSlug: "pro-onboarding-and-verification-guide",
    is_featured: false,
    is_published: true,
    display_order: 11,
    translations: {
      fr: {
        question: "Combien de temps prend la vérification du profil et des antécédents ?",
        answer: "La vérification du profil prend généralement entre 24 et 48 heures ouvrables. Vous recevrez un SMS dès que votre compte sera activé."
      }
    }
  },
  {
    page: "become-a-provider",
    category: "pros",
    subCategory: "Managing Jobs & Earnings",
    question: "When and how do Pros receive earnings for online payments?",
    answer: "Earnings for Mobile Money and Card payments are transferred automatically every Monday directly to your registered MTN Mobile Money or Orange Money account with zero transfer fees.",
    articleSlug: "pro-onboarding-and-verification-guide",
    is_featured: true,
    is_published: true,
    display_order: 14,
    translations: {
      fr: {
        question: "Quand et comment les Pros reçoivent-ils leurs gains ?",
        answer: "Les gains pour les paiements en ligne sont transférés automatiquement chaque lundi directement vers votre compte MTN Mobile Money ou Orange Money sans frais de transfert."
      }
    }
  }
];

const ARTICLE_SEED_DATA = [
  {
    slug: "guide-to-supermarche-service-booking",
    category: "Booking & Requests",
    title: "Complete Guide to Booking Errand & Home Delivery Services",
    summary: "Step-by-step instructions on setting GPS pins, selecting services, and scheduling express deliveries in Douala and Yaoundé.",
    content: "<h3>Booking Your Service</h3><p>Download the Supermarche Mobile App on iOS or Android. Select your required errand or repair (e.g. Gas Refill, Market Errands, Deep Cleaning), set your GPS pin in Douala or Yaoundé, add job description or photos, and confirm dispatch.</p>",
    display_order: 1,
    is_published: true,
    translations: {
      fr: {
        title: "Guide complet de réservation de coursier et livraison à domicile",
        summary: "Instructions étape par étape pour définir vos coordonnées GPS et programmer des livraisons express à Douala et Yaoundé.",
        content: "<h3>Réserver votre service</h3><p>Téléchargez l'application mobile Supermarche sur iOS ou Android. Sélectionnez votre cours ou réparation (ex. Recharge Gaz, Achats au Marché, Nettoyage), définissez votre position GPS à Douala ou Yaoundé, ajoutez des photos et confirmez l'envoi.</p>"
      }
    }
  },
  {
    slug: "payment-methods-and-escrow-refunds",
    category: "Payments & Pricing",
    title: "Understanding Mobile Money Payments, Escrow & Refund Protection",
    summary: "Detailed overview of MTN MoMo, Orange Money, card payments, and 48-hour escrow protection.",
    content: "<h3>Payment & Escrow Protection</h3><p>We support Online Payment via MTN Mobile Money, Orange Money, and Visa/Mastercard credit/debit cards, as well as On-Site Payment (Cash to Pro) upon job completion. All online payments are held in Mobile Money escrow until job completion.</p>",
    display_order: 2,
    is_published: true,
    translations: {
      fr: {
        title: "Comprendre les paiements Mobile Money, le séquestre et la protection des remboursements",
        summary: "Présentation détaillée de MTN MoMo, Orange Money, paiements par carte et protection séquestre sous 48 heures.",
        content: "<h3>Protection des paiements et du séquestre</h3><p>Nous acceptons les paiements en ligne via MTN Mobile Money, Orange Money et cartes Visa/Mastercard. Tous les paiements en ligne sont sécurisés en séquestre jusqu'à la fin de la prestation.</p>"
      }
    }
  },
  {
    slug: "pro-onboarding-and-verification-guide",
    category: "Getting Started & Onboarding",
    title: "Service Pro Onboarding & Background Verification Manual",
    summary: "Requirements for CNI identity checks, police clearance, and trade skill verification for technicians.",
    content: "<h3>Becoming a Supermarche Pro</h3><p>Download the 'Supermarche Provider' app, submit your CNI copy, proof of residence, trade certification or references, and complete our 30-minute safety orientation session.</p>",
    display_order: 3,
    is_published: true,
    translations: {
      fr: {
        title: "Manuel d'intégration des Prestataires et vérification d'identité Pro",
        summary: "Exigences pour la vérification CNI, contrôle d'antécédents et validation des compétences pour les techniciens.",
        content: "<h3>Devenir un Pro Supermarche</h3><p>Téléchargez l'application 'Supermarche Provider', soumettez votre CNI, preuve de domicile et certification professionnelle, puis suivez notre session d'orientation de 30 minutes.</p>"
      }
    }
  }
];

const seedFaqsAndArticles = async () => {
  try {
    await connectDatabase();
    console.log("Seeding Dual-Language FAQs and Articles into MongoDB Atlas...");

    await Faq.deleteMany({});
    await Article.deleteMany({});

    await Faq.insertMany(FAQ_SEED_DATA);
    await Article.insertMany(ARTICLE_SEED_DATA);

    console.log(`Successfully seeded ${FAQ_SEED_DATA.length} FAQs and ${ARTICLE_SEED_DATA.length} Help Articles with EN/FR translations!`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedFaqsAndArticles();
