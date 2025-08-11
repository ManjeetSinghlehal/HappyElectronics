import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Product from "@/models/Product"; // ✅ Import Product model

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const config = { api: { bodyParser: false } };

export async function POST(req) {

  await connectDB();

  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const street = session.metadata.street;
    const province = session.metadata.province;

    try {
      const cart = await Cart.findOne({ userId }).populate("products.productid");

      if (cart && cart.products.length > 0) {
        const total = cart.products.reduce((sum, item) => {
          return sum + item.productid.price * item.quantity;
        }, 0);

        await Order.create({
          userId,
          items: cart.products.map((item) => ({
            productId: item.productid._id,
            quantity: item.quantity,
            price: item.productid.price,
          })),
          total,
          isDelivered: false,
          deliveryAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          address: { street, province },
        });

        for (const item of cart.products) {
          await Product.findByIdAndUpdate(item.productid._id, {
            $inc: { stock: -item.quantity },
          });
        }

        await Cart.deleteOne({ userId });
        console.log("Order saved, stock updated, and cart cleared for user:", userId);
      } else {
        console.warn("Cart not found or empty for user:", userId);
      }
    } catch (error) {
      console.error("Order creation failed:", error);
    }
  }

  return NextResponse.json({ received: true });
}
