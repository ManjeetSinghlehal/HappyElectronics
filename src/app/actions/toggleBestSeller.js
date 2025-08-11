"use server";

import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export default async function toggleBestSeller(productId, currentStatus) {
  await connectDB();

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { isBestSeller: !currentStatus },
      { new: true }
    );

    return {
      success: true,
      isBestSeller: updatedProduct.isBestSeller,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to update best seller status.",
    };
  }
}
