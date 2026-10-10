import dns from "dns";
import mongoose from "mongoose";
import { config } from "./env";

// Fix Windows DNS SRV lookup issues for mongodb+srv://
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore fallback error
}

// Enable Mongoose connection buffering for offline resiliency
mongoose.set("bufferCommands", true);

export const connectDatabase = async (retries = 3, delayMs = 1500): Promise<any> => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection.db;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(config.mongodbUri, {
        serverSelectionTimeoutMS: 8000
      });
      console.log("Connected to MongoDB via Mongoose");
      return mongoose.connection.db;
    } catch (error: any) {
      if (attempt === retries) {
        console.warn(`[MongoDB Warning] Could not connect to MongoDB Atlas on ${config.mongodbUri} (${error?.message || error}). API server is active.`);
        return null;
      }
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
};

export const getDatabase = () => {
  if (!mongoose.connection.db) {
    throw new Error("Database client not initialized");
  }
  return mongoose.connection.db;
};
