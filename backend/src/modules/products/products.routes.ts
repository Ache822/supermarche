import { Router } from "express";
import {
  getCategoriesHandler,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
  getProductsHandler,
  getProductByIdHandler,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
  batchToggleVisibilityHandler,
  uploadProductImageHandler
} from "./products.controller";

export const productsRouter = Router();

// Category Routes
productsRouter.get("/categories", getCategoriesHandler);
productsRouter.post("/categories", createCategoryHandler);
productsRouter.patch("/categories/:id", updateCategoryHandler);
productsRouter.put("/categories/:id", updateCategoryHandler);
productsRouter.delete("/categories/:id", deleteCategoryHandler);

// Product Store Routes
productsRouter.get("/", getProductsHandler);
productsRouter.get("/:id", getProductByIdHandler);
productsRouter.post("/", createProductHandler);
productsRouter.patch("/:id", updateProductHandler);
productsRouter.put("/:id", updateProductHandler);
productsRouter.delete("/:id", deleteProductHandler);

// Batch & Image Upload Routes
productsRouter.patch("/batch-visibility", batchToggleVisibilityHandler);
productsRouter.post("/batch-visibility", batchToggleVisibilityHandler);
productsRouter.post("/upload-image", uploadProductImageHandler);

// Export servicesRouter alias for backward compatibility
export const servicesRouter = productsRouter;
