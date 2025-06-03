import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET() {
  await connectDB();

  // Step 1: Predefined categories
  const categoryNames = ["iOS", "Android", "Laptops", "Headphones"];

  // Step 2: Ensure categories exist or create them
  const categories = {};
  for (const name of categoryNames) {
    let category = await Category.findOne({ name });
    if (!category) {
      category = await Category.create({ name });
    }
    categories[name] = category._id;
  }

  // Step 3: Products to insert
  const products = [
    {
      name: "iPhone 15 Pro",
      stock: 20,
      price: 1299,
      imageUrl: "/images/15-pro.png",
      description: "Apple's latest iPhone with powerful performance.",
      categoryId: categories["iOS"],
      isBestSeller: true,
    },
    {
      name: "Samsung Galaxy S24",
      stock: 15,
      price: 1099,
      imageUrl: "/images/s-24.png",
      description: "Samsung’s flagship Android smartphone.",
      categoryId: categories["Android"],
      isBestSeller: true,
    },
    {
      name: "MacBook Pro M3",
      stock: 8,
      price: 2399,
      imageUrl: "/images/pro-m3.png",
      description: "Powerful Apple laptop with M3 chip.",
      categoryId: categories["Laptops"],
      isBestSeller: true,
    },
  ];

  // Step 4: Save products to DB
  const savedProducts = [];
  for (const product of products) {
    const existing = await Product.findOne({ name: product.name });
    if (!existing) {
      const created = await Product.create(product);
      savedProducts.push(created);
    }
  }

  return Response.json({
    message: "Categories and products seeded successfully.",
    products: savedProducts.map((p) => ({
      id: p._id,
      name: p.name,
      category: p.categoryId,
    })),
  });
}
