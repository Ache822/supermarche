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
    subCategory: "Orders & Shopping",
    question: "How do I place an order on Kim's Store?",
    answer: "Browse our collections (Fashion, Sneakers, Cosmetics, Tech, or Supermarket), add items to your cart, and proceed to checkout. Enter your delivery address in Douala, Yaoundé, Buea, or Bamenda and select your preferred payment method.",
    articleSlug: "about-kims-store",
    is_featured: true,
    is_published: true,
    display_order: 1,
    translations: {
      fr: {
        question: "Comment passer une commande sur Kim's Store ?",
        answer: "Parcourez nos rayons (Mode, Sneakers, Cosmétiques, Tech ou Supermarché), ajoutez vos articles au panier et validez la commande avec votre adresse de livraison à Douala, Yaoundé, Buea ou Bamenda."
      }
    }
  },
  {
    page: "help",
    category: "customers",
    subCategory: "Delivery & Timelines",
    question: "How fast is delivery and can I track my order?",
    answer: "Supermarket pantry essentials are delivered within 45 to 90 minutes. Fashion, shoes, and tech products are delivered same-day or next-day. You will receive an SMS with a live GPS tracking link once your dispatch courier is on the road, or you can ask Kimzy in live chat for real-time updates.",
    articleSlug: "kims-store-delivery-guide",
    is_featured: true,
    is_published: true,
    display_order: 2,
    translations: {
      fr: {
        question: "Quels sont les délais de livraison et puis-je suivre ma commande ?",
        answer: "Les essentiels du supermarché sont livrés en 45 à 90 minutes. La mode et les produits tech sont livrés le jour même ou le lendemain avec suivi GPS en direct par SMS et assistance Kimzy."
      }
    }
  },
  {
    page: "help",
    category: "customers",
    subCategory: "Payments & Mobile Money",
    question: "What payment methods are supported on Kim's Store?",
    answer: "We support MTN Mobile Money, Orange Money, Visa/Mastercard debit and credit cards, as well as Cash on Delivery in eligible delivery zones with instant digital receipts.",
    articleSlug: "payment-momo-security-guide",
    is_featured: true,
    is_published: true,
    display_order: 3,
    translations: {
      fr: {
        question: "Quels modes de paiement sont acceptés sur Kim's Store ?",
        answer: "Nous acceptons MTN Mobile Money, Orange Money, les cartes bancaires Visa/Mastercard ainsi que le paiement en espèces à la livraison avec facture numérique instantanée."
      }
    }
  },
  {
    page: "help",
    category: "customers",
    subCategory: "Returns & Exchanges",
    question: "What if a shoe or clothing item does not fit my size?",
    answer: "We provide a hassle-free 7-day size exchange guarantee. If an outfit or sneaker doesn't fit, request a size swap through your order history or chat with Kimzy. Our courier will bring the right size to your doorstep.",
    articleSlug: "returns-exchanges-warranty",
    is_featured: true,
    is_published: true,
    display_order: 4,
    translations: {
      fr: {
        question: "Que faire si la pointure ou la taille ne me convient pas ?",
        answer: "Nous offrons une garantie d'échange de taille sous 7 jours sans tracas. Demandez un échange via votre compte ou avec Kimzy, et notre livreur vous apportera la bonne taille."
      }
    }
  },
  {
    page: "help",
    category: "customers",
    subCategory: "Authenticity & Products",
    question: "Are all sneakers, fashion brands, and beauty products 100% genuine?",
    answer: "Yes. Every single item at Kim's Store is sourced directly from verified brand partners and inspected by our quality assurance team before dispatch.",
    articleSlug: "about-kims-store",
    is_featured: false,
    is_published: true,
    display_order: 5,
    translations: {
      fr: {
        question: "Les sneakers, vêtements et produits de beauté sont-ils 100% authentiques ?",
        answer: "Oui. Tous les articles de Kim's Store proviennent directement de marques et fournisseurs certifiés et sont rigoureusement contrôlés avant expédition."
      }
    }
  },

  // --- MERCHANT & PARTNER FAQs ---
  {
    page: "become-a-provider",
    category: "pros",
    subCategory: "Selling & Onboarding",
    question: "How can I sell my products or brand on Kim's Store?",
    answer: "Boutiques, local fashion creators, and certified suppliers can apply via our Merchant Partner portal. Submit your catalog, business registration or CNI, and start selling after a swift 48-hour verification process.",
    articleSlug: "sell-on-kims-store",
    is_featured: true,
    is_published: true,
    display_order: 6,
    translations: {
      fr: {
        question: "Comment vendre mes créations ou ma boutique sur Kim's Store ?",
        answer: "Les boutiques, créateurs de mode et importateurs peuvent postuler via notre portail Partenaires Marchands. Soumettez votre catalogue pour vérification sous 48h."
      }
    }
  },
  {
    page: "become-a-provider",
    category: "pros",
    subCategory: "Payouts & Logistics",
    question: "When and how do Kim's Store partners receive payouts?",
    answer: "Sales revenue is automatically disbursed every Monday directly to your MTN Mobile Money or Orange Money merchant account with zero processing deductions.",
    articleSlug: "sell-on-kims-store",
    is_featured: true,
    is_published: true,
    display_order: 7,
    translations: {
      fr: {
        question: "Quand et comment les vendeurs partenaires reçoivent-ils leurs paiements ?",
        answer: "Les revenus des ventes sont versés automatiquement chaque lundi directement sur votre compte MTN Mobile Money ou Orange Money sans frais cachés."
      }
    }
  }
];


