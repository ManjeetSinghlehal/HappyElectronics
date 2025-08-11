"use server";

import { connectDB } from "@/lib/db";
import Category from "@/models/Category";

export default async function fetchCategories() {
  await connectDB();
  const categories = await Category.find().sort({ name: 1 });
  return categories.map((cat) => ({
    id: cat._id.toString(),
    name: cat.name,
  }));
}
