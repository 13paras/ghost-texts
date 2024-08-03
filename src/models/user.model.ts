import mongoose, { Document, Schema } from "mongoose";

export interface MessageProps extends Document {
  content: string;
  createdAt: Date;
}

interface UserProps extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode?: string;
  isVerified?: boolean;
  verifyCodeExpiry?: Date;
  isAcceptingMessages: boolean;
  messages: MessageProps[];
}

const messageSchema: Schema<MessageProps> = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const userSchema: Schema<UserProps> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please use a valid email address",
      ], // Regex for email validation
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be atleast o6 characters long"],
      trim: true,
    },
    verifyCode: {
      type: String,
      // required: [true, "Password is required"],
    },
    verifyCodeExpiry: {
      type: Date,
      // required: [true, "Verify code expiry is required"],
    },
    isVerified: {
      type: Boolean,
      // required: true,
      default: true,
    },
    isAcceptingMessages: {
      type: Boolean,
      default: true,
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

//* In nextjs most of the things run on edgetime means on every request, in other words when we create the backend using express or in react then we host the backend seperately and it creates and runs continously on the server but here in nextjs it runs on every request so for that we have to export the models differently so it shouldnot create the folder in the database again and again.
//* We check if the folder is created in db or not
// * Here first we are checking wether we have the folder in the db or not
const User =
  (mongoose.models.User as mongoose.Model<UserProps>) ||
  mongoose.model<UserProps>("User", userSchema);

export default User;
