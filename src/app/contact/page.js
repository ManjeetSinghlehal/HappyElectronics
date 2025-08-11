"use client";

import { useState, useTransition } from "react";
import saveContact from "../actions/saveContact";

export default function ContactPage() {
  const [form, setForm] = useState({ fullName: "", email: "", message: "" });
  const [status, setStatus] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(null);

    const formData = new FormData();
    formData.append("fullName", form.fullName);
    formData.append("email", form.email);
    formData.append("message", form.message);

    startTransition(async () => {
      const res = await saveContact(formData);
      if (res.success) {
        setStatus("Message sent successfully!");
        setForm({ fullName: "", email: "", message: "" });
      } else {
        setStatus("Error: " + res.error);
      }
    });
  };

  return (
    <main className="container py-5">
      <h1 className="text-center mb-4">Contact Us</h1>
      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: 600 }}>
        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="form-control"
            required
            minLength={2}
            maxLength={100}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="message" className="form-label">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            className="form-control"
            rows="5"
            required
            minLength={5}
            maxLength={1000}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? "Sending..." : "Send Message"}
        </button>

        {status && <p className="mt-3 text-center text-info">{status}</p>}
      </form>
    </main>
  );
}
