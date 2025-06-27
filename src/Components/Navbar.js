"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Our Products", path: "/products" },
    { name: "Contact", path: "/contact" },
  ];

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <ul className="navbar-nav ms-auto align-items-center">
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

            {/* User icon on far right */}
            <li className="nav-item position-relative ms-3" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="btn p-0 border-0 bg-transparent"
                style={{ width: 36, height: 36, borderRadius: "50%" }}
              >
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="user"
                    className="rounded-circle"
                    width={36}
                    height={36}
                  />
                ) : (
                  <FaUserCircle size={32} color="white" />
                )}
              </button>

              {showDropdown && (
                <div
                  className="position-absolute end-0 mt-2 bg-white p-3 rounded shadow-sm"
                  style={{ minWidth: 200, zIndex: 999 }}
                >
                  {session ? (
                    <>
                      <p className="mb-1 fw-semibold text-dark">{session.user.name}</p>
                      <p className="mb-2 text-muted small">{session.user.email}</p>
                      <button
                        className="btn btn-sm btn-danger w-100"
                        onClick={() => signOut({ callbackUrl: "/login" })}
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="btn btn-sm btn-primary w-100 mb-2">
                        Login
                      </Link>
                      <Link href="/signup" className="btn btn-sm btn-outline-primary w-100">
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}