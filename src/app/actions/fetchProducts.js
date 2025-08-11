"use server";

import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export default async function fetchProducts() {
  await connectDB();

  const products = await Product.find()
    .populate("categoryId", "name")
    .sort({ createdAt: -1 });

  return products.map((product) => ({
    id: product._id.toString(),
    name: product.name,
    price: product.price,
    stock: product.stock,
    imageUrl: product.imageUrls,
    description: product.description,
    category: product.categoryId?.name || null,
    isBestSeller: product.isBestSeller,
    reviews:
      product.reviews?.map((review) => ({
        userId: review.userId?.toString(),
        rating: review.rating,
        message: review.message,
      })) || [],
    createdAt: product.createdAt,
  }));
}
