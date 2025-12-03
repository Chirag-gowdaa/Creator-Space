import Post from "@/models/Post";
import User from "@/models/User";
import Notification from "@/models/Notification";
import connectDb from "@/app/utils/connectDb";
import { getServerSession } from "next-auth";

// GET comments for a post
export async function GET(request) {
  try {
    await connectDb();
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return Response.json({ success: false, error: "Post ID required" }, { status: 400 });
    }

    const post = await Post.findById(postId)
      .populate("comments.user", "name username profilePic")
      .select("comments");

    if (!post) {
      return Response.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      comments: post.comments || [],
      total: post.comments?.length || 0
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ADD comment to a post
export async function POST(request) {
  try {
    await connectDb();
    const session = await getServerSession();

    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { postId, text } = await request.json();

    if (!postId || !text || text.trim() === "") {
      return Response.json({ success: false, error: "Post ID and comment text required" }, { status: 400 });
    }

    if (text.length > 1000) {
      return Response.json({ success: false, error: "Comment too long (max 1000 characters)" }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return Response.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    const comment = {
      user: user._id,
      text: text.trim(),
      createdAt: new Date()
    };

    post.comments.push(comment);
    await post.save();

    // Populate user info for response
    await post.populate("comments.user", "name username profilePic");

    // Create notification for post creator
    if (post.creator.toString() !== user._id.toString()) {
      await Notification.create({
        recipient: post.creator,
        sender: user._id,
        type: "comment",
        message: `${user.name} commented on your post`,
        relatedPost: postId
      });
    }

    return Response.json({
      success: true,
      message: "Comment added successfully",
      comment: post.comments[post.comments.length - 1]
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE comment
export async function DELETE(request) {
  try {
    await connectDb();
    const session = await getServerSession();

    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { postId, commentId } = await request.json();

    if (!postId || !commentId) {
      return Response.json({ success: false, error: "Post ID and comment ID required" }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });
    const post = await Post.findById(postId);

    if (!post) {
      return Response.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return Response.json({ success: false, error: "Comment not found" }, { status: 404 });
    }

    // Check if user is comment owner or post creator
    if (comment.user.toString() !== user._id.toString() && post.creator.toString() !== user._id.toString()) {
      return Response.json({ success: false, error: "Not authorized to delete this comment" }, { status: 403 });
    }

    post.comments.id(commentId).deleteOne();
    await post.save();

    return Response.json({
      success: true,
      message: "Comment deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
