import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    minlength: [2, "Product name must be at least 2 characters"],
    maxlength: [100, "Product name must not exceed 100 characters"],
    trim: true,
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, "Stock must be a non-negative number"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be a non-negative number"],
  },
  imageUrls: {
    type: [String],
    validate: {
      validator: (arr) => arr.length > 0,
      message: "At least one product image URL is required",
    },
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    minlength: [10, "Description should be at least 10 characters"],
    maxlength: [1000, "Description can't exceed 1000 characters"],
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },
  isBestSeller: { type: Boolean, default: false },
  isNewest: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, required: true, min: 1, max: 5 },
      message: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);
