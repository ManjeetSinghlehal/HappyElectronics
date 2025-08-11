// app/actions/checkoutAction.js
'use server';

import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import stripe from "stripe";
import { authOptions } from "../api/auth/[...nextauth]/route";

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

const provinces = [
  "Ontario", "Quebec", "British Columbia", "Alberta",
  "Manitoba", "Saskatchewan", "Nova Scotia",
  "New Brunswick", "Newfoundland and Labrador", "Prince Edward Island"
];

export async function startCheckout(formData) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const { street, province } = Object.fromEntries(formData);

  if (!street || !province || !provinces.includes(province)) {
    throw new Error("Please provide valid address information.");
  }

  return { street, province };
}
