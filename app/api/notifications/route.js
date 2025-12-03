import Notification from "@/models/Notification";
import User from "@/models/User";
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

    const notifications = await Notification.find({ recipient: user._id })
      .populate("sender", "name profilePic")
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({
      recipient: user._id,
      isRead: false
    });

    return Response.json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDb();
    const session = await getServerSession();

    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { notificationId } = await request.json();

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    return Response.json({
      success: true,
      notification,
      message: "Notification marked as read"
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
