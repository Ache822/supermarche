import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  Chip,
  InputAdornment,
  Stack,
  Rating,
  CircularProgress,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api from '../../api/client';
import { useCart } from '../../context/CartContext';
import type { ProductItem } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DEFAULT_STORE_PRODUCTS: ProductItem[] = [
  // 1. Apparel & Fashion (6 products)
  {
    _id: 'prod-app-01',
    title: 'Oversized Vintage Heavyweight Graphic Hoodie',
    slug: 'oversized-vintage-heavyweight-graphic-hoodie',
    description: '<p>Premium 450GSM cotton fleece oversized hoodie with vintage washed distressed aesthetic. Designed with dropped shoulders, kangaroo pocket, and double-layered thermal hood.</p><ul><li>450 GSM Heavyweight Terry Cotton</li><li>Pre-shrunk vintage wash finish</li><li>Ribbed cuffs & hem</li><li>Unisex relaxed boxy silhouette</li></ul>',
    shortDescription: 'Heavyweight 450GSM cotton fleece vintage graphic hoodie.',
    price: 28500,
    compareAtPrice: 34000,
    category: 'Apparel & Fashion',
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 45,
    inStock: true,
    sku: 'APP-HD-001',
  },
  {
    _id: 'prod-app-02',
    title: 'Minimalist Streetwear Heavyweight Tee',
    slug: 'minimalist-streetwear-heavyweight-tee',
    description: '<p>Structured 260GSM combed cotton boxy tee. Thick ribbed collar and clean aesthetic for effortless everyday streetwear styling.</p><ul><li>100% Combed ring-spun cotton</li><li>Thick 1.25" seamless neck ribbing</li><li>Reinforced shoulder taping</li></ul>',
    shortDescription: 'Structured 260GSM combed cotton boxy tee.',
    price: 14000,
    compareAtPrice: 18000,
    category: 'Apparel & Fashion',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 60,
    inStock: true,
    sku: 'APP-TE-002',
  },
  {
    _id: 'prod-app-03',
    title: 'Cargo Tactical Multi-Pocket Techwear Pants',
    slug: 'cargo-tactical-multi-pocket-techwear-pants',
    description: '<p>Durable water-repellent ripstop cargo trousers featuring 6 tactical utility pockets, adjustable ankle drawstrings, and an elasticated waistband with quick-release buckle.</p><ul><li>Weather-resistant ripstop nylon blend</li><li>6 Deep utility cargo compartments</li><li>Adjustable toggle ankle cuffs</li></ul>',
    shortDescription: 'Ripstop cargo trousers with 6 utility pockets.',
    price: 22500,
    compareAtPrice: 27000,
    category: 'Apparel & Fashion',
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 35,
    inStock: true,
    sku: 'APP-CG-003',
  },
  {
    _id: 'prod-app-04',
    title: 'Retro Embroidered Varsity Bomber Jacket',
    slug: 'retro-embroidered-varsity-bomber-jacket',
    description: '<p>Classic campus collegiate varsity jacket featuring woolen body, contrasting faux-leather sleeves, quilted satin lining, and custom chenille embroidered badges.</p><ul><li>Warm wool-blend body with vegan leather sleeves</li><li>Quilted diamond thermal lining</li><li>Heavy-duty snap front closure</li></ul>',
    shortDescription: 'Collegiate varsity jacket with embroidered badges.',
    price: 38000,
    compareAtPrice: 45000,
    category: 'Apparel & Fashion',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 20,
    inStock: true,
    sku: 'APP-VR-004',
  },
  {
    _id: 'prod-app-05',
    title: 'Vintage Acid-Wash Denim Trucker Jacket',
    slug: 'vintage-acid-wash-denim-trucker-jacket',
    description: '<p>Timeless 14oz rigid denim trucker jacket with an authentic stone acid-wash texture, metal shank buttons, and dual chest flap pockets.</p><ul><li>100% Heavyweight cotton denim (14oz)</li><li>Vintage stone acid wash treatment</li><li>Classic dual flap chest pockets & welt pockets</li></ul>',
    shortDescription: '14oz rigid denim trucker jacket with stone wash.',
    price: 32000,
    compareAtPrice: 38500,
    category: 'Apparel & Fashion',
    images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 28,
    inStock: true,
    sku: 'APP-DN-005',
  },
  {
    _id: 'prod-app-06',
    title: 'Casual Cotton Zip-Up Tracksuit Set',
    slug: 'casual-cotton-zip-up-tracksuit-set',
    description: '<p>Coordinated 2-piece fleece tracksuit featuring a full-zip hoodie jacket and tapered matching joggers. Ultra-soft interior brushed fleece for daily comfort and travel.</p><ul><li>Includes zip jacket + matching jogger bottoms</li><li>Brushed thermal inner fleece</li><li>Zippered side pockets on jacket and pants</li></ul>',
    shortDescription: '2-piece fleece tracksuit with zip hoodie and joggers.',
    price: 35000,
    compareAtPrice: 42000,
    category: 'Apparel & Fashion',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 30,
    inStock: true,
    sku: 'APP-TS-006',
  },

  // 2. Footwear & Shoes (6 products)
  {
    _id: 'prod-ftw-01',
    title: 'Retro High-Top Campus Basketball Sneakers',
    slug: 'retro-high-top-campus-basketball-sneakers',
    description: '<p>Iconic high-top basketball silhouette engineered with genuine leather overlays, air-cushioned midsole, and pivot-point rubber outsole for traction.</p><ul><li>Premium full-grain leather upper</li><li>Encapsulated Air-Sole cushioning in heel</li><li>High-traction cupsole rubber base</li></ul>',
    shortDescription: 'Iconic high-top basketball sneakers in full leather.',
    price: 45000,
    compareAtPrice: 52000,
    category: 'Footwear & Shoes',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 32,
    inStock: true,
    sku: 'FTW-BB-001',
  },
  {
    _id: 'prod-ftw-02',
    title: 'Breathable Lightweight Mesh Running Shoes',
    slug: 'breathable-lightweight-mesh-running-shoes',
    description: '<p>Engineered for maximum breathability during runs and long walking commutes. Featuring responsive EVA foam midsoles and flexible knit mesh uppers.</p><ul><li>Ultra-breathable engineered knit upper</li><li>Shock-absorbing dual-density EVA foam midsole</li><li>Featherweight construction (240g)</li></ul>',
    shortDescription: 'Ultra-breathable lightweight mesh running sneakers.',
    price: 28000,
    compareAtPrice: 33000,
    category: 'Footwear & Shoes',
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 40,
    inStock: true,
    sku: 'FTW-RN-002',
  },
  {
    _id: 'prod-ftw-03',
    title: 'Chunky Platform Streetwear Trainers',
    slug: 'chunky-platform-streetwear-trainers',
    description: '<p>Bold 90s aesthetic elevated with a sculpted chunky 5cm platform sole. Cushioned collar, reinforced heel counter, and multi-texture overlay panels.</p><ul><li>5cm Sculpted lightweight platform sole</li><li>Padded memory foam insole</li><li>Reflective 3M accent paneling</li></ul>',
    shortDescription: 'Bold 90s streetwear sneakers with 5cm platform.',
    price: 36500,
    compareAtPrice: 44000,
    category: 'Footwear & Shoes',
    images: ['https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 25,
    inStock: true,
    sku: 'FTW-CK-003',
  },
  {
    _id: 'prod-ftw-04',
    title: 'Classic Low-Profile Canvas Skate Shoes',
    slug: 'classic-low-profile-canvas-skate-shoes',
    description: '<p>Durable 12oz double-stitched canvas low-tops featuring vulcanized waffle rubber grip soles and reinforced toe caps for all-day board or campus wear.</p><ul><li>12oz Heavy-duty double canvas</li><li>Vulcanized gum rubber waffle sole</li><li>Reinforced rubber toe cap protection</li></ul>',
    shortDescription: 'Durable 12oz double canvas skate shoes.',
    price: 24000,
    compareAtPrice: 29000,
    category: 'Footwear & Shoes',
    images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 45,
    inStock: true,
    sku: 'FTW-SK-004',
  },
  {
    _id: 'prod-ftw-05',
    title: 'All-Weather Waterproof Trail & Hiking Boots',
    slug: 'all-weather-waterproof-trail-hiking-boots',
    description: '<p>Rugged outdoor boots engineered with waterproof membrane lining, ankle support collars, rust-proof speed lacing hooks, and deep lug lugged traction outsoles.</p><ul><li>Hydro-Shield waterproof sealed membrane</li><li>Aggressive 5mm rubber lug grip tread</li><li>Supportive high-density padded ankle collar</li></ul>',
    shortDescription: 'Rugged waterproof outdoor boots with ankle support.',
    price: 48000,
    compareAtPrice: 58000,
    category: 'Footwear & Shoes',
    images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 18,
    inStock: true,
    sku: 'FTW-HK-005',
  },
  {
    _id: 'prod-ftw-06',
    title: 'Ergonomic Slip-On Comfort Cloud Slides',
    slug: 'ergonomic-slip-on-comfort-cloud-slides',
    description: '<p>Molded 4cm high-density EVA foam slides with an anatomical footbed and non-slip diamond sole. Perfect for recovery, beach, dorms, and casual relaxation.</p><ul><li>4cm Ultra-thick cloud-cushioned EVA foam</li><li>Deep heel cup & orthopedic arch support</li><li>Waterproof, washable and quick-drying</li></ul>',
    shortDescription: 'Molded 4cm cloud-cushioned EVA foam slides.',
    price: 12500,
    compareAtPrice: 16000,
    category: 'Footwear & Shoes',
    images: ['https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 50,
    inStock: true,
    sku: 'FTW-SL-006',
  },

  // 3. Cosmetics & Beauty (6 products)
  {
    _id: 'prod-cos-01',
    title: 'Hydrating Glow Vitamin C & Hyaluronic Serum',
    slug: 'hydrating-glow-vitamin-c-hyaluronic-serum',
    description: '<p>Brightening antioxidant facial serum concentrated with 15% Ethyl Ascorbic Acid, Multi-Molecular Hyaluronic Acid, and Vitamin E to fade hyperpigmentation and boost natural glow.</p><ul><li>15% Stabilized Vitamin C complex</li><li>Non-comedogenic, fragrance-free formula</li><li>Visibly fades dark spots and evens tone</li></ul>',
    shortDescription: '15% Vitamin C and hyaluronic brightening serum.',
    price: 16000,
    compareAtPrice: 20000,
    category: 'Cosmetics & Beauty',
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 55,
    inStock: true,
    sku: 'COS-VC-001',
  },
  {
    _id: 'prod-cos-02',
    title: 'Broad Spectrum SPF 50+ Invisible Shield Sunscreen',
    slug: 'broad-spectrum-spf-50-invisible-shield-sunscreen',
    description: '<p>Ultra-lightweight gel cream SPF 50+ sunscreen formulated specifically for tropical climates and melanin-rich skin. Leaves zero white cast and dries down to a velvety matte finish.</p><ul><li>SPF 50+ PA++++ Broad UVA/UVB protection</li><li>Zero white cast on dark skin tones</li><li>Sweat-resistant & non-greasy</li></ul>',
    shortDescription: 'Broad-spectrum SPF 50+ sunscreen with zero white cast.',
    price: 14500,
    compareAtPrice: 18000,
    category: 'Cosmetics & Beauty',
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 65,
    inStock: true,
    sku: 'COS-SF-002',
  },
  {
    _id: 'prod-cos-03',
    title: 'Deep Cleansing Botanical Exfoliating Face Scrub',
    slug: 'deep-cleansing-botanical-exfoliating-face-scrub',
    description: '<p>Gentle micro-polishing facial scrub infused with salicylic acid (BHA), jojoba beads, and tea tree oil to decongest pores and eliminate dead skin cells.</p><ul><li>Jojoba biodegradable micro-beads</li><li>0.5% Salicylic Acid for pore clearing</li><li>Soothes inflammation with organic tea tree extract</li></ul>',
    shortDescription: 'Micro-polishing facial scrub with salicylic acid and tea tree.',
    price: 11000,
    compareAtPrice: 14000,
    category: 'Cosmetics & Beauty',
    images: ['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 40,
    inStock: true,
    sku: 'COS-SC-003',
  },
  {
    _id: 'prod-cos-04',
    title: 'Ultra-Nourishing Shea & Cocoa Whipped Body Butter',
    slug: 'ultra-nourishing-shea-cocoa-whipped-body-butter',
    description: '<p>Rich decadent body moisturizer hand-whipped with raw unrefined West African Shea Butter, pure Cocoa Butter, sweet almond oil, and warm vanilla essence.</p><ul><li>100% Raw Unrefined Shea Butter base</li><li>Intense 48-hour moisture barrier lock</li><li>Non-greasy rapid melt-in texture</li></ul>',
    shortDescription: 'Whipped body butter with raw shea and cocoa butter.',
    price: 9500,
    compareAtPrice: 12500,
    category: 'Cosmetics & Beauty',
    images: ['https://images.unsplash.com/photo-1608248597359-52e463a5661b?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 70,
    inStock: true,
    sku: 'COS-BB-004',
  },
  {
    _id: 'prod-cos-05',
    title: 'Matte Long-Wear Lip Glaze & Lip Oil Duo',
    slug: 'matte-long-wear-lip-glaze-lip-oil-duo',
    description: '<p>Dual-ended luxury lip set featuring a transfer-proof velvety liquid matte lipstick on one end and a nourishing hyaluronic-infused glossy lip oil on the other.</p><ul><li>12-Hour smudge-proof velvety matte formula</li><li>Nourishing argan oil & vitamin E gloss top coat</li><li>Highly pigmented single-stroke color payoff</li></ul>',
    shortDescription: 'Dual-ended velvety matte liquid lipstick and hydrating lip oil.',
    price: 8000,
    compareAtPrice: 10500,
    category: 'Cosmetics & Beauty',
    images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 45,
    inStock: true,
    sku: 'COS-LP-005',
  },
  {
    _id: 'prod-cos-06',
    title: 'Aromatherapy Botanical Mist & Rosewater Toner',
    slug: 'aromatherapy-botanical-mist-rosewater-toner',
    description: '<p>Pure distilled Damask rose petal hydrosol blended with aloe vera extract and chamomile to refresh skin, balance pH, and lock in makeup with radiant glow.</p><ul><li>100% Organic distilled Rose Hydrosol</li><li>Alcohol-free, soothing pH balance</li><li>Multi-use: toner, makeup setting spray & mid-day mist</li></ul>',
    shortDescription: 'Organic distilled rosewater mist and balancing toner.',
    price: 12000,
    compareAtPrice: 15000,
    category: 'Cosmetics & Beauty',
    images: ['https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 38,
    inStock: true,
    sku: 'COS-RM-006',
  },

  // 4. Electronics & Tech (6 products)
  {
    _id: 'prod-tec-01',
    title: 'Pro ANC Wireless Bluetooth Noise-Canceling Earbuds',
    slug: 'pro-anc-wireless-bluetooth-noise-canceling-earbuds',
    description: '<p>True wireless earbuds with 35dB active noise canceling, transparency pass-through mode, 10mm dynamic bass drivers, and 32 hours total playback with USB-C wireless charge case.</p><ul><li>Hybrid 35dB Active Noise Cancellation</li><li>32-Hour combined battery life with quick charge</li><li>IPX5 Sweat & rain water-resistant</li></ul>',
    shortDescription: 'True wireless earbuds with 35dB ANC and 32h playback.',
    price: 29000,
    compareAtPrice: 36000,
    category: 'Electronics & Tech',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 42,
    inStock: true,
    sku: 'TEC-EB-001',
  },
  {
    _id: 'prod-tec-02',
    title: '20,000mAh Dual USB-C Fast Power Bank (22.5W)',
    slug: '20000mah-dual-usb-c-fast-power-bank-22-5w',
    description: '<p>High-capacity portable battery pack equipped with dual 22.5W USB-C Power Delivery ports, digital LED battery percentage readout, and airline-approved safety chips.</p><ul><li>Charges an iPhone or Samsung phone up to 4.5 times</li><li>Digital smart LED battery display</li><li>Dual Type-C + USB-A multi-device output</li></ul>',
    shortDescription: '20,000mAh portable charger with 22.5W Power Delivery.',
    price: 22000,
    compareAtPrice: 27500,
    category: 'Electronics & Tech',
    images: ['https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 50,
    inStock: true,
    sku: 'TEC-PB-002',
  },
  {
    _id: 'prod-tec-03',
    title: 'Waterproof Portable Bluetooth Bass Speaker',
    slug: 'waterproof-portable-bluetooth-bass-speaker',
    description: '<p>Rugged outdoor speaker pumping 360-degree punchy bass audio with dual passive radiators, IPX7 complete submersion waterproofing, and 16 hours continuous playtime.</p><ul><li>Punchy 20W dual driver acoustic audio</li><li>IPX7 100% Waterproof & buoyant floating design</li><li>16-Hour battery life on single charge</li></ul>',
    shortDescription: '20W punchy bass Bluetooth speaker with IPX7 waterproof rating.',
    price: 26500,
    compareAtPrice: 32000,
    category: 'Electronics & Tech',
    images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 30,
    inStock: true,
    sku: 'TEC-SP-003',
  },
  {
    _id: 'prod-tec-04',
    title: 'Smart Fitness Watch with Heart Rate & GPS Track',
    slug: 'smart-fitness-watch-with-heart-rate-gps-track',
    description: '<p>Sleek AMOLED touch smartwatch featuring 24/7 heart rate and blood oxygen (SpO2) monitoring, 100+ workout modes, sleep tracking, and Bluetooth phone notifications.</p><ul><li>1.43" Vivid AMOLED touch display</li><li>All-day heart rate, SpO2 & sleep tracking</li><li>7-Day battery endurance on single charge</li></ul>',
    shortDescription: 'AMOLED touch smartwatch with heart rate and 100+ sport modes.',
    price: 34000,
    compareAtPrice: 42000,
    category: 'Electronics & Tech',
    images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 24,
    inStock: true,
    sku: 'TEC-SW-004',
  },
  {
    _id: 'prod-tec-05',
    title: 'Multi-Angle MagSafe Wireless Phone Charging Stand',
    slug: 'multi-angle-magsafe-wireless-phone-charging-stand',
    description: '<p>Solid aluminum alloy adjustable desktop stand with integrated 15W Qi wireless fast charger and powerful magnetic alignment for hands-free video calls and desk organization.</p><ul><li>15W Fast wireless magnetic charging</li><li>360-degree rotation & 180-degree angle tilt</li><li>Aviation-grade weighted aluminum alloy base</li></ul>',
    shortDescription: '15W magnetic wireless charging adjustable aluminum stand.',
    price: 11500,
    compareAtPrice: 15000,
    category: 'Electronics & Tech',
    images: ['https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 36,
    inStock: true,
    sku: 'TEC-ST-005',
  },
  {
    _id: 'prod-tec-06',
    title: 'Braided Nylon 100W Fast Charging Cable Kit (3-Pack)',
    slug: 'braided-nylon-100w-fast-charging-cable-kit-3-pack',
    description: '<p>Triple pack of ultra-durable braided nylon cables (1m, 2m, 3m) supporting up to 100W Power Delivery and high-speed 480Mbps data transfer for phones, tablets, and laptops.</p><ul><li>Supports up to 100W (20V/5A) fast charge</li><li>30,000+ Bend tested reinforced nylon jacket</li><li>Includes 1m, 2m, and 3m cable lengths</li></ul>',
    shortDescription: '3-Pack heavy duty 100W braided nylon USB-C cables.',
    price: 6500,
    compareAtPrice: 9000,
    category: 'Electronics & Tech',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 80,
    inStock: true,
    sku: 'TEC-CB-006',
  },

  // 5. Fresh Produce & Snacks (6 products)
  {
    _id: 'prod-prd-01',
    title: 'Fresh Organic Fruit & Farm Produce Basket',
    slug: 'fresh-organic-fruit-farm-produce-basket',
    description: '<p>Carefully hand-selected farm-fresh basket including crisp red apples, sweet ripe bananas, seasonal oranges, ripe avocados, and farm vegetables delivered chilled.</p><ul><li>Hand-inspected for peak ripeness and sweetness</li><li>Direct from local certified green organic farms</li><li>Packed in breathable eco-friendly craft basket</li></ul>',
    shortDescription: 'Hand-picked organic apples, bananas, oranges, and farm veggies.',
    price: 12500,
    compareAtPrice: 15500,
    category: 'Fresh Produce & Snacks',
    images: ['https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 60,
    inStock: true,
    sku: 'PRD-FB-001',
  },
  {
    _id: 'prod-prd-02',
    title: 'Artisan Chocolates & Campus Munchies Snack Pack',
    slug: 'artisan-chocolates-campus-munchies-snack-pack',
    description: '<p>Delightful variety snack box containing imported milk and dark chocolates, crisp hazelnut wafer rolls, savory cookies, and sweet confectionery for late study sessions.</p><ul><li>Assorted imported premium chocolates & wafers</li><li>Individually wrapped for freshness</li><li>Great for campus sharing or gifting</li></ul>',
    shortDescription: 'Assorted imported chocolates, hazelnut wafer rolls, and cookies.',
    price: 9000,
    compareAtPrice: 11500,
    category: 'Fresh Produce & Snacks',
    images: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 75,
    inStock: true,
    sku: 'PRD-CH-002',
  },
  {
    _id: 'prod-prd-03',
    title: 'Premium Roasted Cashews & Plantain Chips Mix',
    slug: 'premium-roasted-cashews-plantain-chips-mix',
    description: '<p>Crunchy golden lightly-salted roasted cashew nuts paired with freshly sliced artisan ripe plantain crisps. Packaged in resealable stay-fresh pouches.</p><ul><li>Whole kernel roasted jumbo cashews</li><li>Thinly sliced golden crispy plantain chips</li><li>Resealable airtight zipper pouch</li></ul>',
    shortDescription: 'Lightly salted roasted jumbo cashews with crispy plantain chips.',
    price: 6500,
    compareAtPrice: 8500,
    category: 'Fresh Produce & Snacks',
    images: ['https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 85,
    inStock: true,
    sku: 'PRD-CS-003',
  },
  {
    _id: 'prod-prd-04',
    title: 'Farm Fresh Grade-A Organic Eggs & Dairy Pack',
    slug: 'farm-fresh-grade-a-organic-eggs-dairy-pack',
    description: '<p>Crate of 30 farm-fresh Grade-A brown eggs from free-range hens paired with pasteurized fresh whole milk. Delivered in shock-absorbent protective packaging.</p><ul><li>30 Free-range Grade-A organic eggs</li><li>High in natural protein and omega-3</li><li>Guaranteed zero cracked egg delivery guarantee</li></ul>',
    shortDescription: '30 free-range Grade-A eggs and pasteurized fresh milk.',
    price: 7500,
    compareAtPrice: 9500,
    category: 'Fresh Produce & Snacks',
    images: ['https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 50,
    inStock: true,
    sku: 'PRD-EG-004',
  },
  {
    _id: 'prod-prd-05',
    title: 'Imported Gourmet Biscuits & Belgian Wafers Box',
    slug: 'imported-gourmet-biscuits-belgian-wafers-box',
    description: '<p>Deluxe tin collection of European butter cookies, chocolate-dipped shortbreads, and crispy caramelized Belgian waffle biscuits.</p><ul><li>Classic Danish-style pure butter biscuits</li><li>Crisp caramel waffle biscuits</li><li>Collectible airtight keepsake tin</li></ul>',
    shortDescription: 'European butter cookies and Belgian caramel waffle biscuits.',
    price: 8500,
    compareAtPrice: 11000,
    category: 'Fresh Produce & Snacks',
    images: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 40,
    inStock: true,
    sku: 'PRD-WF-005',
  },
  {
    _id: 'prod-prd-06',
    title: 'Fresh Juicy Tropical Citrus Basket (Oranges & Limes)',
    slug: 'fresh-juicy-tropical-citrus-basket-oranges-limes',
    description: '<p>5kg crate of sweet Valencia sun-ripened oranges, juicy pink grapefruits, and aromatic green limes picked fresh from southern orchard groves.</p><ul><li>5kg Assorted fresh citrus crate</li><li>Packed with natural immune-boosting Vitamin C</li><li>Ideal for fresh breakfast juicing</li></ul>',
    shortDescription: '5kg crate of Valencia oranges, pink grapefruits, and limes.',
    price: 7000,
    compareAtPrice: 9000,
    category: 'Fresh Produce & Snacks',
    images: ['https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: 65,
    inStock: true,
    sku: 'PRD-CT-006',
  },
];

export const ShopPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Pagination state (10 items per page)
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const STORE_CATEGORIES = [
    'All',
    'Apparel & Fashion',
    'Footwear & Shoes',
    'Cosmetics & Beauty',
    'Electronics & Tech',
    'Fresh Produce & Snacks',
  ];

  const getCategoryFallbackImage = (categoryName: string) => {
    const cat = (categoryName || '').toLowerCase();
    if (cat.includes('apparel') || cat.includes('mode') || cat.includes('vêtement')) {
      return 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80';
    }
    if (cat.includes('footwear') || cat.includes('shoes') || cat.includes('chaussure')) {
      return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80';
    }
    if (cat.includes('cosmetics') || cat.includes('beauty') || cat.includes('beauté')) {
      return 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80';
    }
    if (cat.includes('electr') || cat.includes('tech')) {
      return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
    }
    if (cat.includes('produce') || cat.includes('snack') || cat.includes('frais')) {
      return 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80';
    }
    return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';
  };

  const getLocalizedCategoryName = (cat: string) => {
    switch (cat) {
      case 'All':
      case 'Tout':
      case 'Tous':
        return t('shop.categories.all');
      case 'Apparel & Fashion':
      case 'Vêtements & Mode':
      case 'Mode & Vêtements':
        return t('shop.categories.apparel');
      case 'Footwear & Shoes':
      case 'Chaussures & Baskets':
        return t('shop.categories.footwear');
      case 'Cosmetics & Beauty':
      case 'Cosmétiques & Beauté':
        return t('shop.categories.cosmetics');
      case 'Electronics & Tech':
      case 'Électronique & High-Tech':
        return t('shop.categories.electronics');
      case 'Fresh Produce & Snacks':
      case 'Produits Frais & Snacks':
        return t('shop.categories.fresh');
      default:
        return cat;
    }
  };

  const getLocalizedProduct = (product: ProductItem) => {
    const titleKey = `shop.products.${product._id}.title`;
    const descKey = `shop.products.${product._id}.desc`;
    const hasTranslation = i18n.exists(titleKey);
    const rawDesc = hasTranslation ? t(descKey) : product.shortDescription || product.description;
    return {
      title: hasTranslation ? t(titleKey) : product.title,
      description: rawDesc ? rawDesc.replace(/<[^>]*>/g, '').trim() : '',
    };
  };

  const fetchProducts = async (targetPage = page) => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page: targetPage,
        limit: PAGE_SIZE,
      };
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      if (inStockOnly) {
        params.inStock = true;
      }
      if (sortBy === 'price_low') {
        params.sort = 'price';
      } else if (sortBy === 'price_high') {
        params.sort = '-price';
      } else if (sortBy === 'newest') {
        params.sort = '-createdAt';
      }

      const response: any = await api.products.list(params);
      let items: ProductItem[] = response?.data || [];
      
      if (items.length > 0 && response?.meta) {
        setProducts(items);
        setTotalPages(response.meta.totalPages || 1);
        setTotalCount(response.meta.totalDocuments || items.length);
      } else if (items.length > 0) {
        setProducts(items);
        setTotalPages(Math.ceil(items.length / PAGE_SIZE) || 1);
        setTotalCount(items.length);
      } else {
        // Fallback seed products if database returns empty
        let fallbackItems = DEFAULT_STORE_PRODUCTS;

        if (selectedCategory !== 'All') {
          fallbackItems = fallbackItems.filter((p) => {
            const cat = typeof p.category === 'object' && p.category !== null ? (p.category as any).name : String(p.category || '');
            return cat.toLowerCase().includes(selectedCategory.toLowerCase());
          });
        }

        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          fallbackItems = fallbackItems.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              String(p.category).toLowerCase().includes(q)
          );
        }

        if (inStockOnly) {
          fallbackItems = fallbackItems.filter((p) => p.inStock !== false);
        }

        if (sortBy === 'price_low') {
          fallbackItems = [...fallbackItems].sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price_high') {
          fallbackItems = [...fallbackItems].sort((a, b) => b.price - a.price);
        } else if (sortBy === 'newest') {
          fallbackItems = [...fallbackItems].reverse();
        }

        setTotalCount(fallbackItems.length);
        setTotalPages(Math.max(1, Math.ceil(fallbackItems.length / PAGE_SIZE)));
        const startIndex = (targetPage - 1) * PAGE_SIZE;
        setProducts(fallbackItems.slice(startIndex, startIndex + PAGE_SIZE));
      }
      setCategories(STORE_CATEGORIES);
    } catch (err) {
      console.error('Failed to load products:', err);
      // Fallback seed products on network failure
      let fallbackItems = DEFAULT_STORE_PRODUCTS;
      if (selectedCategory !== 'All') {
        fallbackItems = fallbackItems.filter((p) => String(p.category).toLowerCase().includes(selectedCategory.toLowerCase()));
      }
      if (inStockOnly) {
        fallbackItems = fallbackItems.filter((p) => p.inStock !== false);
      }
      if (sortBy === 'price_low') {
        fallbackItems = [...fallbackItems].sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price_high') {
        fallbackItems = [...fallbackItems].sort((a, b) => b.price - a.price);
      }
      setTotalCount(fallbackItems.length);
      setTotalPages(Math.max(1, Math.ceil(fallbackItems.length / PAGE_SIZE)));
      const startIndex = (targetPage - 1) * PAGE_SIZE;
      setProducts(fallbackItems.slice(startIndex, startIndex + PAGE_SIZE));
      setCategories(STORE_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchProducts(1);
  }, [selectedCategory, sortBy, inStockOnly]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    fetchProducts(value);
    const catalogEl = document.getElementById('products-catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts(1);
  };

  return (
    <Box sx={{ py: 6, minHeight: '80vh' }}>
      <Container maxWidth="lg">
        {/* Banner */}
        <Box
          sx={{
            p: { xs: 4, md: 6 },
            mb: 5,
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.15) 0%, rgba(224, 93, 0, 0.08) 100%)',
            border: '1px solid rgba(255, 107, 0, 0.2)',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Chip
            icon={<LocalOfferIcon sx={{ fontSize: 16, color: '#FF6B00 !important' }} />}
            label={t('shop.marketplaceChip', "Kim's Store Marketplace")}
            size="small"
            sx={{ mb: 2, fontWeight: 700, bgcolor: 'rgba(255, 107, 0, 0.15)', color: '#FF6B00', border: '1px solid #FF6B00' }}
          />
          <Typography variant="h3" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, fontWeight: 800, mb: 2 }}>
            {t('shop.heroTitle', 'Trending Fashion, Footwear, Beauty & Everyday Essentials')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto', mb: 4 }}>
            {t('shop.heroSubtitle', 'Discover high-quality apparel, sneakers, cosmetics glow kits, electronics, fresh produce, and dorm snacks delivered fast.')}
          </Typography>

          {/* Search bar */}
          <Box component="form" onSubmit={handleSearchSubmit} sx={{ maxWidth: 540, mx: 'auto' }}>
            <TextField
              fullWidth
              placeholder={t('shop.searchPlaceholder', 'Search fashion, sneakers, skincare, electronics, snacks...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#FF6B00' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button variant="contained" type="submit" sx={{ borderRadius: 2, bgcolor: '#FF6B00', '&:hover': { bgcolor: '#E05D00' } }}>
                        {t('shop.searchBtn', 'Search')}
                      </Button>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 3, bgcolor: 'background.paper' }
                }
              }}
            />
          </Box>
        </Box>

        {/* Category Filter Pills */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 4, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}
        >
          {(categories.length > 0 ? categories : STORE_CATEGORIES).map((cat) => (
            <Chip
              key={cat}
              label={getLocalizedCategoryName(cat)}
              clickable
              onClick={() => setSelectedCategory(cat)}
              sx={{
                fontWeight: 700,
                py: 2.2,
                px: 1.5,
                borderRadius: 2,
                bgcolor: selectedCategory === cat ? '#FF6B00' : 'background.paper',
                color: selectedCategory === cat ? '#FFFFFF' : 'text.primary',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#FF6B00' : 'rgba(255, 107, 0, 0.2)',
                '&:hover': {
                  bgcolor: selectedCategory === cat ? '#E05D00' : 'rgba(255, 107, 0, 0.1)',
                },
              }}
            />
          ))}
        </Stack>

        {/* Sorting & Filter Bar */}
        <Box
          id="products-catalog-section"
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            mb: 3,
            px: 0.5,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            {totalCount > 0 ? `${totalCount} ${t('shop.productsFound', 'products available')}` : `${products.length} ${t('shop.productsFound', 'products available')}`}
          </Typography>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', width: { xs: '100%', sm: 'auto' }, flexWrap: 'wrap' }}>
            <Chip
              label={t('shop.inStockOnly', 'In Stock Only')}
              clickable
              color={inStockOnly ? 'primary' : 'default'}
              variant={inStockOnly ? 'filled' : 'outlined'}
              onClick={() => setInStockOnly((prev) => !prev)}
              sx={{
                fontWeight: 600,
                height: 36,
                borderColor: inStockOnly ? '#FF6B00' : 'rgba(255, 107, 0, 0.3)',
                bgcolor: inStockOnly ? '#FF6B00' : 'background.paper',
                color: inStockOnly ? '#FFFFFF' : 'text.primary',
              }}
            />

            <FormControl size="small" sx={{ minWidth: 180, flex: { xs: 1, sm: 'none' } }}>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                displayEmpty
                sx={{
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  height: 36,
                }}
              >
                <MenuItem value="featured">{t('shop.sortFeatured', 'Featured Items')}</MenuItem>
                <MenuItem value="price_low">{t('shop.sortPriceLow', 'Price: Low to High')}</MenuItem>
                <MenuItem value="price_high">{t('shop.sortPriceHigh', 'Price: High to Low')}</MenuItem>
                <MenuItem value="newest">{t('shop.sortNewest', 'Newest Arrivals')}</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>

        {/* Product Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              {t('shop.noProducts', 'No products found matching your search.')}
            </Typography>
            <Button sx={{ mt: 2 }} onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}>
              {t('shop.resetFilters', 'Reset Filters')}
            </Button>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 3
              }}
            >
              {products.map((product) => {
                const localized = getLocalizedProduct(product);
                const catRaw = typeof product.category === 'object' && product.category !== null ? (product.category as any).name : String(product.category || 'Groceries');
                const localizedCategory = getLocalizedCategoryName(catRaw);

                return (
                  <Card
                    key={product._id}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.images?.[0] || getCategoryFallbackImage(catRaw)}
                        alt={localized.title}
                        sx={{ objectFit: 'cover' }}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getCategoryFallbackImage(catRaw);
                        }}
                      />
                      <Chip
                        label={localizedCategory}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          bgcolor: 'rgba(0,0,0,0.6)',
                          color: '#fff',
                          backdropFilter: 'blur(4px)',
                          fontSize: '0.75rem'
                        }}
                      />
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <Chip
                          label={t('shop.sale', 'SALE')}
                          size="small"
                          color="error"
                          sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 700 }}
                        />
                      )}
                    </Box>

                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        variant="h6"
                        onClick={() => navigate(`/shop/product/${product.slug || product._id}`)}
                        sx={{ fontWeight: 700, mb: 1, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                      >
                        {localized.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          flexGrow: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {localized.description}
                      </Typography>

                      <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 2 }}>
                        <Rating value={4.8} precision={0.5} size="small" readOnly />
                        <Typography variant="caption" color="text.secondary">
                          (4.8)
                        </Typography>
                      </Stack>

                      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                        <Box>
                          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
                            XAF {product.price.toLocaleString()}
                          </Typography>
                          {product.compareAtPrice && (
                            <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                              XAF {product.compareAtPrice.toLocaleString()}
                            </Typography>
                          )}
                        </Box>

                        <Stack direction="row" spacing={1}>
                          <Tooltip title={t('shop.quickView', 'Quick View')}>
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/shop/product/${product.slug || product._id}`)}
                              sx={{ border: '1px solid rgba(255, 255, 255, 0.12)' }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<AddShoppingCartIcon />}
                            onClick={() => addToCart(product)}
                            sx={{ borderRadius: 2, px: 2, fontWeight: 600 }}
                          >
                            {t('shop.add', 'Add')}
                          </Button>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>

            {/* Pagination Bar */}
            {totalPages > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mt: 6,
                  mb: 2,
                  gap: 1.5,
                }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontWeight: 700,
                      borderRadius: 2,
                    },
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {t('shop.pageIndicator', 'Page {{page}} of {{totalPages}} ({{total}} products)', {
                    page,
                    totalPages,
                    total: totalCount || products.length,
                  })}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};
