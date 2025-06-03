import Image from "next/image";
import Link from "next/link";
import fetchProducts from "../actions/fetchProducts";

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <main>
      <section className="bg-primary text-white text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold text-white">Our Products</h1>
        </div>
      </section>

      <section className="container py-5">
        {/* Filters */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Category</label>
            <select className="form-select">
              <option value="">All</option>
              <option value="iOS">iOS</option>
              <option value="Android">Android</option>
              <option value="Laptops">Laptops</option>
              <option value="Headphones">Headphones</option>
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Price Range</label>
            <select className="form-select">
              <option value="">All</option>
              <option value="0-500">$0 - $500</option>
              <option value="500-1000">$500 - $1000</option>
              <option value="1000-2000">$1000 - $2000</option>
              <option value="2000+">$2000+</option>
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Sort By</label>
            <select className="form-select">
              <option value="newest">Newest</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>
    </main>
  );
}
