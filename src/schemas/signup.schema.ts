import { z } from "zod";

export const userValidation = z
  .string()
  .min(3, { message: "Username must be more than 3 characters" })
  .max(20, { message: "Username must be less than 20 characters" })
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character");

export const signupSchema = z.object({
  username: userValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters long!" }),
});
