"use client";

import getUser from "@/app/actions/getUser";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const [role, setRole] = useState("");

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Our Products", path: "/products" },
    { name: "Contact", path: "/contact" },
  ];

  const adminItems = [
    { name: "Best Sellers", path: "/admin/bestsellers" },
    { name: "Products CRUD", path: "/admin/products" },
    { name: "Categories CRUD", path: "/admin/categories" },
    { name: "Manage Users", path: "/admin/users" },
    { name: "View Contacts", path: "/admin/contacts" },
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

  useEffect(() => {
    const fetchUser = async () => {
      if (session?.user?.email) {
        const { email } = session.user;
        const user = await getUser(email);
        if (Object.keys(user).length > 0 && user.role !== "") {
          setRole(user.role);
        }
      }
    };
    fetchUser();
  }, [session]);

  console.log(role);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4 shadow-sm">
      <div className="container-fluid">
        <Link
          className="navbar-brand fw-bold fs-4 text-white d-flex align-items-center"
          href="/"
        >
          <Image
            src="/images/happy electronics.png"
            alt="Happy Electronics Logo"
            width={40}
            height={40}
            className="me-2"
          />
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

            {role === "admin" &&
              adminItems.map((item) => (
                <li className="nav-item" key={item.name}>
                  <Link
                    href={item.path}
                    className={`nav-link small ${
                      pathname === item.path ? "active fw-bold" : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

            <li className="nav-item ms-3">
              <Link
                href="/cart"
                className="btn btn-outline-light position-relative"
              >
                <FaShoppingCart size={18} />
              </Link>
            </li>

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
                      <p className="mb-1 fw-semibold text-dark">
                        {session.user.name}
                      </p>
                      <p className="mb-2 text-muted small">
                        {session.user.email}
                      </p>
                      <button
                        className="btn btn-sm btn-primary w-100"
                        onClick={() => router.push("/profile")}
                      >
                        View Profile
                      </button>
                      <button
                        className="btn btn-sm btn-danger w-100"
                        onClick={() => signOut({ callbackUrl: "/login" })}
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="btn btn-sm btn-primary w-100 mb-2"
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        className="btn btn-sm btn-outline-primary w-100"
                      >
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
