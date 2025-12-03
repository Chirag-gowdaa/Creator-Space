import User from "@/models/User";
import connectDb from "@/app/utils/connectDb";
import { getServerSession } from "next-auth";

// GET recommended creators based on user's interests
export async function GET(request) {
  try {
    await connectDb();
    const session = await getServerSession();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 10;

    let recommendations = [];

    if (session) {
      // If user is logged in, recommend based on their following
      const user = await User.findOne({ email: session.user.email });

      if (user && user.following.length > 0) {
        // Get creators followed by people the user follows
        const followedCreators = await User.find({
          _id: { $in: user.following },
          isCreator: true
        }).select("following");

        const recommendedIds = new Set();
        followedCreators.forEach(creator => {
          creator.following.forEach(id => {
            if (!user.following.includes(id) && id.toString() !== user._id.toString()) {
              recommendedIds.add(id);
            }
          });
        });

        if (recommendedIds.size > 0) {
          recommendations = await User.find({
            _id: { $in: Array.from(recommendedIds) },
            isCreator: true
          })
            .select("name username profilePic bio category followers totalEarnings")
            .sort({ followers: -1 })
            .limit(limit);
        }
      }

      // If not enough recommendations, add top creators in user's category
      if (recommendations.length < limit) {
        const categoryCreators = await User.find({
          isCreator: true,
          category: user.category,
          _id: { $nin: [...user.following, user._id] }
        })
          .select("name username profilePic bio category followers totalEarnings")
          .sort({ followers: -1 })
          .limit(limit - recommendations.length);

        recommendations = [...recommendations, ...categoryCreators];
      }
    }

    // If still not enough or no session, add top creators overall
    if (recommendations.length < limit) {
      const topCreators = await User.find({
        isCreator: true,
        _id: { $nin: recommendations.map(r => r._id) }
      })
        .select("name username profilePic bio category followers totalEarnings")
        .sort({ followers: -1, totalEarnings: -1 })
        .limit(limit - recommendations.length);

      recommendations = [...recommendations, ...topCreators];
    }

    return Response.json({
      success: true,
      recommendations: recommendations.slice(0, limit)
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