const ARTICLE_SEED_DATA = [
  {
    slug: "about-kims-store",
    category: "About Kim's Store",
    title: "About Kim's Store — Cameroon's Modern Lifestyle & Express Shopping Destination",
    summary: "Discover our curated departments: trending streetwear, genuine sneakers, beauty cosmetics, tech accessories, and express supermarket essentials.",
    content: "<h3>Welcome to Kim's Store</h3><p>Kim's Store is Cameroon's premier multi-department retail and express supermarket platform operating across Douala, Yaoundé, Buea, and Bamenda. We offer carefully curated streetwear fashion, brand-name sneakers, premium skincare & cosmetics, smartphones and smart tech accessories, plus fresh pantry groceries.</p><h3>Authentic Quality Guarantee</h3><p>Every item undergoes a strict authenticity inspection before dispatch. Kimzy, our virtual shopping assistant, is available 24/7 in the chat to answer sizing questions and check order statuses.</p>",
    display_order: 1,
    is_published: true,
    translations: {
      fr: {
        title: "À propos de Kim's Store — Grand Magasin & Supermarché Express de Référence au Cameroun",
        summary: "Découvrez nos rayons : mode urbaine, sneakers authentiques, cosmétiques éclat, accessoires tech et essentiels du supermarché.",
        content: "<h3>Bienvenue chez Kim's Store</h3><p>Kim's Store est la référence du grand magasin et supermarché en ligne au Cameroun. Nous livrons à Douala, Yaoundé, Buea et Bamenda avec des articles 100% authentiques inspectés avant chaque envoi. Kimzy, notre mascotte et assistant virtuel, est disponible 24/7 pour vos questions.</p>"
      }
    }
  },
  {
    slug: "kims-store-delivery-guide",
    category: "Orders & Delivery",
    title: "Express Doorstep Delivery Across Cameroon — Timelines & Tracking",
    summary: "Learn how delivery works in Douala, Yaoundé, Buea & Bamenda with real-time runner tracking and 45-minute express grocery options.",
    content: "<h3>Delivery Coverage & Timelines</h3><p>We operate local fulfillment and delivery hubs in Douala, Yaoundé, Buea, and Bamenda. Everyday groceries and pantry items arrive in 45–90 minutes. Fashion collections, shoes, and tech products are delivered same-day or on convenient scheduled morning/evening slots.</p><h3>Live Runner Tracking</h3><p>Every order includes an SMS tracking link and real-time live map tracking. Ask Kimzy in chat for instant status updates.</p>",
    display_order: 2,
    is_published: true,
    translations: {
      fr: {
        title: "Livraison Express à Domicile au Cameroun — Délais et Suivi en Direct",
        summary: "Découvrez notre service de livraison à Douala, Yaoundé, Buea et Bamenda avec suivi en temps réel et livraison express en 45 minutes.",
        content: "<h3>Zones de Couverture & Délais</h3><p>Nos hubs locaux assurent la livraison en 45 à 90 minutes pour l'épicerie et le jour même pour la mode et les accessoires. Suivez votre livreur en temps réel sur carte interactive.</p>"
      }
    }
  },
  {
    slug: "payment-momo-security-guide",
    category: "Payments & MoMo",
    title: "Payment Security & Mobile Money Checkout (MTN MoMo & Orange Money)",
    summary: "Seamless zero-fee Mobile Money checkout, Cash on Delivery options, and instant automated digital invoices.",
    content: "<h3>Secure Mobile Money Payments</h3><p>Paying on Kim's Store is instant and secure. We accept MTN Mobile Money, Orange Money, credit/debit cards, and Cash on Delivery for eligible zones. Digital payments trigger a prompt on your phone with zero hidden fees. Once authorized, a digital receipt and invoice is automatically generated.</p>",
    display_order: 3,
    is_published: true,
    translations: {
      fr: {
        title: "Sécurité des Paiements & Règlement Mobile Money (MTN MoMo & Orange Money)",
        summary: "Paiement Mobile Money sans frais cachés, option de paiement à la livraison et factures numériques automatiques.",
        content: "<h3>Paiement Sécurisé Mobile Money</h3><p>Payez en un clic via MTN Mobile Money ou Orange Money avec validation USSD directe sur votre téléphone. Reçu et facture numérique instantanés disponibles sur votre compte.</p>"
      }
    }
  },
  {
    slug: "returns-exchanges-warranty",
    category: "Returns & Exchanges",
    title: "Returns, Sizing Guide & 7-Day Easy Exchange Policy",
    summary: "Hassle-free 7-day size exchanges for shoes and apparel, size charts, and our 100% authentic merchandise guarantee.",
    content: "<h3>7-Day Size Exchanges</h3><p>We want you to love everything you order from Kim's Store. If a pair of sneakers or an outfit does not fit properly, request a size exchange within 7 days. If an item arrives with any defect, we pick it up and replace it completely free of charge. Chat with Kimzy to start an exchange instantly.</p>",
    display_order: 4,
    is_published: true,
    translations: {
      fr: {
        title: "Retours, Guide des Tailles & Échanges Faciles sous 7 Jours",
        summary: "Échanges de pointures et de tailles sans tracas sous 7 jours, guide des pointures et garantie 100% authentique.",
        content: "<h3>Échanges sous 7 Jours</h3><p>Si une pointure ou une taille ne vous convient pas, demandez un échange simple sous 7 jours. En cas de défaut, le retour et le remplacement sont entièrement gratuits.</p>"
      }
    }
  },
  {
    slug: "sell-on-kims-store",
    category: "Partner With Us",
    title: "Sell on Kim's Store — Merchant & Local Brand Partnership Guide",
    summary: "How fashion designers, local boutiques, and tech importers can showcase their inventory on Cameroon's top lifestyle store.",
    content: "<h3>Partnering with Kim's Store</h3><p>Expand your retail brand across Cameroon. Approved vendors get instant access to our customer base, delivery courier network, and automated weekly Mobile Money payouts. Submit your catalog through the partner portal to get verified in 48 hours.</p>",
    display_order: 5,
    is_published: true,
    translations: {
      fr: {
        title: "Vendre sur Kim's Store — Guide des Partenariats et Boutiques Locales",
        summary: "Comment les créateurs de mode, boutiques locales et importateurs tech peuvent distribuer leurs produits sur Kim's Store.",
        content: "<h3>Devenir Partenaire Vendeur</h3><p>Rejoignez Kim's Store pour toucher des milliers de clients au Cameroun en bénéficiant de notre logistique express et de règlements MoMo hebdomadaires automatiques.</p>"
      }
    }
  },
  {
    slug: "customer-support-kimzy",
    category: "Customer Support",
    title: "24/7 Customer Care — Chatting with Kimzy & Direct Support Hotlines",
    summary: "How to get quick assistance via our Kimzy chat widget, direct phone numbers, and official customer email.",
    content: "<h3>Customer Care Channels</h3><p>Our customer support team is always within reach. Tap the floating chat bubble on the bottom right to speak with Kimzy in real-time. For urgent order inquiries, call +237 655 822 100 or +237 677 822 200, or email support@kimsstore.cm.</p>",
    display_order: 6,
    is_published: true,
    translations: {
      fr: {
        title: "Service Client 24/7 — Chat avec Kimzy et Numéros d'Assistance Directe",
        summary: "Comment obtenir de l'aide via le widget de chat Kimzy, nos numéros de téléphone directs et notre email support officiel.",
        content: "<h3>Canaux d'Assistance Clientèle</h3><p>Notre équipe support est à votre disposition 24h/24. Discutez en direct avec Kimzy via le widget flottant, appelez au +237 655 822 100 / +237 677 822 200 ou écrivez à support@kimsstore.cm.</p>"
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
