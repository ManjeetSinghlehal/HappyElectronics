'use server';

import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart"; 
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import User from "@/models/User";

export async function updateCartQuantity(productid, quantity) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return;

  const email = session.user.email;

  const user = await User.findOne({ email });
  const userId = user._id.toString();
  const cart = await Cart.findOne({ userId });
  if (!cart) return;

  const item = cart.products.find((p) => p.productid.equals(productid));
  if (item) {
    item.quantity = Math.max(1, quantity); // Prevent quantity below 1
    await cart.save();
  }
}


export async function getCart() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return [];

  const email = session.user.email;
  const user = await User.findOne({ email });
  const userId = user?._id?.toString();
  const cart = await Cart.findOne({ userId }).populate("products.productid");

  if (!cart) return [];

  return cart.products.map((item) => ({
    id: item.productid._id.toString(),
    name: item.productid.name,
    price: item.productid.price,
    imageUrl: item.productid.imageUrls[0],
    quantity: item.quantity,
  }));
}

export async function addToCart(productid, quantity = 1) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return;

  const email = session.user.email;

  const user = await User.findOne({ email });
  const userId = user._id.toString();
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      products: [{ productid, quantity }],
    });
  } else {
    const existing = cart.products.find((p) => p.productid.equals(productid));
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.products.push({ productid, quantity });
    }
    await cart.save();
  }
}

export async function removeFromCart(productid) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return;

  const email = session.user.email;

  const user = await User.findOne({ email });
  const userId = user._id.toString();
  const cart = await Cart.findOne({ userId });
  if (!cart) return;

  cart.products = cart.products.filter((p) => !p.productid.equals(productid));
  await cart.save();
}
