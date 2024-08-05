import { X } from "lucide-react";
import { MagicCard } from "./magicui/magic-card";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { MessageProps } from "@/models/user.model";
import axios, { AxiosError } from "axios";
import { ApiResponseType } from "@/types/ApiResponse";
import { toast } from "sonner";

type MessageCardProps = {
  message: MessageProps;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    console.log("Message Id: ", message._id);
    try {
      const response = await axios.delete<ApiResponseType>(
        `/api/delete-message/${message._id}`,
      );
      if (response.data.success) {
        toast.success(response.data.message);
        onMessageDelete(message._id as string);
      } else {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseType>;
      toast.error("Error", {
        description:
          axiosError.response?.data.message ?? "Failed to delete message",
      });
    }
  };
  return (
    <MagicCard className="flex h-[400px] cursor-pointer items-center justify-center whitespace-normal text-2xl shadow-2xl">
      <div>
        <p>{message.content}</p>
        <span className="text-sm text-zinc-400">
          {message.createdAt.toLocaleString()}
        </span>
      </div>
      <div className="mt-14 flex items-center justify-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <X className="h-5 w-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MagicCard>
  );
};

export default MessageCard;
