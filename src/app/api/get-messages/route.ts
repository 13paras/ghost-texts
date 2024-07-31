import connectDb from "@/lib/db";
import User from "@/models/user.model";

export async function POST(request: Request) {
  await connectDb();

  try {
    const { username } = await request.json();

    const user = await User.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      messages: user.messages,
    });
  } catch (error) {
    console.log(error);
  }
}
