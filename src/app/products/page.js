import Image from "next/image";
import Link from "next/link";
import fetchProducts from "../actions/fetchProducts";

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <main>
      {/* Hero Section */}
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

        {/* Products Grid */}
        <div className="row g-4">
          {products && products.length > 0 ? (
            products.map((product) => (
              <div className="col-sm-6 col-md-4" key={product.id}>
                <div className="card h-100 shadow-sm">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="card-img-top object-fit-cover"
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">${product.price}</p>
                    <p className="card-text fw-semibold text-muted fst-italic">
                      {product.category}
                    </p>
                    <Link
                      href={`/products/${product.id}`}
                      className="btn btn-outline-primary mt-auto"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No products found.</p>
          )}
        </div>
      </section>
    </main>
  );
}
