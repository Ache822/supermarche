import { Request, Response, NextFunction } from "express";
import { OrderModel } from "./orders.model";
import { ProductModel } from "../products/products.model";
import { z } from "zod";

const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email required"),
    phone: z.string().min(5, "Valid phone number required")
  }),
  shippingAddress: z.object({
    street: z.string().min(3, "Street address required"),
    city: z.string().min(2, "City required"),
    state: z.string().optional(),
    postalCode: z.string().min(2, "Postal code required"),
    country: z.string().default("United States")
  }),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
        selectedAttributes: z.record(z.string()).optional()
      })
    )
    .min(1, "Order must contain at least one item"),
  paymentMethod: z.enum(["cash_on_delivery", "card", "bank_transfer", "manual"]).default("cash_on_delivery"),
  notes: z.string().optional()
});

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createOrderSchema.parse(req.body);

    let subtotal = 0;
    const orderItems = [];

    // Verify stock and compute pricing directly from DB for security
    for (const item of validatedData.items) {
      const product = await ProductModel.findById(item.productId);
      if (!product || product.isLive === false) {
        return res.status(404).json({
          success: false,
          message: `Product not found or unavailable`
        });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product '${product.title}'. Only ${product.stockQuantity} remaining.`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        image: product.images?.[0] || "",
        selectedAttributes: item.selectedAttributes
      });

      // Deduct stock quantity
      product.stockQuantity -= item.quantity;
      if (product.stockQuantity <= 0) {
        product.inStock = false;
      }
      await product.save();
    }

    const shippingFee = subtotal >= 25000 ? 0 : 1500; // Free courier dispatch over 25,000 XAF
    const totalAmount = Math.round(subtotal + shippingFee);

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const order = await OrderModel.create({
      orderNumber,
      customer: validatedData.customer,
      shippingAddress: validatedData.shippingAddress,
      items: orderItems,
      subtotal: Number(subtotal.toFixed(2)),
      shippingFee,
      discount: 0,
      totalAmount,
      paymentMethod: validatedData.paymentMethod,
      paymentStatus: validatedData.paymentMethod === "cash_on_delivery" ? "pending" : "paid",
      orderStatus: "pending",
      notes: validatedData.notes
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const trackOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identifier } = req.params;

    const order = await OrderModel.findOne({
      $or: [{ orderNumber: identifier.toUpperCase() }, { _id: identifier.match(/^[0-9a-fA-F]{24}$/) ? identifier : null }]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getAdminOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query: any = {};
    if (status) {
      query.orderStatus = status;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      OrderModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      OrderModel.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus, trackingNumber } = req.body;

    const update: any = {};
    if (orderStatus) update.orderStatus = orderStatus;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) update.trackingNumber = trackingNumber;

    const order = await OrderModel.findByIdAndUpdate(id, update, { new: true });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order status updated successfully", data: order });
  } catch (error) {
    next(error);
  }
};
