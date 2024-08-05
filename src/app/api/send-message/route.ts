import connectDb from "@/lib/db";
import User, { MessageProps } from "@/models/user.model";

export async function POST(request: Request) {
  await connectDb();
  /* 
  - Check wether user existed with this username or not
  - Check whether user isAccepting message or not
  - create new message in your described model format
  */

  try {
    const { username, content } = await request.json();

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

    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 400 }
      );
    }

    const newMessage = {
      content,
      createdAt: new Date(),
    };

    user.messages.push(newMessage as MessageProps);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Your ghost message is sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Send-Message Error: ", error);
    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 400 }
    );
  }
}
