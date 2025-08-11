"use client";

import { useState } from "react";
import fetchCategories from "@/app/actions/fetchCategories";
import { manageCategories } from "@/app/actions/manageCategories";

export default function AdminCategoriesClient({ initialCategories }) {
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    const res = await manageCategories(editId ? "update" : "create", {
      id: editId,
      name,
    });

    if (res.success) {
      const updated = await fetchCategories();
      setCategories(updated);
      setName("");
      setEditId(null);
      setStatus("Saved successfully.");
    } else {
      setStatus("Error: " + res.error);
    }
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setEditId(cat.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    const res = await manageCategories("delete", { id });
    if (res.success) {
      const updated = await fetchCategories();
      setCategories(updated);
    } else {
      setStatus("Error: " + res.error);
    }
  };

  return (
    <main className="container py-5">
      <h2 className="text-center mb-4">Manage Categories</h2>

      <form
        onSubmit={handleSubmit}
        className="border p-4 rounded shadow mb-4 bg-light"
      >
        <div className="row g-3">
          <div className="col-md-9">
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category Name"
              className="form-control"
              required
            />
          </div>
          <div className="col-md-3">
            <button type="submit" className="btn btn-primary w-100">
              {editId ? "Update Category" : "Add Category"}
            </button>
          </div>
        </div>
        {status && <p className="text-info mt-2">{status}</p>}
      </form>

      <h4 className="mb-3">All Categories</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-primary">
            <tr>
              <th>Name</th>
              <th style={{ width: "200px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.name}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(cat)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(cat.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
