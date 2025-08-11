"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/Components/AddToCartButton";

export default function ClientDetails({ product, productId, relatedProducts }) {
  const validImages = product.imageUrls?.filter(Boolean) || [];
  const [activeImage, setActiveImage] = useState(validImages[0]);

  const getAverageRating = () => {
    if (!product.reviews || product.reviews.length === 0) return 0;
    const total = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    return Math.round(total / product.reviews.length);
  };

  const renderStars = (count) => (
    <div className="mb-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          style={{
            color: n <= count ? "#ffc107" : "#e4e5e9",
            fontSize: "1.4rem",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-primary text-white text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold text-white">{product.name}</h1>
          {product.reviews?.length > 0 && (
            <div className="mt-2">{renderStars(getAverageRating())}</div>
          )}
        </div>
      </section>

      {/* Product Details */}
      <section className="container py-5">
        <div className="row g-5 align-items-start">
          <div className="col-md-6">
            <div
              className="zoom-container border rounded overflow-hidden"
              style={{ height: 550 }}
            >
              <img
                src={activeImage}
                alt={product.name}
                className="w-100 h-100 zoom-image"
                style={{ objectFit: "contain" }}
              />
            </div>
            {validImages.length > 1 && (
              <div className="d-flex gap-2 mt-3 justify-content-center flex-wrap">
                {validImages.map((url, idx) => (
                  <Image
                    key={idx}
                    src={url}
                    alt={`Thumbnail ${idx + 1}`}
                    width={80}
                    height={60}
                    className={`img-thumbnail ${
                      activeImage === url ? "border border-primary" : ""
                    }`}
                    style={{ cursor: "pointer", objectFit: "cover" }}
                    onClick={() => setActiveImage(url)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <h2>{product.name}</h2>
            <p className="text-muted fst-italic">
              Category: {product.category}
            </p>
            <p>{product.description}</p>
            <p className="fw-bold fs-4">${product.price}</p>
            <p className={product.stock > 0 ? "text-success" : "text-danger"}>
              {product.stock > 0
                ? `In stock (${product.stock})`
                : "Out of stock"}
            </p>

            <div className="d-flex gap-3 mt-4">
              <AddToCartButton
                productId={productId}
                disabled={product.stock === 0}
              />
              <Link href="/products" className="btn btn-outline-secondary">
                ← Back to Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="container pb-5">
        <hr />
        <h3 className="mb-4">User Reviews</h3>
        {product.reviews.length === 0 ? (
          <p className="text-muted">No reviews yet.</p>
        ) : (
          product.reviews.map((review, index) => (
            <div
              key={index}
              className="mb-4 p-3 border rounded shadow-sm bg-light"
            >
              <h6 className="mb-1">{review.userName}</h6>
              {renderStars(review.rating)}
              {review.message && (
                <p className="fst-italic text-secondary">{review.message}</p>
              )}
            </div>
          ))
        )}
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="container pb-5">
          <hr />
          <h3 className="mb-4">Related Products</h3>
          <div className="row">
            {relatedProducts.map((p) => (
              <div key={p.id} className="col-md-3 mb-4">
                <div className="card h-100 shadow-sm">
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    width={400}
                    height={250}
                    className="card-img-top"
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">{p.name}</h5>
                    {p.reviewCount > 0 && (
                      <div className="mb-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <span
                            key={n}
                            style={{
                              color:
                                n <= p.averageRating ? "#ffc107" : "#e4e5e9",
                              fontSize: "1.2rem",
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="card-text fw-bold">${p.price}</p>
                    <Link
                      href={`/details/${p.id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <style jsx>{`
        .zoom-image {
          transition: transform 0.3s ease;
        }
        .zoom-container:hover .zoom-image {
          transform: scale(1.6);
          cursor: zoom-in;
        }
      `}</style>
    </main>
  );
}
