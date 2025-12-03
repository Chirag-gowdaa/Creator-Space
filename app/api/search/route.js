import User from "@/models/User";
import Post from "@/models/Post";
import connectDb from "@/app/utils/connectDb";

// SEARCH across creators and posts
export async function GET(request) {
  try {
    await connectDb();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "all"; // all, creators, posts
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 12;

    if (!query || query.trim() === "") {
      return Response.json({ success: false, error: "Search query required" }, { status: 400 });
    }

    const skip = (page - 1) * limit;
    const searchRegex = { $regex: query, $options: "i" };

    let results = {
      creators: [],
      posts: [],
      total: 0
    };

    // Search creators
    if (type === "all" || type === "creators") {
      let creatorQuery = {
        isCreator: true,
        $or: [
          { name: searchRegex },
          { username: searchRegex },
          { bio: searchRegex }
        ]
      };

      if (category) {
        creatorQuery.category = category;
      }

      const creators = await User.find(creatorQuery)
        .select("name username profilePic bio category followers totalEarnings")
        .skip(skip)
        .limit(limit)
        .sort({ followers: -1 });

      const creatorCount = await User.countDocuments(creatorQuery);

      results.creators = creators;
      results.creatorCount = creatorCount;
      results.creatorPages = Math.ceil(creatorCount / limit);
    }

    // Search posts
    if (type === "all" || type === "posts") {
      const posts = await Post.find({
        $or: [
          { title: searchRegex },
          { content: searchRegex }
        ]
      })
        .populate("creator", "name username profilePic")
        .select("title content image likes comments creator createdAt")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const postCount = await Post.countDocuments({
        $or: [
          { title: searchRegex },
          { content: searchRegex }
        ]
      });

      const postsWithStats = posts.map(post => ({
        ...post.toObject(),
        likeCount: post.likes.length,
        commentCount: post.comments.length
      }));

      results.posts = postsWithStats;
      results.postCount = postCount;
      results.postPages = Math.ceil(postCount / limit);
    }

    results.total = (results.creatorCount || 0) + (results.postCount || 0);
    results.page = page;
    results.limit = limit;

    return Response.json({
      success: true,
      query,
      results
    });
  } catch (error) {
    console.error("Error searching:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
