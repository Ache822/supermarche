import "dotenv/config";
import { connectDatabase } from "../src/config/database";
import { hashPassword } from "../src/common/utils/password";
import { User } from "../src/modules/users/users.model";
import { Category, Service } from "../src/modules/services/services.model";
import { Faq } from "../src/modules/faqs/faqs.model";

const seed = async () => {
  await connectDatabase();

  console.log('Cleaning up legacy accounts, categories, services, and FAQs...');
  await User.deleteMany({});
  await Category.deleteMany({});
  await Service.deleteMany({});
  await Faq.deleteMany({});

  // 1. Create single Root Super Admin account with 0 listed permissions (pure access bypass)
  console.log('Seeding Root Super Admin account with pure SUPER_ADMIN access bypass...');
  const frontendAdminPasswordHash = await hashPassword('admin237');
  
  await User.create({
    authId: 'usr_superadmin_001',
    email: 'admin@supermarche.cm',
    password_hash: frontendAdminPasswordHash,
    fullName: 'Root Super Admin',
    access: 'SUPER_ADMIN',
    permissions: [], // Empty! Does NOT list individual permissions because SUPER_ADMIN bypasses all checks dynamically
    is_active: true
  });

  // 2. Seed Main Top-Level Categories (parent: null)
  console.log('Seeding top-level main hub categories with descriptions...');
  const catHomeHub: any = await Category.create({
    name: "Home & Essential Services",
    slug: "home-essentials",
    description: "On-demand domestic services including cooking gas refills, cleaning, and security setup.",
    iconName: "Home",
    display_order: 1,
    parent: null,
    defaultLanguage: "en",
    translationFields: ["name", "description"],
    translations: {
      fr: {
        name: "Services Domestiques & Essentiels",
        description: "Services à domicile à la demande comprenant le gaz, le nettoyage et la sécurité."
      }
    }
  });

  const catLifestyleHub: any = await Category.create({
    name: "School & Market Hub",
    slug: "school-market-hub",
    description: "Express market shopping runs, prepped fresh food delivery, and school supply packages.",
    iconName: "ShoppingBag",
    display_order: 2,
    parent: null,
    defaultLanguage: "en",
    translationFields: ["name", "description"],
    translations: {
      fr: {
        name: "Marché & Rentrée Scolaire",
        description: "Courses alimentaires express, aliments préparés frais et fournitures scolaires."
      }
    }
  });

  // 3. Seed Sub-Categories (parent: ObjectId of Top-Level Category)
  console.log('Seeding sub-categories with descriptions and parent links...');
  const catGas: any = await Category.create({
    name: "Cooking Gas",
    slug: "cooking-gas",
    description: "Fast 30-minute cylinder refill and safety installation delivered directly to your doorstep.",
    iconName: "Flame",
    display_order: 1,
    parent: catHomeHub._id,
    defaultLanguage: "en",
    translationFields: ["name", "description"],
    translations: {
      fr: {
        name: "Gaz de Cuisine",
        description: "Livraison rapide de bouteilles de gaz en 30 minutes et installation sécurisée."
      }
    }
  });

  const catCleaning: any = await Category.create({
    name: "Cleaning",
    slug: "cleaning",
    description: "Professional residential and post-construction deep cleaning teams.",
    iconName: "Sparkles",
    display_order: 2,
    parent: catHomeHub._id,
    defaultLanguage: "en",
    translationFields: ["name", "description"],
    translations: {
      fr: {
        name: "Nettoyage",
        description: "Équipes professionnelles de nettoyage approfondi pour résidences et bureaux."
      }
    }
  });

  const catSecurity: any = await Category.create({
    name: "CCTV & Security",
    slug: "cctv-security",
    description: "Surveillance camera installation, smart digital door locks, and property security audits.",
    iconName: "ShieldCheck",
    display_order: 3,
    parent: catHomeHub._id,
    defaultLanguage: "en",
    translationFields: ["name", "description"],
    translations: {
      fr: {
        name: "Caméras & Sécurité",
        description: "Installation de caméras de surveillance, serrures numériques et audits de sécurité."
      }
    }
  });

  const catMarket: any = await Category.create({
    name: "Market Shop",
    slug: "market-shop",
    description: "Fresh farm produce, prepped vegetables, and wholesale grocery market runs.",
    iconName: "ShoppingCart",
    display_order: 1,
    parent: catLifestyleHub._id,
    defaultLanguage: "en",
    translationFields: ["name", "description"],
    translations: {
      fr: {
        name: "Marché & Courses",
        description: "Produits frais du marché, légumes nettoyés et courses alimentaires en gros."
      }
    }
  });

  const catSchool: any = await Category.create({
    name: "School Shop",
    slug: "school-shop",
    description: "Textbooks, uniform packages, exercise books, and complete back-to-school kits.",
    iconName: "GraduationCap",
    display_order: 2,
    parent: catLifestyleHub._id,
    defaultLanguage: "en",
    translationFields: ["name", "description"],
    translations: {
      fr: {
        name: "Fournitures Scolaires",
        description: "Manuels, uniformes scolaires, cahiers et kits complets pour la rentrée."
      }
    }
  });

  // 4. Seed Services linked to sub-category ObjectIds
  console.log('Seeding services catalog...');
  await Service.insertMany([
    {
      id: "srv-gas",
      title: "Cooking Gas Refill & Delivery",
      category: catGas._id,
      description: "Instant delivery and secure installation of your cooking gas cylinders directly to your kitchen.",
      priceRange: "XAF 6,500 – 14,000",
      estimatedTime: "30–45 mins",
      iconName: "Flame",
      isLive: true,
      featured: true,
      defaultLanguage: "en",
      translationFields: ["title", "description", "estimatedTime"],
      translations: {
        fr: {
          title: "Recharge & Livraison de Gaz de Cuisine",
          description: "Livraison instantanée et installation sécurisée de vos bouteilles de gaz directement dans votre cuisine.",
          estimatedTime: "30–45 min"
        }
      }
    },
    {
      id: "srv-market",
      title: "Prepped Foods & Market Shopping",
      category: catMarket._id,
      description: "Get fresh, prepped ingredients and complete market runs dispatched by our shopping runners.",
      priceRange: "XAF 5,000 – 35,000",
      estimatedTime: "60–90 mins",
      iconName: "ShoppingCart",
      isLive: true,
      featured: true,
      defaultLanguage: "en",
      translationFields: ["title", "description", "estimatedTime"],
      translations: {
        fr: {
          title: "Produits Frais & Courses au Marché",
          description: "Obtenez des ingrédients frais préparés et des courses complètes livrées par nos coursiers.",
          estimatedTime: "60–90 min"
        }
      }
    },
    {
      id: "srv-school",
      title: "Back to School Shopping",
      category: catSchool._id,
      description: "Bulk book uniforms, textbooks, and school kits delivered directly to your home before the bells ring.",
      priceRange: "XAF 15,000 – 85,000",
      estimatedTime: "Same day",
      iconName: "GraduationCap",
      isLive: true,
      featured: false,
      defaultLanguage: "en",
      translationFields: ["title", "description", "estimatedTime"],
      translations: {
        fr: {
          title: "Achats de Rentrée Scolaire",
          description: "Uniformes, manuels et fournitures scolaires livrés directement à domicile avant la rentrée.",
          estimatedTime: "Même jour"
        }
      }
    },
    {
      id: "srv-cleaning",
      title: "Deep Home & Office Cleaning",
      category: catCleaning._id,
      description: "Professional cleaning crews equipped to restore homes, offices, or post-construction spaces.",
      priceRange: "XAF 12,000 – 60,000",
      estimatedTime: "2–4 hours",
      iconName: "Sparkles",
      isLive: true,
      featured: false,
      defaultLanguage: "en",
      translationFields: ["title", "description", "estimatedTime"],
      translations: {
        fr: {
          title: "Nettoyage Approfondi Maison & Bureau",
          description: "Équipes de nettoyage professionnelles pour la remise en état de maisons, bureaux ou fin de chantier.",
          estimatedTime: "2–4 heures"
        }
      }
    },
    {
      id: "srv-security",
      title: "Digital Security & CCTV Install",
      category: catSecurity._id,
      description: "Request surveys, CCTV security cameras setup, and digital lock installations by verified pros.",
      priceRange: "XAF 45,000 – 250,000",
      estimatedTime: "24h dispatch",
      iconName: "ShieldCheck",
      isLive: true,
      featured: false,
      defaultLanguage: "en",
      translationFields: ["title", "description", "estimatedTime"],
      translations: {
        fr: {
          title: "Sécurité Numérique & Installation CCTV",
          description: "Demandez des audits, l'installation de caméras de surveillance et de serrures numériques.",
          estimatedTime: "Intervention en 24h"
        }
      }
    }
  ]);

  // 5. Seed Featured FAQs
  console.log('Seeding featured FAQs...');
  await Faq.insertMany([
    {
      category: "Delivery",
      question: "How fast is cooking gas delivered to my home?",
      answer: "Gas cylinders are delivered and safety installed within 30 to 45 minutes of order placement.",
      display_order: 1,
      is_published: true,
      is_featured: true,
      defaultLanguage: "en",
      translationFields: ["question", "answer"],
      translations: {
        fr: {
          question: "À quelle vitesse le gaz de cuisine est-il livré ?",
          answer: "Les bouteilles de gaz sont livrées et installées en toute sécurité dans un délai de 30 à 45 minutes."
        }
      }
    },
    {
      category: "Services",
      question: "Can I become a Supermarche service provider?",
      answer: "Yes! Fill out our online Provider Application form under 'Become a Partner' and our team will contact you via WhatsApp or Email.",
      display_order: 2,
      is_published: true,
      is_featured: true,
      defaultLanguage: "en",
      translationFields: ["question", "answer"],
      translations: {
        fr: {
          question: "Puis-je devenir un prestataire de services Supermarche ?",
          answer: "Oui ! Remplissez notre formulaire de candidature en ligne et notre équipe vous contactera via WhatsApp ou Email."
        }
      }
    },
    {
      category: "Payment",
      question: "What payment methods are accepted?",
      answer: "We accept Mobile Money (MTN MoMo, Orange Money) and Cash on Delivery.",
      display_order: 3,
      is_published: true,
      is_featured: true,
      defaultLanguage: "en",
      translationFields: ["question", "answer"],
      translations: {
        fr: {
          question: "Quels modes de paiement sont acceptés ?",
          answer: "Nous acceptons Mobile Money (MTN MoMo, Orange Money) et le paiement en espèces à la livraison."
        }
      }
    }
  ]);

  console.log('Seed complete. Pure SUPER_ADMIN bypass account created: admin@supermarche.cm / admin237 (permissions: [])');
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
