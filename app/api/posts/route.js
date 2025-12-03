import Post from "@/models/Post";
import User from "@/models/User";
import connectDb from "@/app/utils/connectDb";
import { getServerSession } from "next-auth";

export async function GET(request) {
  try {
    await connectDb();
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get("creatorId");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 10;

    let query = {};
    if (creatorId) {
      query.creator = creatorId;
    }

    const skip = (page - 1) * limit;
    const posts = await Post.find(query)
      .populate("creator", "name username profilePic")
      .populate("comments.user", "name profilePic")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments(query);

    return Response.json({
      success: true,
      posts,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
      }
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDb();
    const session = await getServerSession();

    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const creator = await User.findOne({ email: session.user.email });
    if (!creator) {
      return Response.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const { title, content, image, isExclusive, requiredTier } = await request.json();

    const post = await Post.create({
      creator: creator._id,
      title,
      content,
      image,
      isExclusive,
      requiredTier
    });

    await post.populate("creator", "name username profilePic");

    return Response.json({
      success: true,
      post,
      message: "Post created successfully"
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
