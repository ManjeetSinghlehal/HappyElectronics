"use server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

export async function manageUsers(action, data) {
  await connectDB();

  try {
    if (action === "verify") {
      const updated = await User.findByIdAndUpdate(
        data.id,
        { isVerified: true },
        { new: true }
      );
      if (!updated) throw new Error("User not found");
      revalidatePath("/admin/users");
      return { success: true };
    }

    if (action === "delete") {
      await User.findByIdAndDelete(data.id);
      revalidatePath("/admin/users");
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
