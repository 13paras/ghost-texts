import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Content must be atleast 10 characters long." })
    .max(300, "Content should not be more than 300 characters"),
});
