import Message from "@/models/Message";
import User from "@/models/User";
import connectDb from "@/app/utils/connectDb";
import { getServerSession } from "next-auth";

// GET messages (conversations or specific thread)
export async function GET(request) {
  try {
    await connectDb();
    const session = await getServerSession();

    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationWith = searchParams.get("conversationWith");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 20;

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ success: false, error: "User not found" }, { status: 404 });
    }

    if (conversationWith) {
      // Get messages with specific user
      const skip = (page - 1) * limit;
      const messages = await Message.find({
        $or: [
          { sender: user._id, recipient: conversationWith },
          { sender: conversationWith, recipient: user._id }
        ]
      })
        .populate("sender", "name username profilePic")
        .populate("recipient", "name username profilePic")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      // Mark messages as read
      await Message.updateMany(
        { sender: conversationWith, recipient: user._id, isRead: false },
        { isRead: true }
      );

      return Response.json({
        success: true,
        messages: messages.reverse(),
        pagination: { page, limit }
      });
    } else {
      // Get all conversations (latest message from each user)
      const messages = await Message.aggregate([
        {
          $match: {
            $or: [{ sender: user._id }, { recipient: user._id }]
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ["$sender", user._id] },
                "$recipient",
                "$sender"
              ]
            },
            lastMessage: { $first: "$$ROOT" }
          }
        },
        {
          $limit: 50
        }
      ]);

      // Populate user details
      const conversations = await Promise.all(
        messages.map(async (msg) => {
          const otherUser = await User.findById(msg._id).select("name username profilePic");
          return {
            user: otherUser,
            lastMessage: msg.lastMessage
          };
        })
      );

      return Response.json({
        success: true,
        conversations
      });
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// SEND message
export async function POST(request) {
  try {
    await connectDb();
    const session = await getServerSession();

    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { recipientId, content } = await request.json();

    if (!recipientId || !content || content.trim() === "") {
      return Response.json({ success: false, error: "Recipient and message content required" }, { status: 400 });
    }

    if (content.length > 5000) {
      return Response.json({ success: false, error: "Message too long (max 5000 characters)" }, { status: 400 });
    }

    const sender = await User.findOne({ email: session.user.email });
    if (!sender) {
      return Response.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return Response.json({ success: false, error: "Recipient not found" }, { status: 404 });
    }

    if (sender._id.toString() === recipient._id.toString()) {
      return Response.json({ success: false, error: "Cannot message yourself" }, { status: 400 });
    }

    const message = await Message.create({
      sender: sender._id,
      recipient: recipient._id,
      content: content.trim()
    });

    await message.populate("sender", "name username profilePic");
    await message.populate("recipient", "name username profilePic");

    return Response.json({
      success: true,
      message: "Message sent successfully",
      data: message
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE message
export async function DELETE(request) {
  try {
    await connectDb();
    const session = await getServerSession();

    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { messageId } = await request.json();

    if (!messageId) {
      return Response.json({ success: false, error: "Message ID required" }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });
    const message = await Message.findById(messageId);

    if (!message) {
      return Response.json({ success: false, error: "Message not found" }, { status: 404 });
    }

    // Only sender can delete
    if (message.sender.toString() !== user._id.toString()) {
      return Response.json({ success: false, error: "Not authorized to delete this message" }, { status: 403 });
    }

    await Message.findByIdAndDelete(messageId);

    return Response.json({
      success: true,
      message: "Message deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
