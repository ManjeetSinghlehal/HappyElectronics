import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  providers: [{
    _id: false,
    userId: { type: Number, required: true },
    name: { type: String, required: true }
  }],
  email: { type: String, unique: true, required: true },
  role: { type: String },
  password: { type: String },
  imageUrl: { type: String },
  isVerified: { type: Boolean, default: false },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
