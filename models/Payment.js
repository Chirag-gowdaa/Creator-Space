import mongoose, { Schema, model } from "mongoose";

const PaymentSchema = new Schema({
  name: { type: String },
  to_user: { type: String, required: true },
  from_user: { type: String, required: true },
  amount: { type: Number, required: true },
  message: { type: String }, // optional
  oid: { type: String, required: true }, // Razorpay order id
  done: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Payment || model("Payment", PaymentSchema);
