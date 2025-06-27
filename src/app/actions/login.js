"use server";

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "@/models/User";

export default async function login(email, password) {
  await mongoose.connect(process.env.MONGODB_URI);

  const user = await User.findOne({ email });

  if (!user) {
    return "Email not found!";
  }

  const provider = user.providers.find(p => p.name === "happyelectronics");
  if (!provider) {
    return "No account found with this login method. Please sign up.";
  }

  if (!user.isVerified) {
    return "Your account is not verified. Please wait for admin approval.";
  }

  // Only check password if you're using password login
  if (!user.password) {
    return "Password login is not supported for this account.";
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return "Invalid password!";
  }
  console.log(user);
  

  return { success: true, message: "Logged in successfully", user };
}
