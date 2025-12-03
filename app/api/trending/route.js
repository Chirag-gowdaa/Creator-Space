import User from "@/models/User";
import Post from "@/models/Post";
import connectDb from "@/app/utils/connectDb";

// GET trending creators
export async function GET(request) {
  try {
    await connectDb();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "creators"; // creators, posts, categories

    if (type === "creators") {
      // Get trending creators by followers and earnings
      const trendingCreators = await User.find({ isCreator: true })
        .select("name username profilePic bio category followers totalEarnings totalSupports")
        .sort({ followers: -1, totalEarnings: -1 })
        .limit(10);

      return Response.json({
        success: true,
        type: "creators",
        data: trendingCreators
      });
    } else if (type === "posts") {
      // Get trending posts by likes
      const trendingPosts = await Post.find()
        .populate("creator", "name username profilePic")
        .select("title content image likes comments creator createdAt")
        .sort({ "likes": -1 })
        .limit(10);

      const postsWithStats = trendingPosts.map(post => ({
        ...post.toObject(),
        likeCount: post.likes.length,
        commentCount: post.comments.length
      }));

      return Response.json({
        success: true,
        type: "posts",
        data: postsWithStats
      });
    } else if (type === "categories") {
      // Get trending categories
      const categories = await User.aggregate([
        { $match: { isCreator: true } },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            totalFollowers: { $sum: { $size: "$followers" } }
          }
        },
        { $sort: { totalFollowers: -1 } },
        { $limit: 10 }
      ]);

      return Response.json({
        success: true,
        type: "categories",
        data: categories
      });
    } else {
      return Response.json({ success: false, error: "Invalid type parameter" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error fetching trending:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
