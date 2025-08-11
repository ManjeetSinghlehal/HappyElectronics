"use server";

import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { revalidatePath } from "next/cache";

export async function manageCategories(action, data) {
  await connectDB();

  try {
    if (action === "create") {
      const newCat = await Category.create(data);
      return {
        success: true,
        category: {
          id: newCat._id.toString(),
          name: newCat.name,
        },
      };
    }

    if (action === "update") {
      const updated = await Category.findByIdAndUpdate(data.id, { name: data.name }, {
        new: true,
        runValidators: true,
      });
      if (!updated) throw new Error("Category not found");
      revalidatePath("/admin/categories");
      return {
        success: true,
        category: {
          id: updated._id.toString(),
          name: updated.name,
        },
      };
    }

    if (action === "delete") {
      await Category.findByIdAndDelete(data.id);
      revalidatePath("/admin/categories");
      return { success: true };
    }

    throw new Error("Invalid action");
  } catch (err) {
    return {
      success: false,
      error: err.errors?.[Object.keys(err.errors)[0]]?.message || err.message,
    };
  }
}
