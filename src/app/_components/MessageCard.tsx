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
  const dateString = message.createdAt;
  const dateObject = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const formattedDate = dateObject.toLocaleDateString("en-US", options);
  return (
    <MagicCard className="flex h-full min-h-[200px] cursor-pointer flex-col items-center justify-between p-4 text-center shadow-2xl  transition-all hover:scale-105">
        <div className="flex-grow w-full">
        <p className="mb-2 text-lg  font-medium styled-scrollbars h-[150px] pr-3 overflow-y-scroll">{message.content}</p>
        <span className="text-sm text-zinc-400">{formattedDate}</span>
      </div>
      <div className="mt-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <X className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-[90vw] sm:max-w-[425px]">
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
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MagicCard>
  );
};

export default MessageCard;
