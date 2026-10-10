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
    const groceriesHub = await Category.findOneAndUpdate(
      { slug: "groceries-fresh-produce" },
      {
        name: "Fresh Groceries & Produce",
        slug: "groceries-fresh-produce",
        description: "Fresh vegetables, fruits, meats, and daily market produce.",
        iconName: "ShoppingBag",
        display_order: 1,
        parent: null
      },
      { upsert: true, new: true }
    );

    const householdHub = await Category.findOneAndUpdate(
      { slug: "household-essentials" },
      {
        name: "Household Essentials & Gas",
        slug: "household-essentials",
        description: "Cooking gas cylinders, cleaning supplies, and everyday home items.",
        iconName: "Home",
        display_order: 2,
        parent: null
      },
      { upsert: true, new: true }
    );

    const beveragesHub = await Category.findOneAndUpdate(
      { slug: "beverages-drinks" },
      {
        name: "Beverages & Drinks",
        slug: "beverages-drinks",
        description: "Juices, mineral water, soft drinks, and specialty beverages.",
        iconName: "Coffee",
        display_order: 3,
        parent: null
      },
      { upsert: true, new: true }
    );

    console.log("✅ Seeded default Product Categories.");

    // 3. Seed Sample Store Products
    const sampleProducts = [
      {
        id: "prod-sctm-cooking-gas-12kg",
        title: "SCTM Cooking Gas Cylinder 12.5kg (Full Refill & Delivery)",
        slug: "sctm-cooking-gas-12kg",
        category: householdHub._id,
        price: 6500,
        compareAtPrice: 7000,
        description: "Standard 12.5kg cooking gas cylinder refill delivered directly to your kitchen with complimentary leak and valve test.",
        shortDescription: "12.5kg cooking gas cylinder refill with free safety check.",
        stockQuantity: 50,
        inStock: true,
        isLive: true,
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80"]
      },
      {
        id: "prod-fresh-tomato-basket-5kg",
        title: "Fresh Tomato Basket (5kg Organic Farm Produce)",
        slug: "fresh-tomato-basket-5kg",
        category: groceriesHub._id,
        price: 3500,
        compareAtPrice: 4000,
        description: "Organically grown fresh red ripe tomatoes harvested directly from local farms and packaged cleanly.",
        shortDescription: "5kg fresh organic red tomatoes.",
        stockQuantity: 100,
        inStock: true,
        isLive: true,
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80"]
      },
      {
        id: "prod-mineral-water-pack-1-5l",
        title: "Natural Spring Mineral Water Pack (6 x 1.5L)",
        slug: "mineral-water-pack-1-5l",
        category: beveragesHub._id,
        price: 2400,
        compareAtPrice: 2700,
        description: "Pure natural spring mineral water 6-bottle pack for healthy family daily hydration.",
        shortDescription: "6 x 1.5L natural spring mineral water.",
        stockQuantity: 200,
        inStock: true,
        isLive: true,
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1560023907-5f31b61785db?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1560023907-5f31b61785db?auto=format&fit=crop&w=800&q=80"]
      },
      {
        id: "prod-jasmin-rice-5kg",
        title: "Supermarche Premium Jasmin Rice (5kg Bag)",
        slug: "jasmin-rice-5kg",
        category: groceriesHub._id,
        price: 4800,
        compareAtPrice: 5200,
        description: "Long-grain fragrant jasmine rice, triple-cleaned and perfect for jollof, fried rice, and daily meals.",
        shortDescription: "5kg premium long-grain fragrant jasmine rice.",
        stockQuantity: 150,
        inStock: true,
        isLive: true,
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80"]
      },
      {
        id: "prod-fresh-eggs-crate-30",
        title: "Fresh Farm Organic Eggs (Crate of 30 Large Eggs)",
        slug: "fresh-eggs-crate-30",
        category: groceriesHub._id,
        price: 2200,
        compareAtPrice: 2500,
        description: "Grade-A fresh farm eggs harvested daily from free-range hens.",
        shortDescription: "30 large fresh farm organic eggs.",
        stockQuantity: 90,
        inStock: true,
        isLive: true,
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80"]
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
