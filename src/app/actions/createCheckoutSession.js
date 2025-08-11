"use server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { authOptions } from "../api/auth/[...nextauth]/route";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(address) {
  console.log("h");

  const session = await getServerSession(authOptions);
  console.log(session);

  if (!session?.user?.email) return null;

  await connectDB();

  const user = await User.findOne({ email: session.user.email });
  if (!user) return null;

  const cart = await Cart.findOne({ userId: user._id }).populate(
    "products.productid"
  );
  if (!cart || cart.products.length === 0) return null;

  const line_items = cart.products.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.productid.name,
      },
      unit_amount: item.productid.price * 100,
    },
    quantity: item.quantity,
  }));

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/confirmation`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    customer_email: session.user.email,
    metadata: {
      userId: user._id.toString(),
      street: address.street,
      province: address.province,
    },
  });

  return stripeSession.url;
}
