import connectDb from "@/lib/db";
import { getServerSession, User as NextAuthUser } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import User from "@/models/user.model";

export async function POST(request: Request) {
  await connectDb();

  // to get currently logged in user
  const session = await getServerSession(authOptions);
  const user: NextAuthUser = session?.user as NextAuthUser;

  // checking whether there is any session or not (user is login or not)
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;

  try {
    const { acceptMessages } = await request.json();
    const updatedUser = await User.findByIdAndUpdate(
      {
        userId,
      },
      { isAcceptingMessages: acceptMessages },
      { new: true } // to get the new updated value
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to accept messages",
        },
        {
          status: 401,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messages",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: Request) {
  await connectDb();

  const session = await getServerSession(authOptions);
  const user: NextAuthUser = session?.user as NextAuthUser;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User is accepting messages",
        isAcceptingMessages: user.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
