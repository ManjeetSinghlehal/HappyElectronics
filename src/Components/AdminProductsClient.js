"use client";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/app/actions/manageProducts";
import fetchProducts from "@/app/actions/fetchProducts";
import { useEffect, useState } from "react";
import fetchCategories from "@/app/actions/fetchCategories";

export default function AdminProductsClient({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrls: "",
    description: "",
  });
  const [editId, setEditId] = useState(null);
  const [status, setStatus] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const refreshProducts = async () => {
    const updated = await fetchProducts();
    setProducts(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    const data = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      imageUrls: form.imageUrls
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean),
    };

    const res = editId
      ? await updateProduct(editId, data)
      : await createProduct(data);

    if (res.success) {
      await refreshProducts();
      setForm({
        name: "",
        price: "",
        stock: "",
        categoryId: "",
        imageUrls: "",
        description: "",
      });
      setEditId(null);
      setStatus("Saved successfully.");
    } else {
      setStatus("Error: " + res.error);
    }
  };

  const handleEdit = (p) => {
    console.log(p);

    setEditId(p.id);
    setForm({
      name: p.name,
      price: p.price,
      stock: p.stock,
      categoryId: p.category || "",
      imageUrls: Array.isArray(p.imageUrl) ? p.imageUrl.join(",") : "",
      description: p.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await deleteProduct(id);
    if (res.success) {
      await refreshProducts();
    } else {
      setStatus("Error: " + res.error);
    }
  };

  return (
    <main className="container py-5">
      <h2 className="text-center mb-4">Manage Products</h2>

      <form
        onSubmit={handleSubmit}
        className="border p-4 rounded shadow mb-5 bg-light"
      >
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="form-control"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="form-control"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="form-control"
              required
            />
          </div>
          <div className="col-md-12">
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-12">
            <input
              type="text"
              name="imageUrls"
              value={form.imageUrls}
              onChange={handleChange}
              placeholder="Image URLs (comma separated)"
              className="form-control"
            />
          </div>
          <div className="col-md-12">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="form-control"
              rows={3}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          {editId ? "Update Product" : "Add Product"}
        </button>
        {status && <p className="text-info mt-2">{status}</p>}
      </form>

      <h4 className="mb-3">All Products</h4>
      <div className="table-responsive">
        <table className="table table-bordered align-middle table-striped">
          <thead className="table-primary">
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>${p.price}</td>
                  <td>{p.stock}</td>
                  <td>{p.category}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(p.id)}
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
