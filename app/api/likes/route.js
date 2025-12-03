import Post from "@/models/Post";
import User from "@/models/User";
import Notification from "@/models/Notification";
import connectDb from "@/app/utils/connectDb";
import { getServerSession } from "next-auth";

// GET likes for a post
export async function GET(request) {
  try {
    await connectDb();
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return Response.json({ success: false, error: "Post ID required" }, { status: 400 });
    }

    const post = await Post.findById(postId)
      .populate("likes", "name username profilePic")
      .select("likes");

    if (!post) {
      return Response.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      likes: post.likes || [],
      total: post.likes?.length || 0
    });
  } catch (error) {
    console.error("Error fetching likes:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// LIKE/UNLIKE a post
export async function POST(request) {
  try {
    await connectDb();
    const session = await getServerSession();

    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { postId, action } = await request.json();

    if (!postId || !action) {
      return Response.json({ success: false, error: "Post ID and action required" }, { status: 400 });
    }

    if (!["like", "unlike"].includes(action)) {
      return Response.json({ success: false, error: "Action must be 'like' or 'unlike'" }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return Response.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    const userLikedPost = post.likes.includes(user._id);

    if (action === "like") {
      if (!userLikedPost) {
        post.likes.push(user._id);
        await post.save();

        // Create notification for post creator
        if (post.creator.toString() !== user._id.toString()) {
          await Notification.create({
            recipient: post.creator,
            sender: user._id,
            type: "like",
            message: `${user.name} liked your post`,
            relatedPost: postId
          });
        }

        return Response.json({
          success: true,
          message: "Post liked successfully",
          liked: true,
          totalLikes: post.likes.length
        });
      } else {
        return Response.json({
          success: false,
          error: "You already liked this post"
        }, { status: 400 });
      }
    } else if (action === "unlike") {
      if (userLikedPost) {
        post.likes = post.likes.filter(id => id.toString() !== user._id.toString());
        await post.save();

        return Response.json({
          success: true,
          message: "Post unliked successfully",
          liked: false,
          totalLikes: post.likes.length
        });
      } else {
        return Response.json({
          success: false,
          error: "You haven't liked this post"
        }, { status: 400 });
      }
    }
  } catch (error) {
    console.error("Error in like action:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// CHECK if user liked a post
export async function PUT(request) {
  try {
    await connectDb();
    const session = await getServerSession();

    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await request.json();

    if (!postId) {
      return Response.json({ success: false, error: "Post ID required" }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });
    const post = await Post.findById(postId);

    if (!post) {
      return Response.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    const isLiked = post.likes.includes(user._id);

    return Response.json({
      success: true,
      isLiked,
      totalLikes: post.likes.length
    });
  } catch (error) {
    console.error("Error checking like status:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
