"use server";

import Razorpay from "razorpay";
import Payment from "@/models/Payment";
import connectDb from "../utils/connectDb";

export async function createOrder(amount, to_user, from_user, name, message) {
  await connectDb();

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });
  console.log("RAZORPAY_ID:", process.env.RAZORPAY_ID);
  console.log("RAZORPAY_SECRET:", process.env.RAZORPAY_SECRET);

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  // ✅ Save with all required fields
  await Payment.create({
    amount,
    oid: order.id,
    to_user,
    from_user,
    name,
    message,
  });

  return order;
}
