import Image from "next/image";
import Link from "next/link";
import fetchProducts from "./actions/fetchProducts";

const bestSellers = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: 1299,
    imageUrl: "/images/15-pro.png",
  },
  {
    id: 2,
    name: "Samsung Galaxy S24",
    price: 1099,
    imageUrl: "/images/s-24.png",
  },
  {
    id: 3,
    name: "MacBook Pro M3",
    price: 2399,
    imageUrl: "/images/pro-m3.png",
  },
];

export default async function HomePage() {
  const products = await fetchProducts();
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-primary text-white text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold text-white">
            Welcome to Happy Electronics
          </h1>
          <p className="lead">
            Explore the latest mobiles, laptops, gadgets & accessories.
          </p>
          <Link href="/mobiles" className="btn btn-light btn-md mt-3">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container my-5">
        <h2 className="mb-4">🔥 Best Sellers</h2>
      </section>

      {/* Why Shop With Us */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <h2 className="mb-4">Why Shop With Happy Electronics?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 border rounded h-100">
                <h5>✅ Trusted Brands</h5>
                <p>
                  We offer only the most reliable and premium electronics on the
                  market.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 border rounded h-100">
                <h5>🚀 Fast Delivery</h5>
                <p>
                  Nationwide shipping with real-time tracking and 24-hour
                  dispatch.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 border rounded h-100">
                <h5>📞 Customer Support</h5>
                <p>
                  Live support 7 days a week to help with any queries or issues.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Mobile App */}
      <section className="container my-5 text-center">
        <div className="bg-primary text-white p-5 rounded shadow-sm">
          <h3 className="mb-3 text-white">📱 Download Our Mobile App</h3>
          <p className="mb-4">
            Get exclusive deals and early access to sales directly from your
            phone.
          </p>
          <button className="btn btn-light btn-md">Coming Soon</button>
        </div>
      </section>
    </main>
  );
}
