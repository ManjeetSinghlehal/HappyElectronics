"use server";

import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export default async function fetchUserOrders(userId) {
  await connectDB();

  const orders = await Order.find({ userId })
    .populate("items.productId")
    .sort({ createdAt: -1 })
    .lean();

  return orders.map((order) => ({
    id: order._id.toString(),
    userId: order.userId.toString(),
    isDelivered: order.isDelivered,
    deliveryAt: order.deliveryAt?.toISOString(),
    total: order.total,
    createdAt: order.createdAt?.toISOString(),
    address: {
      street: order.address.street,
      province: order.address.province,
    },
    items: order.items.map((item) => {
      const product = item.productId;
      const userReview = product?.reviews?.filter((r) => {
        return r.userId.toString() === userId;
      });
      

      return {
        productId: product?._id?.toString(),
        name: product?.name || "Unknown Product",
        imageUrl: product?.imageUrls[0] || null,
        review:
          userReview && userReview.length > 0
            ? {
                reviewId: userReview[0]._id.toString(),
                userId: userReview[0]?.userId?.toString(),
                rating: userReview[0].rating,
                message: userReview[0].message,
              }
            : [],
        price: item.price,
        quantity: item.quantity,
      };
    }),
  }));
}
