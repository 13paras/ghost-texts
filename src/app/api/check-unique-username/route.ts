import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { userValidation } from "@/schemas/signup.schema";

export async function POST(request: Request) {
  await connectDb();

  try {
    const { username } = await request.json();

    const validatedResponse = userValidation.safeParse(username);

    if (!validatedResponse.success) {
      return Response.json(
        {
          success: false,
          message: validatedResponse.error?.errors[0].message,
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      username,
    });

    if (user) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      message: "Username is available",
    });
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
