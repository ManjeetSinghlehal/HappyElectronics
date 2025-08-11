import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export default async function fetchBestSeller() {
  await connectDB();

  const products = await Product.find({ isBestSeller: true })
    .populate("categoryId", "name")
    .sort({ createdAt: -1 });

  return products.map((product) => ({
    id: product._id.toString(),
    name: product.name,
    price: product.price,
    stock: product.stock,
    imageUrl: product.imageUrls[0],
    description: product.description,
    category: product.categoryId?.name || null,
    isBestSeller: product.isBestSeller,
    createdAt: product.createdAt,
  }));
}