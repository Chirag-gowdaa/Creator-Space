import Post from "@/models/Post";
import User from "@/models/User";
import connectDb from "@/app/utils/connectDb";
import { getServerSession } from "next-auth";

// GET personalized feed
export async function GET(request) {
  try {
    await connectDb();
    const session = await getServerSession();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 10;

    let posts = [];

    if (session) {
      // Authenticated user - show posts from followed creators
      const user = await User.findOne({ email: session.user.email });

      if (!user) {
        return Response.json({ success: false, error: "User not found" }, { status: 404 });
      }

      const skip = (page - 1) * limit;

      // Get posts from creators user follows
      posts = await Post.find({
        creator: { $in: user.following }
      })
        .populate("creator", "name username profilePic")
        .populate("comments.user", "name profilePic")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      // If not enough posts, add trending posts
      if (posts.length < limit) {
        const remainingLimit = limit - posts.length;
        const trendingPosts = await Post.find({
          creator: { $nin: [...user.following, user._id] }
        })
          .populate("creator", "name username profilePic")
          .populate("comments.user", "name profilePic")
          .sort({ likes: -1 })
          .limit(remainingLimit);

        posts = [...posts, ...trendingPosts];
      }

      // Add engagement info for current user
      const feedWithEngagement = posts.map(post => {
        const postObj = post.toObject();
        postObj.userLiked = post.likes.includes(user._id);
        postObj.likeCount = post.likes.length;
        postObj.commentCount = post.comments.length;
        return postObj;
      });

      const total = await Post.countDocuments({
        creator: { $in: user.following }
      });

      return Response.json({
        success: true,
        posts: feedWithEngagement,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } else {
      // Unauthenticated user - show trending posts
      const skip = (page - 1) * limit;

      posts = await Post.find()
        .populate("creator", "name username profilePic")
        .populate("comments.user", "name profilePic")
        .skip(skip)
        .limit(limit)
        .sort({ likes: -1, createdAt: -1 });

      const total = await Post.countDocuments();

      const feedWithStats = posts.map(post => {
        const postObj = post.toObject();
        postObj.likeCount = post.likes.length;
        postObj.commentCount = post.comments.length;
        return postObj;
      });

      return Response.json({
        success: true,
        posts: feedWithStats,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    }
  } catch (error) {
    console.error("Error fetching feed:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
