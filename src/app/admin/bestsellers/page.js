"use client";

import { useEffect, useState, useTransition } from "react";
import toggleBestSeller from "@/app/actions/toggleBestSeller";
import fetchProducts from "@/app/actions/fetchProducts";

export default function BestSellerPage() {
  const [products, setProducts] = useState([]);
  const [isPending, startTransition] = useTransition();

  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleToggle = (id, currentStatus) => {
    startTransition(async () => {
      await toggleBestSeller(id, currentStatus);
      await loadProducts();
    });
  };

  return (
    <main className="container py-5">
      <h1 className="mb-4 text-center text-primary">Manage Best Sellers</h1>
      <div className="table-responsive">
        <table className="table table-hover table-bordered shadow-sm small text-center">
          <thead className="table-primary">
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td className="fw-semibold">{p.name}</td>
                <td>${p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <span
                    className={`badge rounded-pill px-3 py-1 ${
                      p.isBestSeller ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {p.isBestSeller ? "Best Seller" : "Regular"}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleToggle(p.id, p.isBestSeller)}
                    className={`btn btn-sm ${
                      p.isBestSeller
                        ? "btn-outline-danger"
                        : "btn-outline-success"
                    }`}
                    disabled={isPending}
                  >
                    {p.isBestSeller ? "Unset" : "Set"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
