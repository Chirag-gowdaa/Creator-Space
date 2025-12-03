// app/api/profile/route.js
import { NextResponse } from "next/server";
import connectDb from "./../../utils/connectDb";
import User from "@/models/User";
import { getServerSession } from "next-auth";

export async function GET(req) {
  try {
    await connectDb();
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      ...user.toObject()
    });
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDb();

    const { email, username, name, profilePic, coverPic } = await req.json();
    console.log("Incoming data:", { email, username, name, profilePic, coverPic });

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Fetch user
    const user = await User.findOne({ email });
    console.log("Fetched from DB before update:", user);

    if (!user) {
      return NextResponse.json({ error: "User does not exist" }, { status: 404 });
    }

    // Update fields
    user.username = username;
    user.name = name;
    user.profilePic = profilePic;
    user.coverPic = coverPic;
    user.updatedAt = Date.now();

    // Force marking as modified (just in case)
    user.markModified("profilePic");
    user.markModified("coverPic");

    // Save
    await user.save();
    console.log("User updated in DB:", user);

    // Fetch again to confirm
    const verify = await User.findOne({ email });
    console.log("Fetched from DB after save:", verify);

    return NextResponse.json({ success: true, user: verify });
  } catch (err) {
    console.error("Profile Update Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDb();
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      name,
      username,
      bio,
      category,
      profilePic,
      coverPic,
      isCreator,
      socialLinks
    } = await req.json();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update all fields
    if (name) user.name = name;
    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (category) user.category = category;
    if (profilePic) user.profilePic = profilePic;
    if (coverPic) user.coverPic = coverPic;
    if (isCreator !== undefined) user.isCreator = isCreator;
    if (socialLinks) user.socialLinks = socialLinks;

    user.updatedAt = Date.now();
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: user.toObject()
    });
  } catch (err) {
    console.error("Profile Update Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
