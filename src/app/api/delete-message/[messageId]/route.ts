import connectDb from "@/lib/db";
import { getServerSession, User as NextUser } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import User from "@/models/user.model";
import { NextApiRequest } from "next";

export async function DELETE(
  request: NextApiRequest,
  { params }: { params: { messageId: string } },
) {
  const { messageId } = params;
  await connectDb();
  const session = await getServerSession(authOptions);
  const _user: NextUser = session?.user as NextUser;

  if (!session || !_user) {
    return new Response(
      JSON.stringify({ success: false, message: "Not authenticated" }),
      { status: 401 },
    );
  }

  try {
    const updatedResult = await User.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: messageId } } },
    );

    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        { message: "Message not found or already deleted", success: false },
        { status: 404 },
      );
    }

    return Response.json(
      { message: "Message deleted successfully", success: true },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return new Response(
      JSON.stringify({ message: "Error deleting message", success: false }),
      { status: 500 },
    );
  }
}
