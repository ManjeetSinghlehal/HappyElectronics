"use server";

import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";

export async function createProduct(data) {
  const newProduct = await Product.create(data);
revalidatePath("/admin/products");

return {
  success: true,
  product: {
    id: newProduct._id.toString(),
    name: newProduct.name,
    price: newProduct.price,
    stock: newProduct.stock,
    imageUrl: newProduct.imageUrls?.[0],
    description: newProduct.description,
    category: newProduct.categoryId?.toString(),
    isBestSeller: newProduct.isBestSeller,
    createdAt: newProduct.createdAt,
  },
};
}

export async function updateProduct(id, updates) {
  await connectDB();
  try {
    const updated = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("categoryId", "name");

    if (!updated) throw new Error("Product not found");

    const product = {
      id: updated._id.toString(),
      name: updated.name,
      price: updated.price,
      stock: updated.stock,
      imageUrls: updated.imageUrls,
      description: updated.description,
      category: updated.categoryId?.name || null,
      categoryId: updated.categoryId?._id?.toString() || null,
      isBestSeller: updated.isBestSeller,
      isNewest: updated.isNewest,
      createdAt: updated.createdAt,
      reviews: updated.reviews?.map((r) => ({
        userId: r.userId?.toString(),
        rating: r.rating,
        message: r.message,
      })) || [],
    };

    revalidatePath("/admin/products");

    return {
      success: true,
      product,
    };
  } catch (err) {
    return {
      success: false,
      error:
        err.errors?.[Object.keys(err.errors)[0]]?.message || err.message,
    };
  }
}



export async function deleteProduct(id) {
  await connectDB();
  try {
    await Product.findByIdAndDelete(id);
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
