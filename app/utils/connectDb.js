// utils/connectDb.js
import mongoose from "mongoose";

const connectDb = async () => {
  if (mongoose.connections[0].readyState) {
    console.log("✅ Already connected to MongoDB:", mongoose.connection.name);
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "CreatorSpace", // confirm this is your DB name
    });
    console.log("🚀 Connected to MongoDB:", mongoose.connection.name);
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
    throw error;
  }
};

export default connectDb;
