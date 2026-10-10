import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { config } from "./config/env";
import { connectDatabase } from "./config/database";
import { authRouter } from "./modules/auth/auth.routes";
import { pagesRouter } from "./modules/pages/pages.routes";
import { supportRouter } from "./modules/support/support.routes";
import { faqsRouter } from "./modules/faqs/faqs.routes";
import { articlesRouter } from "./modules/articles/articles.routes";
import { campaignsRouter } from "./modules/campaigns/campaigns.routes";
import { accessRouter } from "./modules/access/access.routes";
import { productsRouter } from "./modules/products/products.routes";
import { seedProductsIfEmpty } from "./modules/products/products.controller";
import { ordersRouter } from "./modules/orders/orders.routes";
import { usersRouter } from "./modules/users/users.routes";
import { analyticsRouter } from "./modules/analytics/analytics.routes";
import { testimonialsRouter, adminTestimonialsRouter } from "./modules/testimonials/testimonials.routes";
import { errorHandler } from "./common/middleware/errorHandler";
import { initializeSupportSocketIO } from "./modules/support/support.gateway";
import { apiRateLimiter } from "./common/middleware/rateLimiter";

const app = express();
const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: true,
    credentials: true
  }
});

// Security & Production Middleware
app.use(helmet({ contentSecurityPolicy: false })); // Secure HTTP headers
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(cookieParser());
app.use(mongoSanitize()); // Prevent NoSQL Query Injection attacks ($ / .)
app.use("/api", apiRateLimiter); // General API rate limiter

app.use(express.static(path.join(__dirname, "../public")));

// Serve OpenAPI Specification UI (/api/docs)
try {
  const openapiPath = path.join(__dirname, "../openapi.yaml");
  if (fs.existsSync(openapiPath)) {
    const openapiDocument = yaml.load(fs.readFileSync(openapiPath, "utf8"));
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument as any));
  }
} catch (err) {
  console.warn("Swagger UI initialization notice:", err);
}

// Public & Admin Route Mounts with Full Dual Aliases
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/pages", pagesRouter);

// Support & Live Chat Mounts
app.use("/api/v1/support", supportRouter);
app.use("/api/v1/admin/chat", supportRouter);
app.use("/api/v1/admin/support", supportRouter);

// FAQs & Content Mounts
app.use("/api/v1/faqs", faqsRouter);
app.use("/api/v1/admin/faqs", faqsRouter);

// Articles & Knowledgebase Mounts (including frontend dev's /help/articles contract)
app.use("/api/v1/articles", articlesRouter);
app.use("/api/v1/admin/articles", articlesRouter);
app.use("/api/v1/help/articles", articlesRouter);

// Help Center & Product Category Mounts
app.use("/api/v1/help/categories", productsRouter);

// Campaigns & Newsletter Mounts
app.use("/api/v1/campaigns", campaignsRouter);
app.use("/api/v1/admin/campaigns", campaignsRouter);
app.use("/api/v1/newsletter", campaignsRouter);
app.use("/api/newsletter", campaignsRouter);

// Access & RBAC Mounts
app.use("/api/v1/access", accessRouter);

// E-Commerce Core Product Mounts (renamed from services)
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/admin/products", productsRouter);
app.use("/api/v1/services", productsRouter);
app.use("/api/v1/admin/services", productsRouter);

// Order Management Mounts
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/admin/orders", ordersRouter);

// User & Team Member Management Mounts
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/admin/users", usersRouter);

// Analytics Mounts
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/admin/analytics", analyticsRouter);

// Testimonials & Reviews Moderation Mounts
app.use("/api/v1/testimonials", testimonialsRouter);
app.use("/api/v1/admin/testimonials", adminTestimonialsRouter);

app.use(errorHandler);

initializeSupportSocketIO(io);

const start = async () => {
  httpServer.listen(config.port, () => {
    console.log(`Server listening on http://localhost:${config.port}`);
    console.log(`Socket.IO live support hub active at http://localhost:${config.port}`);
  });

  connectDatabase().then(() => {
    seedProductsIfEmpty();
  }).catch((err) => {
    console.warn("MongoDB connection background warning:", err?.message || err);
  });
};

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
