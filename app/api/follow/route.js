import User from "@/models/User";
import Notification from "@/models/Notification";
import connectDb from "@/app/utils/connectDb";
import { getServerSession } from "next-auth";

export async function POST(request) {
  try {
    await connectDb();
    const session = await getServerSession();

    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { targetUserId, action } = await request.json();

    const currentUser = await User.findOne({ email: session.user.email });
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return Response.json({ success: false, error: "User not found" }, { status: 404 });
    }

    if (action === "follow") {
      if (!currentUser.following.includes(targetUserId)) {
        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUser._id);
        
        // Create notification
        await Notification.create({
          recipient: targetUserId,
          sender: currentUser._id,
          type: "follow",
          message: `${currentUser.name} started following you`
        });
      }
    } else if (action === "unfollow") {
      currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
      targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUser._id);
    }

    await currentUser.save();
    await targetUser.save();

    return Response.json({
      success: true,
      message: `${action === "follow" ? "Followed" : "Unfollowed"} successfully`
    });
  } catch (error) {
    console.error("Error in follow action:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
