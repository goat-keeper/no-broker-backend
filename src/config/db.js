import mongoose from "mongoose";
import { ENV } from "./env.js";

export async function connectDatabase() {
  if (!ENV.MONGO_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  await mongoose.connect(ENV.MONGO_URI);
  console.log("MongoDB connected");
}