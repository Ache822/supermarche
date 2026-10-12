import mongoose from "mongoose";
import { Category, Product } from "../modules/products/products.model";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://mongodb:27017/supermarche";

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB for product category normalization...");

  const categories = await Category.find();
  const catMap: Record<string, mongoose.Types.ObjectId> = {};

  for (const cat of categories) {
    catMap[cat.name.toLowerCase().trim()] = cat._id as mongoose.Types.ObjectId;
    catMap[cat.slug.toLowerCase().trim()] = cat._id as mongoose.Types.ObjectId;
  }

  const rawProducts = await mongoose.connection.collection("products").find().toArray();
  let updatedCount = 0;

  for (const prod of rawProducts) {
    if (typeof prod.category === "string") {
      const key = prod.category.toLowerCase().trim();
      const matchedCatId = catMap[key];
      if (matchedCatId) {
        await mongoose.connection.collection("products").updateOne(
          { _id: prod._id },
          {
            $set: {
              category: matchedCatId,
              categoryName: prod.category
            }
          }
        );
        updatedCount++;
      }
    }
  }

  console.log(`Successfully normalized ${updatedCount} products to Category ObjectIds!`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Normalization error:", err);
  process.exit(1);
});
