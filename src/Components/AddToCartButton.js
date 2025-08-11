"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/app/actions/cartActions";

export default function AddToCartButton({ productId, disabled }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAddToCart = () => {
    startTransition(async () => {
      await addToCart(productId, 1);
      router.push('/cart')
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isPending}
      className="btn btn-primary"
    >
      {isPending ? "Adding..." : "Add to Cart"}
    </button>
  );
}
