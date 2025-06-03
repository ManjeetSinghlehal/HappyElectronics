"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-light py-4 mt-auto shadow-sm">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        {/* Left Text */}
        <div className="mb-3 mb-md-0 text-center text-md-start">
          © {new Date().getFullYear()} Happy Electronics. All rights reserved.
        </div>

        {/* Footer Links */}
        <ul className="nav justify-content-center justify-content-md-end">
          <li className="nav-item">
            <Link href="/" className="nav-link px-2 text-light">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/about" className="nav-link px-2 text-light">
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/contact" className="nav-link px-2 text-light">
              Contact
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/privacy" className="nav-link px-2 text-light">
              Privacy
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
