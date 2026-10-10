import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "../config/database";
import { Category, Service } from "../modules/services/services.model";
import { Faq } from "../modules/faqs/faqs.model";
import { Article } from "../modules/articles/articles.model";

const CATEGORY_SEED = [
  {
    name: "Home & Essential Services",
    slug: "home-essential-services",
    description: "On-demand household utilities, express gas refills, and home maintenance.",
    iconName: "Home",
    display_order: 1,
    is_active: true,
    translations: {
      fr: {
        name: "Services à Domicile et Essentiels",
        description: "Services ménagers à la demande, recharge rapide de gaz et entretien de maison."
      }
    }
  },
  {
    name: "Errands & Market Delivery",
    slug: "errands-market-delivery",
    description: "Personal shopping, fresh market food items, and fast document delivery.",
    iconName: "ShoppingBag",
    display_order: 2,
    is_active: true,
    translations: {
      fr: {
        name: "Courses et Livraison du Marché",
        description: "Achats personnels, produits frais du marché et livraison rapide de documents."
      }
    }
  },
  {
    name: "Technical Repairs & Security",
    slug: "technical-repairs-security",
    description: "Certified plumbing, electrical repairs, appliance fixes, and CCTV installation.",
    iconName: "Wrench",
    display_order: 3,
    is_active: true,
    translations: {
      fr: {
        name: "Réparations Techniques et Sécurité",
        description: "Plomberie certifiée, réparations électriques, dépannage d'appareils et installation CCTV."
      }
    }
  }
];

const FAQ_SEED = [
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
        answer: "Téléchargez l'application mobile Supermarche sur iOS ou Android. Sélectionnez votre cours ou réparation (ex. Recharge Gaz, Achats au Marché, Nettoyage), définissez votre position GPS à Douala ou Yaoundé, et confirmez l'envoi."
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
        answer: "Vous pouvez annuler ou modifier toute demande gratuitement avant le départ du coursier. Si annulé après le départ du Pro, des frais de compensation de 1 000 FCFA s'appliquent."
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
    display_order: 3,
    translations: {
      fr: {
        question: "Quels modes de paiement sont acceptés sur Supermarche ?",
        answer: "Nous acceptons le paiement en ligne via MTN Mobile Money, Orange Money, Visa/Mastercard, ainsi que le paiement en espèces sur place à la fin de la prestation."
      }
    }
  },
  {
    page: "become-a-provider",
    category: "pros",
    subCategory: "Getting Started & Onboarding",
    question: "How do I register as a Supermarche Service Pro?",
    answer: "Download the 'Supermarche Provider' app, submit your CNI copy, proof of residence, trade certification or references, and complete our 30-minute safety orientation session.",
    articleSlug: "pro-onboarding-and-verification-guide",
    is_featured: true,
    is_published: true,
    display_order: 4,
    translations: {
      fr: {
        question: "Comment m'inscrire en tant que Prestataire Supermarche Pro ?",
        answer: "Téléchargez l'application 'Supermarche Provider', soumettez votre CNI, justificatif de domicile et certification professionnelle, puis suivez la session d'orientation de 30 minutes."
      }
    }
  }
];

