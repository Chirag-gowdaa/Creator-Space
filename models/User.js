// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: String,
  name: String,
  profilePic: String,
  coverPic: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
