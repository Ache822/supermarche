import fs from 'fs';
import path from 'path';

const enPath = 'c:/ICP/supermarche/frontend/src/locales/translations/en.json';
const frPath = 'c:/ICP/supermarche/frontend/src/locales/translations/fr.json';

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const frData = JSON.parse(frPath, 'utf8');

const products = [
  // 1. Apparel & Fashion
  {
    id: "prod-app-01",
    enTitle: "Oversized Vintage Heavyweight Graphic Hoodie",
    enDesc: "Premium 450GSM cotton fleece oversized hoodie with vintage washed distressed aesthetic. Double-layered hood and kangaroo pocket.",
    frTitle: "Sweat à Capuche Vintage Oversize Premium",
    frDesc: "Sweat à capuche oversize en molleton de coton lourd 450GSM avec finition délavée vintage. Capuche thermique doublée et poche kangourou."
  },
  {
    id: "prod-app-02",
    enTitle: "Minimalist Streetwear Heavyweight Tee",
    enDesc: "Structured 260GSM combed cotton boxy tee. Thick ribbed collar and clean aesthetic for effortless everyday streetwear styling.",
    frTitle: "T-Shirt Épais Streetwear Minimaliste",
    frDesc: "T-shirt boxy structuré en coton peigné 260GSM. Col côtelé épais et esthétique épurée pour un style streetwear quotidien sans effort."
  },
  {
    id: "prod-app-03",
    enTitle: "Cargo Tactical Multi-Pocket Techwear Pants",
    enDesc: "Durable water-repellent ripstop cargo trousers featuring 6 tactical utility pockets and adjustable toggle ankle drawstrings.",
    frTitle: "Pantalon Cargo Tactique Multi-Poches Techwear",
    frDesc: "Pantalon cargo en ripstop hydrofuge résistant doté de 6 poches tactiques utilitaires et cordons de serrage ajustables aux chevilles."
  },
  {
    id: "prod-app-04",
    enTitle: "Retro Embroidered Varsity Bomber Jacket",
    enDesc: "Classic campus collegiate varsity jacket featuring woolen body, contrasting faux-leather sleeves, and custom chenille embroidered badges.",
    frTitle: "Blouson Bomber Varsity Brodier Rétro",
    frDesc: "Veste varsity universitaire classique avec corps en laine, manches contrastées en simili cuir et badges brodés en chenille."
  },
  {
    id: "prod-app-05",
    enTitle: "Vintage Acid-Wash Denim Trucker Jacket",
    enDesc: "Timeless 14oz rigid denim trucker jacket with an authentic stone acid-wash texture and classic dual flap chest pockets.",
    frTitle: "Veste en Jean Trucker Délavée Vintage",
    frDesc: "Veste en denim rigide intemporelle 14oz avec texture délavée à l'acide authentique et doubles poches poitrine à rabat."
  },
  {
    id: "prod-app-06",
    enTitle: "Casual Cotton Zip-Up Tracksuit Set",
    enDesc: "Coordinated 2-piece fleece tracksuit featuring a full-zip hoodie jacket and tapered matching joggers with brushed inner fleece.",
    frTitle: "Ensemble Survêtement Zippé en Coton",
    frDesc: "Ensemble de survêtement 2 pièces en molleton comprenant une veste à capuche entièrement zippée et un pantalon de jogging fuselé assorti."
  },

  // 2. Footwear & Shoes
  {
    id: "prod-ftw-01",
    enTitle: "Retro High-Top Campus Basketball Sneakers",
    enDesc: "Iconic high-top basketball silhouette engineered with genuine leather overlays, air-cushioned midsole, and pivot-point rubber outsole.",
    frTitle: "Baskets Montantes Rétro Campus Basketball",
    frDesc: "Silhouette montante de basket iconique conçue avec empiècements en cuir véritable, semelle amortissante et semelle extérieure adhérente."
  },
  {
    id: "prod-ftw-02",
    enTitle: "Breathable Lightweight Mesh Running Shoes",
    enDesc: "Engineered for maximum breathability during runs and long walking commutes. Responsive EVA foam midsoles and flexible knit mesh uppers.",
    frTitle: "Chaussures de Running Légères et Respirantes",
    frDesc: "Conçues pour une respirabilité optimale lors des courses et longues marches. Mousse EVA réactive et tige en maille souple."
  },
  {
    id: "prod-ftw-03",
    enTitle: "Chunky Platform Streetwear Trainers",
    enDesc: "Bold 90s aesthetic elevated with a sculpted chunky 5cm platform sole, cushioned collar, and reflective 3M accent paneling.",
    frTitle: "Baskets Basses Chunky Streetwear à Plateforme",
    frDesc: "Style audacieux des années 90 rehaussé d'une semelle plateforme de 5 cm, col rembourré et détails réfléchissants 3M."
  },
  {
    id: "prod-ftw-04",
    enTitle: "Classic Low-Profile Canvas Skate Shoes",
    enDesc: "Durable 12oz double-stitched canvas low-tops featuring vulcanized waffle rubber grip soles and reinforced protective toe caps.",
    frTitle: "Chaussures de Skate en Toile Classiques",
    frDesc: "Baskets basses en toile robuste 12oz à double couture avec semelle vulcanisée gaufrée et embout de protection renforcé."
  },
  {
    id: "prod-ftw-05",
    enTitle: "All-Weather Waterproof Trail & Hiking Boots",
    enDesc: "Rugged outdoor boots engineered with waterproof membrane lining, padded ankle collars, and deep 5mm lug traction outsoles.",
    frTitle: "Chaussures de Trail & Randonnée Imperméables",
    frDesc: "Chaussures d'extérieur robustes dotées d'une membrane imperméable scellée, col montant matelassé et semelles crantées 5mm."
  },
  {
    id: "prod-ftw-06",
    enTitle: "Ergonomic Slip-On Comfort Cloud Slides",
    enDesc: "Molded 4cm high-density EVA foam slides with an anatomical footbed and non-slip diamond sole for post-workout recovery and relaxation.",
    frTitle: "Claquettes Ergonomiques Ultra Confort Cloud",
    frDesc: "Claquettes moulées en mousse EVA haute densité 4 cm avec assise plantaire anatomique et semelle antidérapante pour la détente."
  },

  // 3. Cosmetics & Beauty
  {
    id: "prod-cos-01",
    enTitle: "Hydrating Glow Vitamin C & Hyaluronic Serum",
    enDesc: "Brightening antioxidant facial serum concentrated with 15% Ethyl Ascorbic Acid, Hyaluronic Acid, and Vitamin E to fade dark spots.",
    frTitle: "Sérum Éclat Vitamine C & Acide Hyaluronique",
    frDesc: "Sérum visage antioxydant illuminateur concentré à 15% de Vitamine C stabilisée et acide hyaluronique pour estomper les taches."
  },
  {
    id: "prod-cos-02",
    enTitle: "Broad Spectrum SPF 50+ Invisible Shield Sunscreen",
    enDesc: "Ultra-lightweight gel cream SPF 50+ sunscreen formulated for melanin-rich skin. Leaves zero white cast with velvety matte finish.",
    frTitle: "Écran Solaire Invisible SPF 50+ Sans Traces",
    frDesc: "Crème gel solaire SPF 50+ ultra-légère conçue pour les peaux noires et métissées. Zéro trace blanche avec fini mat velouté."
  },
  {
    id: "prod-cos-03",
    enTitle: "Deep Cleansing Botanical Exfoliating Face Scrub",
    enDesc: "Gentle micro-polishing facial scrub infused with salicylic acid (BHA), jojoba beads, and tea tree oil to decongest pores.",
    frTitle: "Gommage Visage Exfoliant Botanique Purifiant",
    frDesc: "Gommage micro-polissant doux enrichi en acide salicylique (BHA), perles de jojoba et huile d'arbre à thé pour purifier les pores."
  },
  {
    id: "prod-cos-04",
    enTitle: "Ultra-Nourishing Shea & Cocoa Whipped Body Butter",
    enDesc: "Rich decadent body moisturizer hand-whipped with raw unrefined West African Shea Butter, pure Cocoa Butter, and sweet almond oil.",
    frTitle: "Beurre Corporel Fouetté Karité & Cacao Pur",
    frDesc: "Soin corporel onctueux fouetté à la main avec du beurre de karité brut d'Afrique de l'Ouest, cacao pur et huile d'amande douce."
  },
  {
    id: "prod-cos-05",
    enTitle: "Matte Long-Wear Lip Glaze & Lip Oil Duo",
    enDesc: "Dual-ended luxury lip set featuring a transfer-proof liquid matte lipstick on one end and a nourishing hyaluronic lip oil on the other.",
    frTitle: "Duo Rouge à Lèvres Mat Longue Tenue & Huile à Lèvres",
    frDesc: "Coffret lèvres double embout composé d'un rouge à lèvres mat sans transfert et d'une huile à lèvres brillante nourrissante."
  },
  {
    id: "prod-cos-06",
    enTitle: "Aromatherapy Botanical Mist & Rosewater Toner",
    enDesc: "Pure distilled Damask rose petal hydrosol blended with aloe vera extract and chamomile to refresh skin and balance pH.",
    frTitle: "Brume Botanique Aromathérapie & Eau de Rose Pure",
    frDesc: "Hydrolat pur de pétales de rose de Damas distillé combiné à l'aloe vera et à la camomille pour rafraîchir le teint et rééquilibrer le pH."
  },

  // 4. Electronics & Tech
  {
    id: "prod-tec-01",
    enTitle: "Pro ANC Wireless Bluetooth Noise-Canceling Earbuds",
    enDesc: "True wireless earbuds with 35dB active noise canceling, transparency mode, 10mm dynamic bass drivers, and 32h playback.",
    frTitle: "Écouteurs Sans Fil Pro ANC avec Réduction de Bruit",
    frDesc: "Écouteurs sans fil avec réduction active du bruit 35dB, mode transparence, basses 10mm et 32h d'autonomie totale."
  },
  {
    id: "prod-tec-02",
    enTitle: "20,000mAh Dual USB-C Fast Power Bank (22.5W)",
    enDesc: "High-capacity portable battery pack equipped with dual 22.5W USB-C Power Delivery ports and smart digital LED battery readout.",
    frTitle: "Batterie Externe 20 000mAh Charge Rapide Double USB-C",
    frDesc: "Batterie portable haute capacité équipée de deux ports Power Delivery USB-C 22,5W et d'un écran LED numérique de pourcentage."
  },
  {
    id: "prod-tec-03",
    enTitle: "Waterproof Portable Bluetooth Bass Speaker",
    enDesc: "Rugged outdoor speaker pumping 360-degree punchy bass audio with dual passive radiators and IPX7 complete submersion waterproofing.",
    frTitle: "Enceinte Bluetooth Portable Étanche Bass Boost",
    frDesc: "Enceinte d'extérieur robuste avec son surround 360°, basses percutantes et étanchéité totale IPX7 submersible."
  },
  {
    id: "prod-tec-04",
    enTitle: "Smart Fitness Watch with Heart Rate & GPS Track",
    enDesc: "Sleek AMOLED touch smartwatch featuring 24/7 heart rate and blood oxygen monitoring, 100+ workout modes, and 7-day battery life.",
    frTitle: "Montre Connectée Fitness AMOLED avec Suivi Cardiaque",
    frDesc: "Montre intelligente tactile AMOLED avec suivi continu du rythme cardiaque et SpO2, plus de 100 modes de sport et 7 jours d'autonomie."
  },
  {
    id: "prod-tec-05",
    enTitle: "Multi-Angle MagSafe Wireless Phone Charging Stand",
    enDesc: "Solid aluminum alloy adjustable desktop stand with integrated 15W Qi wireless fast charger and magnetic auto-alignment.",
    frTitle: "Support de Téléphone MagSafe Inclinable avec Charge Sans Fil",
    frDesc: "Support de bureau en aluminium robuste avec chargeur rapide sans fil 15W magnétique pour appels mains libres et bureau organisé."
  },
  {
    id: "prod-tec-06",
    enTitle: "Braided Nylon 100W Fast Charging Cable Kit (3-Pack)",
    enDesc: "Triple pack of ultra-durable braided nylon cables (1m, 2m, 3m) supporting up to 100W Power Delivery and high-speed data transfer.",
    frTitle: "Pack de 3 Câbles Tressés en Nylon 100W Charge Rapide",
    frDesc: "Pack de 3 câbles ultra-résistants en nylon tressé (1m, 2m, 3m) supportant jusqu'à 100W Power Delivery pour téléphones et ordinateurs."
  },

  // 5. Fresh Produce & Snacks
  {
    id: "prod-prd-01",
    enTitle: "Fresh Organic Fruit & Farm Produce Basket",
    enDesc: "Hand-picked farm-fresh basket including crisp red apples, sweet bananas, seasonal oranges, avocados, and fresh farm veggies.",
    frTitle: "Panier de Fruits Frais & Légumes Bio du Terroir",
    frDesc: "Panier de produits frais de la ferme comprenant pommes croquantes, bananes douces, oranges de saison, avocats et légumes frais."
  },
  {
    id: "prod-prd-02",
    enTitle: "Artisan Chocolates & Campus Munchies Snack Pack",
    enDesc: "Delightful variety snack box containing imported milk and dark chocolates, crisp hazelnut wafer rolls, and sweet cookies.",
    frTitle: "Coffret Chocolats Artisans & Friandises Gourmandes",
    frDesc: "Boîte gourmande variée contenant chocolats au lait et noirs, gaufrettes croustillantes aux noisettes et biscuits savoureux."
  },
  {
    id: "prod-prd-03",
    enTitle: "Premium Roasted Cashews & Plantain Chips Mix",
    enDesc: "Crunchy golden lightly-salted roasted cashew nuts paired with freshly sliced artisan ripe plantain crisps in stay-fresh pouch.",
    frTitle: "Mix Noix de Cajou Grillées & Chips de Banane Plantain",
    frDesc: "Noix de cajou dorées croquantes légèrement salées accompagnées de chips artisanales de bananes plantains croustillantes."
  },
  {
    id: "prod-prd-04",
    enTitle: "Farm Fresh Grade-A Organic Eggs & Dairy Pack",
    enDesc: "Crate of 30 farm-fresh Grade-A brown eggs from free-range hens paired with pasteurized fresh whole milk in protective packaging.",
    frTitle: "Plateau d'Œufs Frais Fermiers Bio & Lait Entier",
    frDesc: "Plateau de 30 œufs bruns extra-frais bio de poules élevées en plein air avec bouteille de lait entier pasteurisé."
  },
  {
    id: "prod-prd-05",
    enTitle: "Imported Gourmet Biscuits & Belgian Wafers Box",
    enDesc: "Deluxe tin collection of European butter cookies, chocolate-dipped shortbreads, and crispy caramelized Belgian waffle biscuits.",
    frTitle: "Boîte de Biscuits Fins & Gaufres Caramélisées",
    frDesc: "Sélection de biscuits pur beurre européens, sablés au chocolat et fines gaufres croustillantes caramélisées."
  },
  {
    id: "prod-prd-06",
    enTitle: "Fresh Juicy Tropical Citrus Basket (Oranges & Limes)",
    enDesc: "5kg crate of sweet Valencia sun-ripened oranges, juicy pink grapefruits, and aromatic green limes fresh from orchard groves.",
    frTitle: "Cagette d'Agrumes Tropicaux Frais (Oranges & Citrons)",
    frDesc: "Cagette de 5 kg d'oranges douces gorgées de soleil, pamplemousses juteux et citrons verts parfumés récoltés en verger."
  }
];

if (!enData.shop) enData.shop = {};
if (!enData.shop.products) enData.shop.products = {};
if (!frData.shop) frData.shop = {};
if (!frData.shop.products) frData.shop.products = {};

for (const p of products) {
  enData.shop.products[p.id] = {
    title: p.enTitle,
    desc: p.enDesc
  };
  frData.shop.products[p.id] = {
    title: p.frTitle,
    desc: p.frDesc
  };
}

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2) + '\n', 'utf8');
fs.writeFileSync(frPath, JSON.stringify(frData, null, 2) + '\n', 'utf8');

console.log('Successfully updated en.json and fr.json with all 30 products!');
