import connectDb from "@/lib/db";
import { getServerSession, User as NextUser } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import User from "@/models/user.model";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } },
) {
  const messageId = params.messageid;
  await connectDb();
  const session = await getServerSession(authOptions);
  const _user: NextUser = session?.user as NextUser;

  if (!session || !_user) {
    return new Response(
      JSON.stringify({ success: false, message: "Not authenticated" }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const updateResult = await User.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: messageId } } },
    );

    console.log("Updated Result: ", updateResult);

    if (updateResult.modifiedCount === 0) {
      return new Response(
        JSON.stringify({
          message: "Message not found or already deleted",
          success: false,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ message: "Message deleted", success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return new Response(
      JSON.stringify({ message: "Error deleting message", success: false }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
