import User from "@/models/User";
import Payment from "@/models/Payment";
import Post from "@/models/Post";
import connectDb from "@/app/utils/connectDb";
import { getServerSession } from "next-auth";

export async function GET(request) {
  try {
    await connectDb();
    const session = await getServerSession();

    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Get earnings data
    const payments = await Payment.find({ to_user: user.username, done: true });
    const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalSupports = payments.length;

    // Get posts count
    const postsCount = await Post.countDocuments({ creator: user._id });

    // Get engagement metrics
    const userPosts = await Post.find({ creator: user._id });
    const totalLikes = userPosts.reduce((sum, p) => sum + p.likes.length, 0);
    const totalComments = userPosts.reduce((sum, p) => sum + p.comments.length, 0);

    // Get recent supporters
    const recentPayments = await Payment.find({ to_user: user.username, done: true })
      .sort({ createdAt: -1 })
      .limit(5);

    return Response.json({
      success: true,
      stats: {
        totalEarnings,
        totalSupports,
        followers: user.followers.length,
        following: user.following.length,
        postsCount,
        totalLikes,
        totalComments,
        recentPayments
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
