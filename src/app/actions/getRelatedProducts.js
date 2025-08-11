"use server";

import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export default async function getRelatedProducts(categoryName, currentProductId) {
  await connectDB();

  const products = await Product.find()
    .populate("categoryId", "name")
    .sort({ createdAt: -1 });

  return products
    .filter(
      (p) =>
        p.categoryId?.name === categoryName && p._id.toString() !== currentProductId
    )
    .map((product) => {
      const reviews = product.reviews || [];
      const averageRating =
        reviews.length > 0
          ? Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
          : 0;

      return {
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrls[0],
        averageRating,
        reviewCount: reviews.length,
      };
    });
}
