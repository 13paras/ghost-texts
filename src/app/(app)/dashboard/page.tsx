"use client";

import Loader from "@/app/_components/Loader";
import MessageCard from "@/app/_components/MessageCard";
import MessagesChart from "@/app/_components/MessagesChart";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Separator } from "@/app/_components/ui/separator";
import { Switch } from "@/app/_components/ui/switch";
import { cn } from "@/app/_components/utils";
import { MessageProps } from "@/models/user.model";

import { acceptMessage } from "@/schemas/acceptMessage.schema";
import { ApiResponseType } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

const Dashboard = () => {
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [copied, setCopied] = useState(false);
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedText, copy] = useCopyToClipboard();

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessage),
  });

  // Handling form switch
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  // Optimistic UI for deleting messages
  const handleDeleteMessage = useCallback((messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id !== messageId),
    );
  }, []);

  // Fetch user message settings
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponseType>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseType>;
      toast.error("Error", {
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  // Fetch user messages
  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponseType>("/api/get-messages");
      setMessages(response.data.messages || []);
      if (refresh) {
        toast.success("Refreshed Messages", {
          description: "Showing latest messages",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseType>;
      toast.error("Error", {
        description:
          axiosError.response?.data.message ?? "Failed to fetch messages",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch initial data on component mount
  useEffect(() => {
    fetchMessages();
    fetchAcceptMessage();
  }, [fetchMessages, fetchAcceptMessage]);

  // Handle switch change
  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    console.log({ acceptMessages });
    try {
      const response = await axios.post<ApiResponseType>(
        "/api/accept-messages",
        {
          acceptMessages: !acceptMessages,
        },
      );
      setValue("acceptMessages", !acceptMessages);
      toast.success(`${response.data.message} to ${!acceptMessages}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseType>;
      console.log(axiosError?.response?.data.message);
      toast.error(
        axiosError.response?.data.message ??
          "Failed to update message settings",
      );
    } finally {
      setIsSwitchLoading(false);
    }
  };

  // Method to get profile url
  const username = session?.user.username;
  // Set profile URL after the component mounts and username is available
  useEffect(() => {
    if (username) {
      setProfileUrl(
        `${window.location.protocol}//${window.location.host}/profile/${username}`,
      );
    }
  }, [username]);

  const handleCopy = useCallback(
    (text: string) => {
      if (copied) return;
      copy(text)
        .then(() => {
          console.log("Copied!", { text });
          toast.success("Profile URL has been copied to clipboard! 🚀");
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 1000);
        })
        .catch((error) => {
          console.error("Failed to copy!", error);
        });
    },
    [copy, copied],
  );

  if (isLoading) return <Loader />;

  return (
<main className="container mx-auto space-y-6 px-4 py-8 md:px-6 lg:px-8">
      <h2 className="text-3xl font-semibold text-zinc-300 md:text-4xl">
        User Dashboard
      </h2>
      <p className="text-lg capitalize text-zinc-400">Copy your unique link</p>
      
      <div className="relative">
        <Input
          value={profileUrl}
          disabled
          placeholder="profile url"
          className="h-12 border-zinc-700 bg-zinc-900 pr-12 md:h-16"
        />
        <button
          type="button"
          className={cn(
            "absolute right-2 top-2 z-[2] rounded-md border p-2 backdrop-blur-2xl dark:border-neutral-800 md:right-4 md:top-4",
          )}
          onClick={() => handleCopy(profileUrl)}
        >
          {copied ? <CheckMark /> : <ClipBoard />}
        </button>
      </div>

      <Separator />

      <div className="flex items-center gap-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <p className="text-lg">Accept Messages</p>
      </div>

      <Separator />

      <div>
        <Button
          className="mt-4 gap-2"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          Refresh Messages
        </Button>
      </div>

      <div className="py-12 md:py-24">
        <MessagesChart />
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-lg text-zinc-400">No messages to display</p>
        )}
      </section>
    </main>
  );
};

export default Dashboard;

const ClipBoard = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={"scale-[0.70] stroke-neutral-800 dark:stroke-neutral-400"}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
  </svg>
);
const CheckMark = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={"scale-[0.70] stroke-neutral-800 dark:stroke-neutral-400"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
