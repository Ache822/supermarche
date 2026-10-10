import { Router } from "express";
import { createOrder, trackOrder, getAdminOrders, updateOrderStatus } from "./orders.controller";

export const ordersRouter = Router();

// Storefront public order routes
ordersRouter.post("/", createOrder);
ordersRouter.get("/track/:identifier", trackOrder);

// Admin order routes
ordersRouter.get("/admin/list", getAdminOrders);
ordersRouter.patch("/admin/:id/status", updateOrderStatus);
