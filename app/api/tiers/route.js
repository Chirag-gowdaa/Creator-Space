import User from "@/models/User";
import connectDb from "@/app/utils/connectDb";
import { getServerSession } from "next-auth";

// GET user's subscription tiers
export async function GET(request) {
  try {
    await connectDb();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ success: false, error: "User ID required" }, { status: 400 });
    }

    const user = await User.findById(userId).select("subscriptionTiers name username profilePic");

    if (!user) {
      return Response.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      tiers: user.subscriptionTiers || [],
      creator: { name: user.name, username: user.username, profilePic: user.profilePic }
    });
  } catch (error) {
    console.error("Error fetching tiers:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// CREATE/UPDATE subscription tiers
export async function POST(request) {
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

    if (!user.isCreator) {
      return Response.json({ success: false, error: "Only creators can manage tiers" }, { status: 403 });
    }

    const { tiers } = await request.json();

    // Validate tiers
    if (!Array.isArray(tiers)) {
      return Response.json({ success: false, error: "Tiers must be an array" }, { status: 400 });
    }

    for (const tier of tiers) {
      if (!tier.name || !tier.price || !tier.description) {
        return Response.json(
          { success: false, error: "Each tier must have name, price, and description" },
          { status: 400 }
        );
      }
      if (tier.price < 0) {
        return Response.json({ success: false, error: "Price cannot be negative" }, { status: 400 });
      }
    }

    user.subscriptionTiers = tiers;
    await user.save();

    return Response.json({
      success: true,
      message: "Subscription tiers updated successfully",
      tiers: user.subscriptionTiers
    });
  } catch (error) {
    console.error("Error updating tiers:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE a subscription tier
export async function DELETE(request) {
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

    const { tierId } = await request.json();

    user.subscriptionTiers = user.subscriptionTiers.filter(
      (tier) => tier._id?.toString() !== tierId
    );

    await user.save();

    return Response.json({
      success: true,
      message: "Tier deleted successfully",
      tiers: user.subscriptionTiers
    });
  } catch (error) {
    console.error("Error deleting tier:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
