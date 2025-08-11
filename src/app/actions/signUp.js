"use server";

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "@/models/User";
import generateId from "./generateId";

export default async function signUp(formData) {
  await mongoose.connect(process.env.MONGODB_URI);

  const name = formData.get("name")?.trim();
  const email = formData.get("email")?.trim().toLowerCase();
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const phone = formData.get("phone")?.trim();

  const nameRegex = /^[A-Za-z\s]{2,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  const phoneRegex = /^\d{10}$/;

  if (!name || !nameRegex.test(name)) {
    return { success: false, message: "Invalid name. Only letters and spaces allowed (2–50 characters)." };
  }

  if (!email || !emailRegex.test(email)) {
    return { success: false, message: "Invalid email format." };
  }

  if (!password || !passwordRegex.test(password)) {
    return {
      success: false,
      message: "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.",
    };
  }

  if (password !== confirmPassword) {
    return { success: false, message: "Passwords do not match." };
  }

  if (phone && !phoneRegex.test(phone)) {
    return { success: false, message: "Phone number must be 10 digits." };
  }

  const existingUser = await User.findOne({ email });
  const providerId = await generateId();
  const hashedPassword = await bcrypt.hash(password, 10);

  if (!existingUser) {
    const newUser = new User({
      id: providerId,
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
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
