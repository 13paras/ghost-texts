import connectDb from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await connectDb();

  /* 
    - check if i'm receiving the required input or not
    - check if it exists in db or not 
    - if it existed then send error that user already exists
    - if it's not then save it in the db

    */

  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "All the fields are required",
        },
        { status: 500 }
      );
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      return Response.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 500 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isAcceptingMessages: true,
      messages: [],
    });

    await newUser.save();

    return Response.json(
      {
        success: true,
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error registering User!!", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
