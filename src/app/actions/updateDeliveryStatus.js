"use server";

import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export default async function updateDeliveryStatus() {
  await connectDB();

  const now = new Date();

  await Order.updateMany(
    {
      isDelivered: false,
      deliveryAt: { $lte: now },
    },
    {
      $set: { isDelivered: true },
    }
  );
}
