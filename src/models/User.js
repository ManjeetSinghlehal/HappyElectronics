import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
  name: String,
  userId: Number,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  providers: [providerSchema],
  email: { type: String, unique: true, required: true },
  imageUrl: String,
  isVerified: { type: Boolean, default: false },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
