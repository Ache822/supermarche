import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "../config/database";
import { Category, Product } from "../modules/products/products.model";

export const PINTEREST_PRODUCTS = [
  // 1. Apparel & Fashion (6 products)
  {
    id: "prod-app-01",
    title: "Oversized Vintage Heavyweight Graphic Hoodie",
    category: "Apparel & Fashion",
    description: "<p>Premium 450GSM cotton fleece oversized hoodie with vintage washed distressed aesthetic. Designed with dropped shoulders, kangaroo pocket, and double-layered thermal hood.</p><ul><li>450 GSM Heavyweight Terry Cotton</li><li>Pre-shrunk vintage wash finish</li><li>Ribbed cuffs & hem</li><li>Unisex relaxed boxy silhouette</li></ul>",
    shortDescription: "Heavyweight 450GSM cotton fleece vintage graphic hoodie.",
    price: 28500,
    compareAtPrice: 34000,
    priceRange: "28,500 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 45,
    inStock: true,
    isLive: true,
    featured: true,
    sku: "APP-HD-001",
    rating: 4.9,
    reviewCount: 38,
    translations: {
      fr: {
        title: "Sweat à Capuche Vintage Oversize Premium",
        description: "<p>Sweat à capuche oversize en molleton de coton lourd 450GSM avec finition délavée vintage. Conçu avec épaules tombantes, poche kangourou et capuche thermique doublée.</p><ul><li>Coton éponge épais 450 GSM</li><li>Traitement délavé vintage irrétrécissable</li><li>Finitions poignets et ourlet côtelés</li><li>Coupe unisexe décontractée</li></ul>",
        shortDescription: "Sweat à capuche en coton épais 450GSM style vintage."
      }
    }
  },
  {
    id: "prod-app-02",
    title: "Minimalist Streetwear Heavyweight Tee",
    category: "Apparel & Fashion",
    description: "<p>Structured 260GSM combed cotton boxy tee. Thick ribbed collar and clean aesthetic for effortless everyday streetwear styling.</p><ul><li>100% Combed ring-spun cotton</li><li>Thick 1.25\" seamless neck ribbing</li><li>Reinforced shoulder taping</li></ul>",
    shortDescription: "Structured 260GSM combed cotton boxy tee.",
    price: 14000,
    compareAtPrice: 18000,
    priceRange: "14,000 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 60,
    inStock: true,
    isLive: true,
    featured: true,
    sku: "APP-TE-002",
    rating: 4.8,
    reviewCount: 29,
    translations: {
      fr: {
        title: "T-Shirt Épais Streetwear Minimaliste",
        description: "<p>T-shirt boxy structuré en coton peigné 260GSM. Col côtelé épais et esthétique épurée pour un style streetwear quotidien sans effort.</p><ul><li>100% Coton peigné filé à l'anneau</li><li>Col côtelé épais sans couture</li><li>Bande de propreté renforcée aux épaules</li></ul>",
        shortDescription: "T-shirt boxy en coton peigné 260GSM streetwear."
      }
    }
  },
  {
    id: "prod-app-03",
    title: "Cargo Tactical Multi-Pocket Techwear Pants",
    category: "Apparel & Fashion",
    description: "<p>Durable water-repellent ripstop cargo trousers featuring 6 tactical utility pockets, adjustable ankle drawstrings, and an elasticated waistband with quick-release buckle.</p><ul><li>Weather-resistant ripstop nylon blend</li><li>6 Deep utility cargo compartments</li><li>Adjustable toggle ankle cuffs</li></ul>",
    shortDescription: "Ripstop cargo trousers with 6 utility pockets.",
    price: 22500,
    compareAtPrice: 27000,
    priceRange: "22,500 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 35,
    inStock: true,
    isLive: true,
    featured: false,
    sku: "APP-CG-003",
    rating: 4.7,
    reviewCount: 22,
    translations: {
      fr: {
        title: "Pantalon Cargo Tactique Multi-Poches Techwear",
        description: "<p>Pantalon cargo en ripstop hydrofuge résistant doté de 6 poches tactiques utilitaires, cordons de serrage ajustables aux chevilles et taille élastique avec boucle rapide.</p><ul><li>Mélange nylon ripstop résistant aux intempéries</li><li>6 Poches cargo profondes</li><li>Bas de jambes ajustables avec stoppeurs</li></ul>",
        shortDescription: "Pantalon cargo ripstop résistant à 6 poches utilitaires."
      }
    }
  },
  {
    id: "prod-app-04",
    title: "Retro Embroidered Varsity Bomber Jacket",
    category: "Apparel & Fashion",
    description: "<p>Classic campus collegiate varsity jacket featuring woolen body, contrasting faux-leather sleeves, quilted satin lining, and custom chenille embroidered badges.</p><ul><li>Warm wool-blend body with vegan leather sleeves</li><li>Quilted diamond thermal lining</li><li>Heavy-duty snap front closure</li></ul>",
    shortDescription: "Collegiate varsity jacket with embroidered badges.",
    price: 38000,
    compareAtPrice: 45000,
    priceRange: "38,000 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 20,
    inStock: true,
    isLive: true,
    featured: true,
    sku: "APP-VR-004",
    rating: 4.9,
    reviewCount: 41,
    translations: {
      fr: {
        title: "Blouson Bomber Varsity Brodier Rétro",
        description: "<p>Veste varsity universitaire classique avec corps en laine, manches contrastées en simili cuir, doublure en satin matelassé et badges brodés en chenille.</p><ul><li>Corps en laine mélangée et manches en cuir vegan</li><li>Doublure thermique matelassée en losange</li><li>Boutons pression métalliques robustes</li></ul>",
        shortDescription: "Blouson varsity universitaire avec broderies chenille."
      }
    }
  },
  {
    id: "prod-app-05",
    title: "Vintage Acid-Wash Denim Trucker Jacket",
    category: "Apparel & Fashion",
    description: "<p>Timeless 14oz rigid denim trucker jacket with an authentic stone acid-wash texture, metal shank buttons, and dual chest flap pockets.</p><ul><li>100% Heavyweight cotton denim (14oz)</li><li>Vintage stone acid wash treatment</li><li>Classic dual flap chest pockets & welt pockets</li></ul>",
    shortDescription: "14oz rigid denim trucker jacket with stone wash.",
    price: 32000,
    compareAtPrice: 38500,
    priceRange: "32,000 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 28,
    inStock: true,
    isLive: true,
    featured: false,
    sku: "APP-DN-005",
    rating: 4.8,
    reviewCount: 19,
    translations: {
      fr: {
        title: "Veste en Jean Trucker Délavée Vintage",
        description: "<p>Veste en denim rigide intemporelle 14oz avec texture délavée à l'acide authentique, boutons métalliques rivetés et doubles poches poitrine à rabat.</p><ul><li>100% Coton denim épais (14oz)</li><li>Traitement délavé stone-wash vintage</li><li>Poches poitrine à rabat et poches passepoilées</li></ul>",
        shortDescription: "Veste en denim 14oz délavée à la pierre."
      }
    }
  },
  {
    id: "prod-app-06",
    title: "Casual Cotton Zip-Up Tracksuit Set",
    category: "Apparel & Fashion",
    description: "<p>Coordinated 2-piece fleece tracksuit featuring a full-zip hoodie jacket and tapered matching joggers. Ultra-soft interior brushed fleece for daily comfort and travel.</p><ul><li>Includes zip jacket + matching jogger bottoms</li><li>Brushed thermal inner fleece</li><li>Zippered side pockets on jacket and pants</li></ul>",
    shortDescription: "2-piece fleece tracksuit with zip hoodie and joggers.",
    price: 35000,
    compareAtPrice: 42000,
    priceRange: "35,000 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 30,
    inStock: true,
    isLive: true,
    featured: false,
    sku: "APP-TS-006",
    rating: 4.7,
    reviewCount: 25,
    translations: {
      fr: {
        title: "Ensemble Survêtement Zippé en Coton",
        description: "<p>Ensemble de survêtement 2 pièces en molleton comprenant une veste à capuche entièrement zippée et un pantalon de jogging fuselé assorti. Intérieur doux brossé pour le confort quotidien.</p><ul><li>Comprend veste zippée + pantalon de jogging</li><li>Molleton intérieur thermique brossé</li><li>Poches latérales zippées</li></ul>",
        shortDescription: "Ensemble de survêtement molletonné 2 pièces zippé."
      }
    }
  },

  // 2. Footwear & Shoes (6 products)
  {
    id: "prod-ftw-01",
    title: "Retro High-Top Campus Basketball Sneakers",
    category: "Footwear & Shoes",
    description: "<p>Iconic high-top basketball silhouette engineered with genuine leather overlays, air-cushioned midsole, and pivot-point rubber outsole for traction.</p><ul><li>Premium full-grain leather upper</li><li>Encapsulated Air-Sole cushioning in heel</li><li>High-traction cupsole rubber base</li></ul>",
    shortDescription: "Iconic high-top basketball sneakers in full leather.",
    price: 45000,
    compareAtPrice: 52000,
    priceRange: "45,000 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 32,
    inStock: true,
    isLive: true,
    featured: true,
    sku: "FTW-BB-001",
    rating: 4.9,
    reviewCount: 46,
    translations: {
      fr: {
        title: "Baskets Montantes Rétro Campus Basketball",
        description: "<p>Silhouette montante de basket iconique conçue avec empiècements en cuir véritable, semelle intermédiaire amortissante et semelle extérieure en caoutchouc antidérapant.</p><ul><li>Empeigne en cuir pleine fleur de qualité</li><li>Amorti Air-Sole encapsulé au talon</li><li>Semelle cuvette adhérente avec point de pivot</li></ul>",
        shortDescription: "Baskets montantes iconiques de basket en cuir véritable."
      }
    }
  },
  {
    id: "prod-ftw-02",
    title: "Breathable Lightweight Mesh Running Shoes",
    category: "Footwear & Shoes",
    description: "<p>Engineered for maximum breathability during runs and long walking commutes. Featuring responsive EVA foam midsoles and flexible knit mesh uppers.</p><ul><li>Ultra-breathable engineered knit upper</li><li>Shock-absorbing dual-density EVA foam midsole</li><li>Featherweight construction (240g)</li></ul>",
    shortDescription: "Ultra-breathable lightweight mesh running sneakers.",
    price: 28000,
    compareAtPrice: 33000,
    priceRange: "28,000 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 40,
    inStock: true,
    isLive: true,
    featured: true,
    sku: "FTW-RN-002",
    rating: 4.8,
    reviewCount: 31,
    translations: {
      fr: {
        title: "Chaussures de Running Légères et Respirantes",
        description: "<p>Conçues pour une respirabilité optimale lors des courses et longues marches. Dotées d'une semelle intermédiaire en mousse EVA réactive et d'une tige en maille souple.</p><ul><li>Tige en maille technique ultra-respirante</li><li>Semelle EVA double densité absorbant les chocs</li><li>Conception ultra-légère (240g)</li></ul>",
        shortDescription: "Chaussures de running légères en mesh respirant."
      }
    }
  },
  {
    id: "prod-ftw-03",
    title: "Chunky Platform Streetwear Trainers",
    category: "Footwear & Shoes",
    description: "<p>Bold 90s aesthetic elevated with a sculpted chunky 5cm platform sole. Cushioned collar, reinforced heel counter, and multi-texture overlay panels.</p><ul><li>5cm Sculpted lightweight platform sole</li><li>Padded memory foam insole</li><li>Reflective 3M accent paneling</li></ul>",
    shortDescription: "Bold 90s streetwear sneakers with 5cm platform.",
    price: 36500,
    compareAtPrice: 44000,
    priceRange: "36,500 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 25,
    inStock: true,
    isLive: true,
    featured: false,
    sku: "FTW-CK-003",
    rating: 4.7,
    reviewCount: 27,
    translations: {
      fr: {
        title: "Baskets Basses Chunky Streetwear à Plateforme",
        description: "<p>Style audacieux des années 90 rehaussé d'une semelle plateforme sculptée de 5 cm. Col rembourré, contrefort renforcé et empiècements multi-matières.</p><ul><li>Semelle plateforme légère de 5 cm</li><li>Semelle intérieure en mousse à mémoire de forme</li><li>Détails réfléchissants 3M</li></ul>",
        shortDescription: "Baskets streetwear à semelle plateforme de 5cm."
      }
    }
  },
  {
    id: "prod-ftw-04",
    title: "Classic Low-Profile Canvas Skate Shoes",
    category: "Footwear & Shoes",
    description: "<p>Durable 12oz double-stitched canvas low-tops featuring vulcanized waffle rubber grip soles and reinforced toe caps for all-day board or campus wear.</p><ul><li>12oz Heavy-duty double canvas</li><li>Vulcanized gum rubber waffle sole</li><li>Reinforced rubber toe cap protection</li></ul>",
    shortDescription: "Durable 12oz double canvas skate shoes.",
    price: 24000,
    compareAtPrice: 29000,
    priceRange: "24,000 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 45,
    inStock: true,
    isLive: true,
    featured: false,
    sku: "FTW-SK-004",
    rating: 4.8,
    reviewCount: 34,
    translations: {
      fr: {
        title: "Chaussures de Skate en Toile Classiques",
        description: "<p>Baskets basses en toile robuste 12oz à double couture avec semelle vulcanisée gaufrée et embout renforcé pour un port quotidien confortable.</p><ul><li>Toile double épaisseur 12oz</li><li>Semelle extérieure en gomme vulcanisée</li><li>Renfort pare-pierres en caoutchouc</li></ul>",
        shortDescription: "Chaussures de skate en toile robuste à semelle gaufrée."
      }
    }
  },
  {
    id: "prod-ftw-05",
    title: "All-Weather Waterproof Trail & Hiking Boots",
    category: "Footwear & Shoes",
    description: "<p>Rugged outdoor boots engineered with waterproof membrane lining, ankle support collars, rust-proof speed lacing hooks, and deep lug lugged traction outsoles.</p><ul><li>Hydro-Shield waterproof sealed membrane</li><li>Aggressive 5mm rubber lug grip tread</li><li>Supportive high-density padded ankle collar</li></ul>",
    shortDescription: "Rugged waterproof outdoor boots with ankle support.",
    price: 48000,
    compareAtPrice: 58000,
    priceRange: "48,000 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 18,
    inStock: true,
    isLive: true,
    featured: true,
    sku: "FTW-HK-005",
    rating: 4.9,
    reviewCount: 28,
    translations: {
      fr: {
        title: "Chaussures de Trail & Randonnée Imperméables",
        description: "<p>Chaussures d'extérieur robustes dotées d'une membrane imperméable scellée, d'un col de maintien de la cheville, de crochets de laçage rapide et de semelles crantées profondes.</p><ul><li>Membrane imperméable intégrale Hydro-Shield</li><li>Semelle crantée tout-terrain 5mm</li><li>Col montant matelassé protecteur</li></ul>",
        shortDescription: "Chaussures de randonnée étanches avec semelle crantée."
      }
    }
  },
  {
    id: "prod-ftw-06",
    title: "Ergonomic Slip-On Comfort Cloud Slides",
    category: "Footwear & Shoes",
    description: "<p>Molded 4cm high-density EVA foam slides with an anatomical footbed and non-slip diamond sole. Perfect for recovery, beach, dorms, and casual relaxation.</p><ul><li>4cm Ultra-thick cloud-cushioned EVA foam</li><li>Deep heel cup & orthopedic arch support</li><li>Waterproof, washable and quick-drying</li></ul>",
    shortDescription: "Molded 4cm cloud-cushioned EVA foam slides.",
    price: 12500,
    compareAtPrice: 16000,
    priceRange: "12,500 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 50,
    inStock: true,
    isLive: true,
    featured: false,
    sku: "FTW-SL-006",
    rating: 4.7,
    reviewCount: 39,
    translations: {
      fr: {
        title: "Claquettes Ergonomiques Ultra Confort Cloud",
        description: "<p>Claquettes moulées en mousse EVA haute densité de 4 cm avec assise plantaire anatomique et semelle antidérapante. Parfaites pour la récupération et la détente.</p><ul><li>Mousse EVA ultra-moelleuse de 4 cm</li><li>Soutien de la voûte plantaire et cuvette talonnière</li><li>Imperméables, lavables et séchage express</li></ul>",
        shortDescription: "Claquettes ergonomiques en mousse EVA moelleuse 4cm."
      }
    }
  },

  // 3. Cosmetics & Beauty (6 products)
  {
    id: "prod-cos-01",
    title: "Hydrating Glow Vitamin C & Hyaluronic Serum",
    category: "Cosmetics & Beauty",
    description: "<p>Brightening antioxidant facial serum concentrated with 15% Ethyl Ascorbic Acid, Multi-Molecular Hyaluronic Acid, and Vitamin E to fade hyperpigmentation and boost natural glow.</p><ul><li>15% Stabilized Vitamin C complex</li><li>Non-comedogenic, fragrance-free formula</li><li>Visibly fades dark spots and evens tone</li></ul>",
    shortDescription: "15% Vitamin C and hyaluronic brightening serum.",
    price: 16000,
    compareAtPrice: 20000,
    priceRange: "16,000 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 55,
    inStock: true,
    isLive: true,
    featured: true,
    sku: "COS-VC-001",
    rating: 4.9,
    reviewCount: 52,
    translations: {
      fr: {
        title: "Sérum Éclat Vitamine C & Acide Hyaluronique",
        description: "<p>Sérum visage antioxydant illuminateur concentré à 15% de Vitamine C stabilisée, acide hyaluronique multi-moléculaire et vitamine E pour estomper les taches et raviver l'éclat.</p><ul><li>15% Complexe de Vitamine C stabilisée</li><li>Formule non comédogène et sans parfum</li><li>Unifie le teint et atténue l'hyperpigmentation</li></ul>",
        shortDescription: "Sérum éclat illuminateur à 15% de Vitamine C."
      }
    }
  },
  {
    id: "prod-cos-02",
    title: "Broad Spectrum SPF 50+ Invisible Shield Sunscreen",
    category: "Cosmetics & Beauty",
    description: "<p>Ultra-lightweight gel cream SPF 50+ sunscreen formulated specifically for tropical climates and melanin-rich skin. Leaves zero white cast and dries down to a velvety matte finish.</p><ul><li>SPF 50+ PA++++ Broad UVA/UVB protection</li><li>Zero white cast on dark skin tones</li><li>Sweat-resistant & non-greasy</li></ul>",
    shortDescription: "Broad-spectrum SPF 50+ sunscreen with zero white cast.",
    price: 14500,
    compareAtPrice: 18000,
    priceRange: "14,500 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 65,
    inStock: true,
    isLive: true,
    featured: true,
    sku: "COS-SF-002",
    rating: 4.9,
    reviewCount: 47,
    translations: {
      fr: {
        title: "Écran Solaire Invisible SPF 50+ Sans Traces",
        description: "<p>Crème gel solaire SPF 50+ ultra-légère conçue pour le climat tropical et les peaux riches en mélanine. Ne laisse aucune trace blanche avec un fini mat velouté.</p><ul><li>Protection SPF 50+ PA++++ large spectre UVA/UVB</li><li>Zéro trace blanche garantie sur peaux noires et métissées</li><li>Résistant à la transpiration et non gras</li></ul>",
        shortDescription: "Protection solaire SPF 50+ invisible sans traces blanches."
      }
    }
  },
  {
    id: "prod-cos-03",
    title: "Deep Cleansing Botanical Exfoliating Face Scrub",
    category: "Cosmetics & Beauty",
    description: "<p>Gentle micro-polishing facial scrub infused with salicylic acid (BHA), jojoba beads, and tea tree oil to decongest pores and eliminate dead skin cells.</p><ul><li>Jojoba biodegradable micro-beads</li><li>0.5% Salicylic Acid for pore clearing</li><li>Soothes inflammation with organic tea tree extract</li></ul>",
    shortDescription: "Micro-polishing facial scrub with salicylic acid and tea tree.",
    price: 11000,
    compareAtPrice: 14000,
    priceRange: "11,000 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 40,
    inStock: true,
    isLive: true,
    featured: false,
    sku: "COS-SC-003",
    rating: 4.7,
    reviewCount: 23,
    translations: {
      fr: {
        title: "Gommage Visage Exfoliant Botanique Purifiant",
        description: "<p>Gommage micro-polissant doux enrichi en acide salicylique (BHA), perles de jojoba et huile d'arbre à thé pour désobstruer les pores et éliminer les peaux mortes.</p><ul><li>Micro-perles biodégradables de jojoba</li><li>Acide salicylique 0,5% purifiant</li><li>Apaise avec de l'extrait d'arbre à thé biologique</li></ul>",
        shortDescription: "Gommage exfoliant doux à l'acide salicylique et tea tree."
      }
    }
  },
  {
    id: "prod-cos-04",
    title: "Ultra-Nourishing Shea & Cocoa Whipped Body Butter",
    category: "Cosmetics & Beauty",
    description: "<p>Rich decadent body moisturizer hand-whipped with raw unrefined West African Shea Butter, pure Cocoa Butter, sweet almond oil, and warm vanilla essence.</p><ul><li>100% Raw Unrefined Shea Butter base</li><li>Intense 48-hour moisture barrier lock</li><li>Non-greasy rapid melt-in texture</li></ul>",
    shortDescription: "Whipped body butter with raw shea and cocoa butter.",
    price: 9500,
    compareAtPrice: 12500,
    priceRange: "9,500 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1608248597359-52e463a5661b?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1608248597359-52e463a5661b?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 70,
    inStock: true,
    isLive: true,
    featured: true,
    sku: "COS-BB-004",
    rating: 4.9,
    reviewCount: 64,
    translations: {
      fr: {
        title: "Beurre Corporel Fouetté Karité & Cacao Pur",
        description: "<p>Soin corporel onctueux fouetté à la main avec du beurre de karité brut d'Afrique de l'Ouest, du beurre de cacao pur, de l'huile d'amande douce et de la vanille gourmande.</p><ul><li>Base 100% Karité brut non raffiné</li><li>Hydratation intense verrouillée 48h</li><li>Pénètre rapidement sans effet gras</li></ul>",
        shortDescription: "Beurre fouetté nourrissant au karité brut et cacao."
      }
    }
  },
  {
    id: "prod-cos-05",
    title: "Matte Long-Wear Lip Glaze & Lip Oil Duo",
    category: "Cosmetics & Beauty",
    description: "<p>Dual-ended luxury lip set featuring a transfer-proof velvety liquid matte lipstick on one end and a nourishing hyaluronic-infused glossy lip oil on the other.</p><ul><li>12-Hour smudge-proof velvety matte formula</li><li>Nourishing argan oil & vitamin E gloss top coat</li><li>Highly pigmented single-stroke color payoff</li></ul>",
    shortDescription: "Dual-ended velvety matte liquid lipstick and hydrating lip oil.",
    price: 8000,
    compareAtPrice: 10500,
    priceRange: "8,000 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 45,
    inStock: true,
    isLive: true,
    featured: false,
    sku: "COS-LP-005",
    rating: 4.8,
    reviewCount: 30,
    translations: {
      fr: {
        title: "Duo Rouge à Lèvres Mat Longue Tenue & Huile à Lèvres",
        description: "<p>Coffret lèvres double embout composé d'un rouge à lèvres mat liquide velouté sans transfert et d'une huile à lèvres brillante nourrissante enrichie en acide hyaluronique.</p><ul><li>Tenue veloutée 12h sans transfert</li><li>Huile brillante nourrissante à l'huile d'argan et vitamine E</li><li>Couleur intense et opaque en un seul passage</li></ul>",
        shortDescription: "Duo rouge à lèvres velouté mat longue tenue et huile brillante."
      }
    }
  },
  {
    id: "prod-cos-06",
    title: "Aromatherapy Botanical Mist & Rosewater Toner",
    category: "Cosmetics & Beauty",
    description: "<p>Pure distilled Damask rose petal hydrosol blended with aloe vera extract and chamomile to refresh skin, balance pH, and lock in makeup with radiant glow.</p><ul><li>100% Organic distilled Rose Hydrosol</li><li>Alcohol-free, soothing pH balance</li><li>Multi-use: toner, makeup setting spray & mid-day mist</li></ul>",
    shortDescription: "Organic distilled rosewater mist and balancing toner.",
    price: 12000,
    compareAtPrice: 15000,
    priceRange: "12,000 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 38,
    inStock: true,
    isLive: true,
    featured: false,
    sku: "COS-RM-006",
    rating: 4.8,
    reviewCount: 21,
    translations: {
      fr: {
        title: "Brume Botanique Aromathérapie & Eau de Rose Pure",
        description: "<p>Hydrolat pur de pétales de rose de Damas distillé combiné à l'aloe vera et à la camomille pour rafraîchir le teint, rééquilibrer le pH et fixer le maquillage.</p><ul><li>100% Eau florale de rose bio distillée</li><li>Sans alcool, apaise et rééquilibre le pH</li><li>Multi-usages : tonique, fixateur de maquillage et brume éclat</li></ul>",
        shortDescription: "Brume florale tonifiante à l'eau de rose de Damas bio."
      }
    }
  },

  // 4. Electronics & Tech (6 products)
  {
    id: "prod-tec-01",
    title: "Pro ANC Wireless Bluetooth Noise-Canceling Earbuds",
    category: "Electronics & Tech",
    description: "<p>True wireless earbuds with 35dB active noise canceling, transparency pass-through mode, 10mm dynamic bass drivers, and 32 hours total playback with USB-C wireless charge case.</p><ul><li>Hybrid 35dB Active Noise Cancellation</li><li>32-Hour combined battery life with quick charge</li><li>IPX5 Sweat & rain water-resistant</li></ul>",
    shortDescription: "True wireless earbuds with 35dB ANC and 32h playback.",
    price: 29000,
    compareAtPrice: 36000,
    priceRange: "29,000 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 42,
    inStock: true,
    isLive: true,
    featured: true,
    sku: "TEC-EB-001",
    rating: 4.9,
    reviewCount: 58,
    translations: {
      fr: {
        title: "Écouteurs Sans Fil Pro ANC avec Réduction de Bruit",
        description: "<p>Écouteurs True Wireless avec réduction active du bruit de 35dB, mode transparence, haut-parleurs basses 10mm et 32h d'autonomie totale avec boîtier de charge rapide USB-C.</p><ul><li>Réduction de bruit active hybride 35dB</li><li>Autonomie totale de 32 heures avec recharge rapide</li><li>Résistant à la sueur et aux éclaboussures IPX5</li></ul>",
        shortDescription: "Écouteurs sans fil avec réduction active du bruit 35dB."
      }
    }
  },
  {
    id: "prod-tec-02",
    title: "20,000mAh Dual USB-C Fast Power Bank (22.5W)",
    category: "Electronics & Tech",
    description: "<p>High-capacity portable battery pack equipped with dual 22.5W USB-C Power Delivery ports, digital LED battery percentage readout, and airline-approved safety chips.</p><ul><li>Charges an iPhone or Samsung phone up to 4.5 times</li><li>Digital smart LED battery display</li><li>Dual Type-C + USB-A multi-device output</li></ul>",
    shortDescription: "20,000mAh portable charger with 22.5W Power Delivery.",
    price: 22000,
    compareAtPrice: 27500,
    priceRange: "22,000 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 50,
    inStock: true,
    isLive: true,
    featured: true,
    sku: "TEC-PB-002",
    rating: 4.8,
    reviewCount: 43,
    translations: {
      fr: {
        title: "Batterie Externe 20 000mAh Charge Rapide Double USB-C",
        description: "<p>Batterie portable haute capacité équipée de deux ports Power Delivery USB-C 22,5W, d'un écran LED numérique de pourcentage et d'une sécurité approuvée pour l'aviation.</p><ul><li>Recharge un smartphone jusqu'à 4,5 fois</li><li>Affichage digital du niveau de batterie</li><li>Ports multiples Type-C et USB-A simultanés</li></ul>",
        shortDescription: "Batterie externe 20 000mAh 22,5W avec affichage LED."
      }
    }
  },
  {
    id: "prod-tec-03",
    title: "Waterproof Portable Bluetooth Bass Speaker",
    category: "Electronics & Tech",
    description: "<p>Rugged outdoor speaker pumping 360-degree punchy bass audio with dual passive radiators, IPX7 complete submersion waterproofing, and 16 hours continuous playtime.</p><ul><li>Punchy 20W dual driver acoustic audio</li><li>IPX7 100% Waterproof & buoyant floating design</li><li>16-Hour battery life on single charge</li></ul>",
    shortDescription: "20W punchy bass Bluetooth speaker with IPX7 waterproof rating.",
    price: 26500,
    compareAtPrice: 32000,
    priceRange: "26,500 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 30,
    inStock: true,
    isLive: true,
    featured: false,
    sku: "TEC-SP-003",
    rating: 4.8,
    reviewCount: 36,
    translations: {
      fr: {
        title: "Enceinte Bluetooth Portable Étanche Bass Boost",
        description: "<p>Enceinte d'extérieur robuste diffusant un son surround 360° avec basses percutantes, étanchéité totale IPX7 submersible et 16 heures de musique non-stop.</p><ul><li>Puissance audio 20W avec radiateurs passifs</li><li>100% Étanche certifiée IPX7 et flottante</li><li>Autonomie de 16 heures en une charge</li></ul>",
        shortDescription: "Enceinte étanche IPX7 20W avec basses percutantes."
      }
    }
  },
  {
    id: "prod-tec-04",
    title: "Smart Fitness Watch with Heart Rate & GPS Track",
    category: "Electronics & Tech",
    description: "<p>Sleek AMOLED touch smartwatch featuring 24/7 heart rate and blood oxygen (SpO2) monitoring, 100+ workout modes, sleep tracking, and Bluetooth phone notifications.</p><ul><li>1.43\" Vivid AMOLED touch display</li><li>All-day heart rate, SpO2 & sleep tracking</li><li>7-Day battery endurance on single charge</li></ul>",
    shortDescription: "AMOLED touch smartwatch with heart rate and 100+ sport modes.",
    price: 34000,
    compareAtPrice: 42000,
    priceRange: "34,000 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 24,
    inStock: true,
    isLive: true,
    featured: true,
    sku: "TEC-SW-004",
    rating: 4.9,
    reviewCount: 49,
    translations: {
      fr: {
        title: "Montre Connectée Fitness AMOLED avec Suivi Cardiaque",
        description: "<p>Montre intelligente tactile AMOLED avec suivi continu de la fréquence cardiaque et de l'oxygène (SpO2), plus de 100 modes de sport, analyse du sommeil et notifications d'appels.</p><ul><li>Écran tactile AMOLED 1,43\" haute définition</li><li>Capteurs cardiaques, SpO2 et suivi du sommeil 24/7</li><li>7 Jours d'autonomie en une seule charge</li></ul>",
        shortDescription: "Montre connectée tactile AMOLED avec suivi santé 24/7."
      }
    }
  },
  {
    id: "prod-tec-05",
    title: "Multi-Angle MagSafe Wireless Phone Charging Stand",
    category: "Electronics & Tech",
    description: "<p>Solid aluminum alloy adjustable desktop stand with integrated 15W Qi wireless fast charger and powerful magnetic alignment for hands-free video calls and desk organization.</p><ul><li>15W Fast wireless magnetic charging</li><li>360-degree rotation & 180-degree angle tilt</li><li>Aviation-grade weighted aluminum alloy base</li></ul>",
    shortDescription: "15W magnetic wireless charging adjustable aluminum stand.",
    price: 11500,
    compareAtPrice: 15000,
    priceRange: "11,500 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 36,
    inStock: true,
    isLive: true,
    featured: false,
    sku: "TEC-ST-005",
    rating: 4.7,
    reviewCount: 20,
    translations: {
      fr: {
        title: "Support de Téléphone MagSafe Inclinable avec Charge Sans Fil",
        description: "<p>Support de bureau en alliage d'aluminium robuste avec chargeur rapide sans fil 15W intégré et aimants puissants pour appels vidéo mains libres et organisation du bureau.</p><ul><li>Charge rapide sans fil magnétique 15W</li><li>Rotation 360° et inclinaison ajustable</li><li>Base lestée en alliage d'aluminium de qualité aéronautique</li></ul>",
        shortDescription: "Support bureau magnétique avec charge sans fil rapide 15W."
      }
    }
  },
  {
    id: "prod-tec-06",
    title: "Braided Nylon 100W Fast Charging Cable Kit (3-Pack)",
    category: "Electronics & Tech",
    description: "<p>Triple pack of ultra-durable braided nylon cables (1m, 2m, 3m) supporting up to 100W Power Delivery and high-speed 480Mbps data transfer for phones, tablets, and laptops.</p><ul><li>Supports up to 100W (20V/5A) fast charge</li><li>30,000+ Bend tested reinforced nylon jacket</li><li>Includes 1m, 2m, and 3m cable lengths</li></ul>",
    shortDescription: "3-Pack heavy duty 100W braided nylon USB-C cables.",
    price: 6500,
    compareAtPrice: 9000,
    priceRange: "6,500 XAF",
    estimatedTime: "30-45 mins",
    images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 80,
    inStock: true,
    isLive: true,
    featured: false,
    sku: "TEC-CB-006",
    rating: 4.8,
    reviewCount: 33,
    translations: {
      fr: {
        title: "Pack de 3 Câbles Tressés en Nylon 100W Charge Rapide",
        description: "<p>Pack de trois câbles ultra-résistants en nylon tressé (1m, 2m, 3m) supportant jusqu'à 100W Power Delivery et transfert de données rapide pour smartphones et ordinateurs.</p><ul><li>Supporte la charge rapide jusqu'à 100W</li><li>Testé à plus de 30 000 flexions sans rupture</li><li>Comprend les longueurs 1m, 2m et 3m</li></ul>",
        shortDescription: "Pack de 3 câbles nylon tressés 100W ultra-résistants."
      }
    }
  },

  // 5. Fresh Produce & Snacks (6 products)
  {
    id: "prod-prd-01",
    title: "Fresh Organic Fruit & Farm Produce Basket",
    category: "Fresh Produce & Snacks",
    description: "<p>Carefully hand-selected farm-fresh basket including crisp red apples, sweet ripe bananas, seasonal oranges, ripe avocados, and farm vegetables delivered chilled.</p><ul><li>Hand-inspected for peak ripeness and sweetness</li><li>Direct from local certified green organic farms</li><li>Packed in breathable eco-friendly craft basket</li></ul>",
    shortDescription: "Hand-picked organic apples, bananas, oranges, and farm veggies.",
    price: 12500,
    compareAtPrice: 15500,
    priceRange: "12,500 XAF",
    estimatedTime: "15-30 mins",
    images: ["https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 60,
    inStock: true,
    isLive: true,
    featured: true,
    sku: "PRD-FB-001",
    rating: 4.9,
    reviewCount: 61,
    translations: {
      fr: {
        title: "Panier de Fruits Frais & Légumes Bio du Terroir",
        description: "<p>Panier de produits frais de la ferme sélectionnés à la main comprenant pommes croquantes, bananes douces, oranges de saison, avocats mûrs et légumes livrés frais.</p><ul><li>Trié à la main pour une fraîcheur et maturité parfaites</li><li>En direct des fermes biologiques partenaires locales</li><li>Emballé dans un panier artisanal écologique</li></ul>",
        shortDescription: "Panier de fruits et légumes bio cueillis du jour."
      }
    }
  },
  {
    id: "prod-prd-02",
    title: "Artisan Chocolates & Campus Munchies Snack Pack",
    category: "Fresh Produce & Snacks",
    description: "<p>Delightful variety snack box containing imported milk and dark chocolates, crisp hazelnut wafer rolls, savory cookies, and sweet confectionery for late study sessions.</p><ul><li>Assorted imported premium chocolates & wafers</li><li>Individually wrapped for freshness</li><li>Great for campus sharing or gifting</li></ul>",
    shortDescription: "Assorted imported chocolates, hazelnut wafer rolls, and cookies.",
    price: 9000,
    compareAtPrice: 11500,
    priceRange: "9,000 XAF",
    estimatedTime: "15-30 mins",
    images: ["https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 75,
    inStock: true,
    isLive: true,
    featured: true,
    sku: "PRD-CH-002",
    rating: 4.8,
    reviewCount: 42,
    translations: {
      fr: {
        title: "Coffret Chocolats Artisans & Friandises Gourmandes",
        description: "<p>Boîte gourmande variée contenant chocolats au lait et noirs, rouleaux de gaufrettes croustillantes aux noisettes, biscuits savoureux et douceurs pour les pauses détende.</p><ul><li>Assortiment de chocolats et gaufrettes de qualité</li><li>Emballages individuels conservant le croustillant</li><li>Idéal à partager entre amis ou pour offrir</li></ul>",
        shortDescription: "Coffret de chocolats assortis et friandises croustillantes."
      }
    }
  },
  {
    id: "prod-prd-03",
    title: "Premium Roasted Cashews & Plantain Chips Mix",
    category: "Fresh Produce & Snacks",
    description: "<p>Crunchy golden lightly-salted roasted cashew nuts paired with freshly sliced artisan ripe plantain crisps. Packaged in resealable stay-fresh pouches.</p><ul><li>Whole kernel roasted jumbo cashews</li><li>Thinly sliced golden crispy plantain chips</li><li>Resealable airtight zipper pouch</li></ul>",
    shortDescription: "Lightly salted roasted jumbo cashews with crispy plantain chips.",
    price: 6500,
    compareAtPrice: 8500,
    priceRange: "6,500 XAF",
    estimatedTime: "15-30 mins",
    images: ["https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 85,
    inStock: true,
    isLive: true,
    featured: false,
    sku: "PRD-CS-003",
    rating: 4.9,
    reviewCount: 55,
    translations: {
      fr: {
        title: "Mix Noix de Cajou Grillées & Chips de Banane Plantain",
        description: "<p>Noix de cajou dorées croquantes légèrement salées accompagnées de chips artisanales de bananes plantains frites à point. Conditionnées en sachet zippé fraîcheur.</p><ul><li>Noix de cajou jumbo entières torréfiées</li><li>Chips de plantain dorées et croustillantes</li><li>Sachet refermable hermétique fraîcheur</li></ul>",
        shortDescription: "Noix de cajou grillées et chips de bananes plantains."
      }
    }
  },
  {
    id: "prod-prd-04",
    title: "Farm Fresh Grade-A Organic Eggs & Dairy Pack",
    category: "Fresh Produce & Snacks",
    description: "<p>Crate of 30 farm-fresh Grade-A brown eggs from free-range hens paired with pasteurized fresh whole milk. Delivered in shock-absorbent protective packaging.</p><ul><li>30 Free-range Grade-A organic eggs</li><li>High in natural protein and omega-3</li><li>Guaranteed zero cracked egg delivery guarantee</li></ul>",
    shortDescription: "30 free-range Grade-A eggs and pasteurized fresh milk.",
    price: 7500,
    compareAtPrice: 9500,
    priceRange: "7,500 XAF",
    estimatedTime: "15-30 mins",
    images: ["https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 50,
    inStock: true,
    isLive: true,
    featured: false,
    sku: "PRD-EG-004",
    rating: 4.8,
    reviewCount: 37,
    translations: {
      fr: {
        title: "Plateau d'Œufs Frais Fermiers Bio & Lait Entier",
        description: "<p>Plateau de 30 œufs bruns extra-frais de poules élevées en plein air avec bouteille de lait entier pasteurisé. Livré dans un emballage alvéolé antichoc renforcé.</p><ul><li>30 Œufs frais de catégorie A bio</li><li>Riches en protéines naturelles et oméga-3</li><li>Garantie zéro casse à la livraison</li></ul>",
        shortDescription: "30 œufs extra-frais bio et bouteille de lait entier."
      }
    }
  },
  {
    id: "prod-prd-05",
    title: "Imported Gourmet Biscuits & Belgian Wafers Box",
    category: "Fresh Produce & Snacks",
    description: "<p>Deluxe tin collection of European butter cookies, chocolate-dipped shortbreads, and crispy caramelized Belgian waffle biscuits.</p><ul><li>Classic Danish-style pure butter biscuits</li><li>Crisp caramel waffle biscuits</li><li>Collectible airtight keepsake tin</li></ul>",
    shortDescription: "European butter cookies and Belgian caramel waffle biscuits.",
    price: 8500,
    compareAtPrice: 11000,
    priceRange: "8,500 XAF",
    estimatedTime: "15-30 mins",
    images: ["https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 40,
    inStock: true,
    isLive: true,
    featured: false,
    sku: "PRD-WF-005",
    rating: 4.8,
    reviewCount: 26,
    translations: {
      fr: {
        title: "Boîte de Biscuits Fins & Gaufres Caramélisées",
        description: "<p>Sélection de biscuits pur beurre européens, sablés enrobés de chocolat fondant et fines gaufres croustillantes caramélisées façon liégeoise.</p><ul><li>Biscuits traditionnels pur beurre</li><li>Gaufrettes croustillantes au caramel fondant</li><li>Boîte métallique élégante réutilisable</li></ul>",
        shortDescription: "Biscuits sablés pur beurre et gaufrettes croustillantes."
      }
    }
  },
  {
    id: "prod-prd-06",
    title: "Fresh Juicy Tropical Citrus Basket (Oranges & Limes)",
    category: "Fresh Produce & Snacks",
    description: "<p>5kg crate of sweet Valencia sun-ripened oranges, juicy pink grapefruits, and aromatic green limes picked fresh from southern orchard groves.</p><ul><li>5kg Assorted fresh citrus crate</li><li>Packed with natural immune-boosting Vitamin C</li><li>Ideal for fresh breakfast juicing</li></ul>",
    shortDescription: "5kg crate of Valencia oranges, pink grapefruits, and limes.",
    price: 7000,
    compareAtPrice: 9000,
    priceRange: "7,000 XAF",
    estimatedTime: "15-30 mins",
    images: ["https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=800&q=80",
    stockQuantity: 65,
    inStock: true,
    isLive: true,
    featured: false,
    sku: "PRD-CT-006",
    rating: 4.9,
    reviewCount: 44,
    translations: {
      fr: {
        title: "Cagette d'Agrumes Tropicaux Frais (Oranges & Citrons)",
        description: "<p>Cagette de 5 kg d'oranges douces gorgées de soleil, pamplemousses juteux et citrons verts parfumés récoltés directement dans les vergers du sud.</p><ul><li>Cagette de 5 kg d'agrumes frais variés</li><li>Riche en vitamine C naturelle fortifiante</li><li>Parfait pour les jus pressés frais du matin</li></ul>",
        shortDescription: "Cagette de 5kg d'oranges douces et citrons verts frais."
      }
    }
  }
];

export const CATEGORIES_LIST = [
  {
    name: "Apparel & Fashion",
    slug: "apparel-fashion",
    description: "Trending streetwear, graphic hoodies, vintage jackets, and comfortable everyday fashion.",
    iconName: "Shirt",
    display_order: 1,
    is_active: true,
    translations: {
      fr: {
        name: "Mode & Vêtements",
        description: "Streetwear tendance, sweats graphiques, vestes vintage et mode décontractée."
      }
    }
  },
  {
    name: "Footwear & Shoes",
    slug: "footwear-shoes",
    description: "Iconic sneakers, lightweight running shoes, trail boots, and comfy platform trainers.",
    iconName: "Shoe",
    display_order: 2,
    is_active: true,
    translations: {
      fr: {
        name: "Chaussures & Baskets",
        description: "Baskets iconiques, chaussures de course légères, bottes de trail et claquettes confort."
      }
    }
  },
  {
    name: "Cosmetics & Beauty",
    slug: "cosmetics-beauty",
    description: "Glow serums, zero-white-cast sunscreens, whipped body butters, and nourishing skincare essentials.",
    iconName: "Sparkles",
    display_order: 3,
    is_active: true,
    translations: {
      fr: {
        name: "Cosmétiques & Beauté",
        description: "Sérums éclat, écrans solaires invisibles, beurres corporels fouettés et soins essentiels."
      }
    }
  },
  {
    name: "Electronics & Tech",
    slug: "electronics-tech",
    description: "Noise-canceling earbuds, fast-charge power banks, smart fitness watches, and tech accessories.",
    iconName: "Cpu",
    display_order: 4,
    is_active: true,
    translations: {
      fr: {
        name: "Électronique & High-Tech",
        description: "Écouteurs anti-bruit, batteries externes rapides, montres intelligentes et câbles renforcés."
      }
    }
  },
  {
    name: "Fresh Produce & Snacks",
    slug: "fresh-produce-snacks",
    description: "Farm-fresh fruit baskets, roasted cashews, artisan chocolates, and dorm study snacks delivered fast.",
    iconName: "Apple",
    display_order: 5,
    is_active: true,
    translations: {
      fr: {
        name: "Produits Frais & Snacks",
        description: "Paniers de fruits frais, noix de cajou grillées, chocolats et collations livrés express."
      }
    }
  }
];

export const seedPinterestProducts = async () => {
  try {
    await connectDatabase();
    console.log("Connected to MongoDB for seeding Pinterest products...");

    // 1. Seed or Upsert Categories
    for (const cat of CATEGORIES_LIST) {
      await Category.findOneAndUpdate(
        { $or: [{ slug: cat.slug }, { name: cat.name }] },
        { $set: cat },
        { upsert: true, returnDocument: "after" }
      );
    }
    console.log(`Ensured all ${CATEGORIES_LIST.length} store categories exist.`);

    // 2. Clear old or seed new products
    let count = 0;
    for (const prod of PINTEREST_PRODUCTS) {
      await Product.findOneAndUpdate(
        { id: prod.id },
        { $set: prod },
        { upsert: true, returnDocument: "after" }
      );
      count++;
    }

    console.log(`Successfully seeded ${count} Pinterest products across all categories with reliable CDN URLs!`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed Pinterest products:", error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedPinterestProducts();
}
