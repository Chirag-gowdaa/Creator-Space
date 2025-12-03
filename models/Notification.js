import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { 
    type: String, 
    enum: ["follow", "support", "comment", "like", "message"],
    required: true 
  },
  message: String,
  relatedPost: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  relatedPayment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