const ARTICLE_SEED = [
  {
    slug: "guide-to-supermarche-service-booking",
    category: "Booking & Requests",
    title: "Complete Guide to Booking Errand & Home Delivery Services",
    summary: "Step-by-step instructions on setting GPS pins, selecting services, and scheduling express deliveries in Douala and Yaoundé.",
    content: "<h3>Booking Your Service</h3><p>Download the Supermarche Mobile App on iOS or Android. Select your required errand or repair, set your GPS pin in Douala or Yaoundé, and confirm dispatch.</p>",
    display_order: 1,
    is_published: true,
    translations: {
      fr: {
        title: "Guide complet de réservation de coursier et livraison à domicile",
        summary: "Instructions étape par étape pour définir vos coordonnées GPS et programmer des livraisons express à Douala et Yaoundé.",
        content: "<h3>Réserver votre service</h3><p>Téléchargez l'application mobile Supermarche sur iOS ou Android. Sélectionnez votre cours ou réparation, définissez votre position GPS à Douala ou Yaoundé, et confirmez l'envoi.</p>"
      }
    }
  },
  {
    slug: "payment-methods-and-escrow-refunds",
    category: "Payments & Pricing",
    title: "Understanding Mobile Money Payments, Escrow & Refund Protection",
    summary: "Detailed overview of MTN MoMo, Orange Money, card payments, and 48-hour escrow protection.",
    content: "<h3>Payment & Escrow Protection</h3><p>We support Online Payment via MTN Mobile Money, Orange Money, and Visa/Mastercard. All online payments are held in Mobile Money escrow until job completion.</p>",
    display_order: 2,
    is_published: true,
    translations: {
      fr: {
        title: "Comprendre les paiements Mobile Money, le séquestre et les remboursements",
        summary: "Présentation détaillée de MTN MoMo, Orange Money, paiements par carte et protection séquestre sous 48 heures.",
        content: "<h3>Protection des paiements et du séquestre</h3><p>Nous acceptons les paiements en ligne via MTN Mobile Money, Orange Money et cartes bancaires. Tous les paiements en ligne sont sécurisés en séquestre jusqu'à la fin de la prestation.</p>"
      }
    }
  },
  {
    slug: "pro-onboarding-and-verification-guide",
    category: "Getting Started & Onboarding",
    title: "Service Pro Onboarding & Background Verification Manual",
    summary: "Requirements for CNI identity checks, police clearance, and trade skill verification for technicians.",
    content: "<h3>Becoming a Supermarche Pro</h3><p>Download the 'Supermarche Provider' app, submit your CNI copy, proof of residence, trade certification, and complete our 30-minute safety orientation session.</p>",
    display_order: 3,
    is_published: true,
    translations: {
      fr: {
        title: "Manuel d'intégration des Prestataires et vérification d'identité Pro",
        summary: "Exigences pour la vérification CNI, contrôle d'antécédents et validation des compétences pour les techniciens.",
        content: "<h3>Devenir un Pro Supermarche</h3><p>Téléchargez l'application 'Supermarche Provider', soumettez votre CNI, preuve de domicile et certification professionnelle, puis suivez la session d'orientation de 30 minutes.</p>"
      }
    }
  }
];

const seedAllContent = async () => {
  try {
    await connectDatabase();
    console.log("Seeding All Database Content with English & French Translations...");

    // Seed Categories
    await Category.deleteMany({});
    const createdCats = await Category.insertMany(CATEGORY_SEED);
    console.log(`Seeded ${createdCats.length} Categories with EN/FR translations!`);

    // Seed Initial Service under Category 1
    await Service.deleteMany({});
    const serviceSeed = {
      id: "srv-gas-1",
      title: "Cooking Gas Cylinder Refill & Express Delivery",
      category: createdCats[0]._id,
      description: "Express doorstep pickup and exchange for SCTM, Total, Tradex, and Camgaz cylinders.",
      priceRange: "6,500 XAF",
      estimatedTime: "15 - 30 mins",
      iconName: "Flame",
      isLive: true,
      featured: true,
      imageUrl: "/images/gas_delivery.png",
      translations: {
        fr: {
          title: "Recharge de Bouteille de Gaz & Livraison Express",
          description: "Enlèvement et échange express à domicile de bouteilles de gaz SCTM, Total, Tradex et Camgaz.",
          estimatedTime: "15 - 30 min"
        }
      }
    };
    await Service.create(serviceSeed);
    console.log("Seeded Service Items with EN/FR translations!");

    // Seed FAQs & Articles
    await Faq.deleteMany({});
    await Article.deleteMany({});

    await Faq.insertMany(FAQ_SEED);
    await Article.insertMany(ARTICLE_SEED);

    console.log(`Seeded ${FAQ_SEED.length} FAQs and ${ARTICLE_SEED.length} Articles with EN/FR translations!`);
    console.log("ALL DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedAllContent();
