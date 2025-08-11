"use server";

import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";

export default async function getProductById(productId) {
  await connectDB();

  const product = await Product.findById(productId)
    .populate("categoryId")
    .populate("reviews.userId", "name") // Get reviewer's name
    .lean();

  if (!product) return null;

  return {
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    imageUrls: product.imageUrls,
    category: product.categoryId?.name || "Unknown",
    reviews: (product.reviews || []).map((review) => ({
      userName: review.userId?.name || "Anonymous",
      rating: review.rating,
      message: review.message || "",
    })),
  };
}
