"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import fetchProducts from "../actions/fetchProducts";

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    price: "",
    sort: "newest",
  });

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setAllProducts(data);
      setFilteredProducts(data);
    };
    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = [...allProducts];

    if (filters.category) {
      filtered = filtered.filter(
        (product) => product.category === filters.category
      );
    }

    if (filters.price) {
      if (filters.price === "2000+") {
        filtered = filtered.filter((product) => product.price > 2000);
      } else {
        const [min, max] = filters.price.split("-");
        filtered = filtered.filter(
          (product) =>
            product.price >= parseInt(min) && product.price <= parseInt(max)
        );
      }
    }

    if (filters.sort === "priceLow") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sort === "priceHigh") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filters.sort === "newest") {
      filtered.sort((a, b) => {
        if (b.isNewest && !a.isNewest) return 1;
        if (a.isNewest && !b.isNewest) return -1;
        return 0;
      });
    }

    setFilteredProducts(filtered);
  }, [filters, allProducts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const renderStars = (averageRating) => {
    return (
      <div className="d-flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} style={{ color: n <= averageRating ? "#ffc107" : "#e4e5e9" }}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return Math.round(total / reviews.length);
  };

  return (
    <main>
      <section className="bg-primary text-white text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold text-white">Our Products</h1>
        </div>
      </section>

      <section className="container py-5">
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Category</label>
            <select
              className="form-select"
              name="category"
              value={filters.category}
              onChange={handleChange}
            >
              <option value="">All</option>
              <option value="iOS">iOS</option>
              <option value="Android">Android</option>
              <option value="Laptops">Laptops</option>
              <option value="Headphones">Headphones</option>
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Price Range</label>
            <select
              className="form-select"
              name="price"
              value={filters.price}
              onChange={handleChange}
            >
              <option value="">All</option>
              <option value="0-500">$0 - $500</option>
              <option value="500-1000">$500 - $1000</option>
              <option value="1000-2000">$1000 - $2000</option>
              <option value="2000+">$2000+</option>
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Sort By</label>
            <select
              className="form-select"
              name="sort"
              value={filters.sort}
              onChange={handleChange}
            >
              <option value="newest">Newest</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="row g-4">
          {filteredProducts && filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const avgRating = getAverageRating(product.reviews);

              return (
                <div className="col-sm-6 col-md-4" key={product.id}>
                  <div className="card h-100 shadow-sm">
                    <Image
                      src={product.imageUrl[0]}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="card-img-top object-fit-cover"
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.name}</h5>
                      {renderStars(avgRating)}
                      <p className="card-text">${product.price}</p>
                      <p className="card-text fw-semibold text-muted fst-italic">
                        {product.category}
                      </p>
                      <Link
                        href={`/details/${product.id}`}
                        className="btn btn-outline-primary mt-auto"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center">No products found.</p>
          )}
        </div>
      </section>
    </main>
  );
}
