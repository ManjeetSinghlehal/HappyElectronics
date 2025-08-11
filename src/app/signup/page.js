"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import signUp from "../actions/signUp";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("password", form.password);
    data.append("confirmPassword", form.confirmPassword);

    setSuccess("");
    setErrors({});

    startTransition(async () => {
      const result = await signUp(data);
      if (result?.success) {
        setSuccess(result.message);
        setForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setErrors({});
      } else {
        setSuccess("");
        // Basic keyword detection for mapping message to field
        const msg = result?.message || "Something went wrong.";
        const field = ["name", "email", "password", "confirmPassword"].find((f) =>
          msg.toLowerCase().includes(f)
        );
        if (field) {
          setErrors({ [field]: msg });
        } else {
          setErrors({ general: msg });
        }
      }
    });
  };

  return (
    <main className="bg-gray-100 min-h-screen flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-lg bg-white p-6 rounded shadow">
        <h2 className="text-center text-2xl fw-bold text-primary mb-4">
          Create Your Account
        </h2>

        <div className="flex flex-col items-center gap-3 mb-4">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="btn btn-outline-danger w-75 d-flex justify-content-center align-items-center gap-2 py-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7" viewBox="0 0 488 512">
              <path d="M488 261.8C488 403.3 391.1 504 248 504C110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
            </svg>
            <span className="fw-semibold text-sm">Continue with Google</span>
          </button>
          <button
            onClick={() => signIn("facebook", { callbackUrl: "/" })}
            className="btn btn-outline-primary w-75 d-flex justify-content-center align-items-center gap-2 py-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5" viewBox="0 0 320 512">
              <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"/>
            </svg>
            <span className="fw-semibold text-sm">Continue with Facebook</span>
          </button>
        </div>

        <div className="text-center text-muted mb-3 text-sm">or use your email</div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="form-label text-sm fw-bold">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control text-sm"
              value={form.name}
              onChange={handleChange}
              required
            />
            {errors.name && <p className="text-danger text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="form-label text-sm fw-bold">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control text-sm"
              value={form.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="text-danger text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="form-label text-sm fw-bold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control text-sm"
              value={form.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="text-danger text-sm mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="form-label text-sm fw-bold">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control text-sm"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && (
              <p className="text-danger text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {errors.general && <p className="text-danger text-sm mt-2">{errors.general}</p>}
          {success && <p className="text-success text-sm mt-2">{success}</p>}

          <div className="d-grid mt-3">
            <button type="submit" className="btn btn-success fw-bold text-sm" disabled={isPending}>
              {isPending ? "Creating Account..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="text-center mt-3 text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-primary fw-bold">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
