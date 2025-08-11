"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../actions/cartActions";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCart = async () => {
    setLoading(true);
    const data = await getCart();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    if (session) fetchCart();
  }, [session]);

  const handleRemove = (id) => {
    startTransition(async () => {
      await removeFromCart(id);
      await fetchCart();
    });
  };

  const handleQuantityChange = (id, newQty) => {
    if (newQty < 1) return;
    startTransition(async () => {
      await updateCartQuantity(id, newQty);
      await fetchCart();
    });
  };

  const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  if (!session) {
    return (
      <main className="container py-5 text-center">
        <h2>Please log in to view your cart.</h2>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <h2 className="mb-4 text-primary">Your Cart</h2>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="vstack gap-3 mb-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded shadow-sm p-3 d-flex flex-column flex-md-row gap-3 align-items-start align-items-md-center"
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="rounded object-fit-cover"
                />

                <div className="flex-grow-1 w-100">
                  <h5 className="mb-1">{product.name}</h5>
                  <p className="mb-1 text-muted">${product.price} each</p>
                  <p className="fw-bold mb-2">
                    Subtotal: ${(product.price * product.quantity).toFixed(2)}
                  </p>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(product.id, product.quantity - 1)
                      }
                      className="btn btn-outline-secondary"
                      disabled={isPending}
                    >
                      −
                    </button>
                    <span className="px-2">{product.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(product.id, product.quantity + 1)
                      }
                      className="btn btn-outline-secondary"
                      disabled={isPending}
                    >
                      +
                    </button>

                    <button
                      onClick={() => handleRemove(product.id)}
                      className="btn btn-outline-danger ms-auto"
                      disabled={isPending}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <Link href="/products" className="btn btn-outline-secondary">
              ← Continue Shopping
            </Link>
            <h4 className="fw-bold mb-0">Total: ${total.toFixed(2)}</h4>
            <button
              className="btn btn-success"
              onClick={() => {
                router.push('/checkout')
              }}
              disabled={isPending}
            >
              {isPending ? "Redirecting..." : "Checkout"}
            </button>
          </div>
        </>
      )}
    </main>
  );
}