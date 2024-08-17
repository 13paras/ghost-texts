import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Message must be atleast 10 characters long." })
    .max(520, { message: "Message should not be more than 520 characters" }),
});
