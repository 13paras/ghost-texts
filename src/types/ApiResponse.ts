import { MessageProps } from "@/models/user.model";

interface ApiResponseType {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<MessageProps>;
}

export type { ApiResponseType };
