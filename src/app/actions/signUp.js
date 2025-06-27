"use server";

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "@/models/User";
import generateId from "./generateId";

export default async function signUp(formData) {
  await mongoose.connect(process.env.MONGODB_URI);

  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  const existingUser = await User.findOne({ email });

  const providerId = await generateId();
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  if (!existingUser) {
    const newUser = new User({
      id: providerId,
      name,
      email,
      password: hashedPassword,
      imageUrl: "",
      isVerified: false,
      providers: [{
        name: "happyelectronics",
        userId: providerId,
      }],
    });

    await newUser.save();
    return { success: true, message: "Account created. Awaiting admin approval." };
  } else {
    const hasCustomProvider = existingUser.providers.some(p => p.name === "happyelectronics");

    if (!hasCustomProvider) {
      existingUser.providers.push({
        name: "happyelectronics",
        userId: providerId,
      });

      await existingUser.save();
      return { success: true, message: "Custom provider added to existing account." };
    } else {
      return { success: false, message: "Account already exists. Please log in." };
    }
  }
}
