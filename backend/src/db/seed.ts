import "dotenv/config";
import dns from "dns";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore fallback error
}

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "../config/env";
import { User } from "../modules/users/users.model";
import { Category, ProductModel } from "../modules/products/products.model";
import { Faq } from "../modules/faqs/faqs.model";
import { Testimonial } from "../modules/testimonials/testimonials.model";

const seedAtlasDatabase = async () => {
  try {
    console.log("Connecting to MongoDB Atlas Cluster...");
    await mongoose.connect(config.mongodbUri);
    console.log("Connected successfully to MongoDB Atlas!");

    // 1. Seed Initial Super Admin User
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (!existingAdmin) {
      const password_hash = await bcrypt.hash("SuperAdminPass123!", 12);
      await User.create({
        authId: "usr_superadmin_001",
        email: "admin@example.com",
        password_hash,
        fullName: "Root Super Admin",
        access: "SUPER_ADMIN",
        permissions: ["*"],
        is_active: true
      });
      console.log("✅ Created Root Super Admin user: admin@example.com / SuperAdminPass123!");
    } else {
      console.log("ℹ️ Root Super Admin user already exists.");
    }

    // 2. Seed Default Product Categories
    const apparelHub = await Category.findOneAndUpdate(
      { slug: "apparel-fashion" },
      {
        name: "Apparel & Fashion",
        slug: "apparel-fashion",
        description: "Trendsetting apparel, streetwear hoodies, t-shirts, and stylish outfits.",
        iconName: "ShoppingBag",
        display_order: 1,
        parent: null
      },
      { upsert: true, new: true }
    );

    const footwearHub = await Category.findOneAndUpdate(
      { slug: "footwear-shoes" },
      {
        name: "Footwear & Shoes",
        slug: "footwear-shoes",
        description: "High-top sneakers, breathable running shoes, and trendy footwear.",
        iconName: "ShoppingBag",
        display_order: 2,
        parent: null
      },
      { upsert: true, new: true }
    );

    const cosmeticsHub = await Category.findOneAndUpdate(
      { slug: "cosmetics-beauty" },
      {
        name: "Cosmetics & Beauty",
        slug: "cosmetics-beauty",
        description: "Skincare serums, sunscreen lotions, and everyday beauty products.",
        iconName: "Heart",
        display_order: 3,
        parent: null
      },
      { upsert: true, new: true }
    );

    const electronicsHub = await Category.findOneAndUpdate(
      { slug: "electronics-tech" },
      {
        name: "Electronics & Tech",
        slug: "electronics-tech",
        description: "ANC wireless earbuds, high-capacity power banks, and gadgets.",
        iconName: "Smartphone",
        display_order: 4,
        parent: null
      },
      { upsert: true, new: true }
    );

    const produceHub = await Category.findOneAndUpdate(
      { slug: "fresh-produce-snacks" },
      {
        name: "Fresh Produce & Snacks",
        slug: "fresh-produce-snacks",
        description: "Fresh organic fruits, premium snacks, and beverages.",
        iconName: "Coffee",
        display_order: 5,
        parent: null
      },
      { upsert: true, new: true }
    );

    console.log("✅ Seeded default Product Categories.");

    // 3. Seed Sample Store Products
    const sampleProducts = [
      {
        id: "prod-hoodie-01",
        title: "Oversized Vintage Graphic Hoodie",
        slug: "oversized-vintage-graphic-hoodie",
        category: apparelHub._id,
        price: 18500,
        compareAtPrice: 22000,
        description: "Heavyweight premium cotton oversized hoodie with vintage graphic print. Ultra-comfortable for everyday wear.",
        shortDescription: "Heavyweight cotton oversized hoodie with vintage print.",
        stockQuantity: 45,
        inStock: true,
        isLive: true,
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"]
      },
      {
        id: "prod-sneakers-01",
        title: "Retro High-Top Campus Kicks",
        slug: "retro-high-top-campus-kicks",
        category: footwearHub._id,
        price: 28000,
        compareAtPrice: 35000,
        description: "Classic high-top retro basketball sneakers with cushioned insoles and durable rubber outsole.",
        shortDescription: "Classic high-top retro sneakers with cushioned insoles.",
        stockQuantity: 30,
        inStock: true,
        isLive: true,
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"]
      },
      {
        id: "prod-serum-01",
        title: "Hydrating Glow Vitamin C Face Serum",
        slug: "hydrating-glow-vitamin-c-serum",
        category: cosmeticsHub._id,
        price: 6500,
        compareAtPrice: 8500,
        description: "Nourishing facial serum infused with Hyaluronic Acid and Vitamin C for glowing skin.",
        shortDescription: "Nourishing facial serum for bright, hydrated skin.",
        stockQuantity: 50,
        inStock: true,
        isLive: true,
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"]
      },
      {
        id: "prod-earbuds-01",
        title: "Pro ANC Wireless Bluetooth Earbuds",
        slug: "pro-anc-wireless-bluetooth-earbuds",
        category: electronicsHub._id,
        price: 19500,
        compareAtPrice: 24500,
        description: "Active Noise-Canceling wireless earbuds with 30-hour total battery life and HD audio.",
        shortDescription: "ANC wireless earbuds with 30h battery and HD audio.",
        stockQuantity: 35,
        inStock: true,
        isLive: true,
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"]
      },
      {
        id: "prod-fruit-basket-01",
        title: "Organic Fresh Fruit & Crunch Snack Pack",
        slug: "organic-fresh-fruit-crunch-snack-pack",
        category: produceHub._id,
        price: 4500,
        compareAtPrice: 5500,
        description: "Handpicked fresh organic apples, bananas, and roasted cashew snack pack.",
        shortDescription: "Handpicked fresh organic fruits and roasted cashew snack.",
        stockQuantity: 60,
        inStock: true,
        isLive: true,
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80"]
      }
    ];

    for (const prod of sampleProducts) {
      await ProductModel.findOneAndUpdate(
        { id: prod.id },
        prod,
        { upsert: true }
      );
    }
    console.log("✅ Seeded sample E-Commerce Products.");

    // 4. Seed Default FAQs
    const defaultFaqs = [
      {
        question: "How fast is delivery in Douala & Yaoundé?",
        answer: "Our express delivery runners deliver your grocery and cooking gas orders directly to your door in under 45 minutes.",
        category: "Delivery",
        display_order: 1,
        is_published: true,
        is_featured: true
      },
      {
        question: "What payment methods are supported?",
        answer: "We support Mobile Money (MTN MoMo & Orange Money), Cash on Delivery, and direct card payments.",
        category: "Payments",
        display_order: 2,
        is_published: true,
        is_featured: true
      },
      {
        question: "Can I track my order live?",
        answer: "Yes, once your order is confirmed, you can track your delivery runner live on the interactive order map.",
        category: "Orders",
        display_order: 3,
        is_published: true,
        is_featured: true
      }
    ];

    for (const faq of defaultFaqs) {
      await Faq.findOneAndUpdate(
        { question: faq.question },
        faq,
        { upsert: true }
      );
    }
    console.log("✅ Seeded default FAQs.");

    // 5. Seed Featured Testimonials
    const defaultTestimonials = [
      {
        authorName: "Madame Marie-Noëlle Ebogo",
        authorRole: "Bastos, Yaoundé • Supermarche Shopper",
        rating: 5,
        content: "Supermarche delivered my fresh grocery market basket and gas cylinder in less than 30 minutes! Outstanding app!",
        serviceUsed: "Express Grocery & Gas Delivery",
        consentToPublish: true,
        status: "APPROVED",
        isFeatured: true
      },
      {
        authorName: "Grace Enow",
        authorRole: "Molyko, Buea • Student Shopper",
        rating: 5,
        content: "Super fast delivery service for my weekly groceries in Molyko! Loved tracking the delivery live on the map.",
        serviceUsed: "Weekly Market Shopping",
        consentToPublish: true,
        status: "APPROVED",
        isFeatured: true
      }
    ];

    for (const testimonial of defaultTestimonials) {
      await Testimonial.findOneAndUpdate(
        { authorName: testimonial.authorName },
        testimonial,
        { upsert: true }
      );
    }
    console.log("✅ Seeded default Testimonials.");

    console.log("🎉 Database seeding completed successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  }
};

seedAtlasDatabase();
