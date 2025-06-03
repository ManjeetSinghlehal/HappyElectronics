"use server";

import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

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
    imageUrl: product.imageUrl,
    description: product.description,
    category: product.categoryId?.name || null,
    isBestSeller: product.isBestSeller,
    createdAt: product.createdAt,
  }));
}
