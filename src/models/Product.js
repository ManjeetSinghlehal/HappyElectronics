import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stock: { type: Number, default: 0 },
  price: { type: Number, required: true },
  imageUrl: String,
  description: String,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  isBestSeller: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
