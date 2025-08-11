import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [100, "Name must be under 100 characters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address",
    ],
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    minlength: [10, "Message must be at least 10 characters"],
    maxlength: [1000, "Message can't exceed 1000 characters"],
    trim: true,
  },
}, { timestamps: true });

export default mongoose.models.Contact || mongoose.model("Contact", contactSchema);
