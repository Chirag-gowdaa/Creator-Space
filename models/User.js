// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: String,
  name: String,
  profilePic: String,
  coverPic: String,
  bio: { type: String, default: "" },
  category: { type: String, enum: ["Music", "Art", "Gaming", "Writing", "Tech", "Education", "Other"], default: "Other" },
  socialLinks: {
    twitter: String,
    instagram: String,
    youtube: String,
    website: String,
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  totalEarnings: { type: Number, default: 0 },
  totalSupports: { type: Number, default: 0 },
  isCreator: { type: Boolean, default: false },
  subscriptionTiers: [{
    name: String,
    price: Number,
    description: String,
    benefits: [String],
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
