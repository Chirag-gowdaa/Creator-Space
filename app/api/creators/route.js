import User from "@/models/User";
import connectDb from "@/app/utils/connectDb";

export async function GET(request) {
  try {
    await connectDb();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 12;

    let query = { isCreator: true };

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;
    const creators = await User.find(query)
      .select("name username profilePic bio category totalEarnings totalSupports followers")
      .skip(skip)
      .limit(limit)
      .sort({ totalEarnings: -1 });

    const total = await User.countDocuments(query);

    return Response.json({
      success: true,
      creators,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
      }
    });
  } catch (error) {
    console.error("Error fetching creators:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
