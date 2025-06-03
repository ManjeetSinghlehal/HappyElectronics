"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Our Products", path: "/products" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4 shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-4 text-white" href="/">
          Happy Electronics
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {navItems.map((item) => (
              <li className="nav-item" key={item.name}>
                <Link
                  href={item.path}
                  className={`nav-link ${
                    pathname === item.path ? "active fw-bold" : ""
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
