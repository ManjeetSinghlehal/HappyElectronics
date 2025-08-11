import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function getLatestOrder() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  await connectDB();

  const user = await User.findOne({ email: session.user.email });
  if (!user) return null;

  const order = await Order.findOne({ userId: user._id })
    .sort({ createdAt: -1 })
    .lean();

  if (!order) return null;

  // Populate product info
  const detailedItems = await Promise.all(order.items.map(async (item) => {
    const product = await Product.findById(item.productId).lean();
    return {
      name: product?.name || "Unknown",
      imageUrl: product?.imageUrls[0] || "",
      price: item.price,
      quantity: item.quantity,
    };
  }));

  return {
    createdAt: order.createdAt,
    deliveryAt: order.deliveryAt,
    delivered: order.delivered,
    total: order.total,
    items: detailedItems,
  };
}
