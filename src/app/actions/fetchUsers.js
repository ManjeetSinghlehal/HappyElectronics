"use server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";

export default async function fetchUsers() {
  await connectDB();
  const users = await User.find().sort({ name: 1 });

  return users.map((user) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
    role: user?.role || ''
  }));
}
