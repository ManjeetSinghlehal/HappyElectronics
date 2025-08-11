"use server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";

export default async function getUser(email) {
  await connectDB();

  const user = await User.findOne({ email }).lean();

  if (!user) return null;

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    imageUrl: user.imageUrl || null,
    isVerified: user.isVerified,
    providers: user.providers,
    id: user.id,
    role: user.role || ''
  };
}
