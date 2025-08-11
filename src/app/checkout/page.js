"use client";

import { useEffect, useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { getCart } from "../actions/cartActions";
import { startCheckout } from "../actions/checkoutAction";
import { createCheckoutSession } from "../actions/createCheckoutSession";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (session) {
      getCart().then(setProducts);
    }
  }, [session]);

  const total = products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  const provinceOptions = [
    "", "Ontario", "Quebec", "British Columbia", "Alberta",
    "Manitoba", "Saskatchewan", "Nova Scotia",
    "New Brunswick", "Newfoundland and Labrador", "Prince Edward Island"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const address = Object.fromEntries(formData);
        await startCheckout(formData);  
        const url = await createCheckoutSession(address);
        if (url) window.location.href = url;
      } catch (err) {
        setFormError(err.message || "Checkout failed.");
      }
    });
  };

  return (
    <main className="container py-5">
      <h2 className="mb-4 text-primary">Checkout</h2>

      <div className="vstack gap-3 mb-5">
        {products.map((product) => (
          <div key={product.id} className="border rounded shadow-sm p-3 d-flex flex-column flex-md-row gap-3">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={80}
              height={80}
              className="rounded object-fit-cover"
            />
            <div className="flex-grow-1 w-100">
              <h5 className="mb-1">{product.name}</h5>
              <p className="mb-1 text-muted">
                ${product.price} x {product.quantity}
              </p>
              <p className="fw-bold mb-0">
                Subtotal: ${(product.price * product.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <h5 className="text-end mb-4">Total: ${total.toFixed(2)}</h5>

      <form onSubmit={handleSubmit} className="border rounded p-4 shadow-sm bg-light">
        <h4 className="mb-3">Shipping Details</h4>

        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            value={session?.user?.name || ""}
            className="form-control"
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            value={session?.user?.email || ""}
            className="form-control"
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Street / Apt</label>
          <input name="street" type="text" className="form-control" required />
        </div>

        <div className="mb-3">
          <label className="form-label">Province</label>
          <select name="province" className="form-select" required>
            {provinceOptions.map((prov) => (
              <option key={prov} value={prov}>{prov || "Select Province"}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Country</label>
          <input type="text" value="Canada" className="form-control" disabled />
        </div>

        {formError && <p className="text-danger">{formError}</p>}

        <button
          type="submit"
          className="btn btn-success w-100"
          disabled={isPending}
        >
          {isPending ? "Processing..." : "Pay with Card"}
        </button>
      </form>
    </main>
  );
}
