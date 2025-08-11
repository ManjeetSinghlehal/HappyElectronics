"use server";

import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import mongoose from "mongoose";

export default async function submitReview({ productId, userId, rating, message }) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid ID format.");
  }

  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  // Prevent duplicate review by same user
  if(product.reviews && product.reviews.length > 0) {
    const existing = product.reviews.find((r) => r.userId.toString() === userId);
  if (existing) throw new Error("You have already reviewed this product");
  }

  product.reviews.push({
    userId,
    rating,
    message,
  });

  await product.save();
  return { success: true };
}
