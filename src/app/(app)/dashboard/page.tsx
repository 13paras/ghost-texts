"use client";

import { MagicCard } from "@/components/magicui/magic-card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { acceptMessage } from "@/schemas/acceptMessage.schema";
import { ApiResponseType } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { CrossIcon, RefreshCwIcon, X } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import * as z from "zod";

const Dashboard = () => {
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedText, copy] = useCopyToClipboard();

  const { data: session } = useSession();

  const form = useForm<z.infer<typeof acceptMessage>>({
    resolver: zodResolver(acceptMessage),
    defaultValues: {
      acceptMessages: true,
    },
  });

  // Method to get profile url
  const username = session?.user.username;
  // const profileUrl = `${window.location.protocol}//${window.location.host}/u/${username}`;
  const profileUrl = "profileUrl🚀🚀🍪🎯";

  const handleCopy = (text: string) => {
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
  };

  // Handling form switch
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  // Handle switch change
  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponseType>(
        "/api/accept-messages",
        {
          acceptMessages: !acceptMessages,
        },
      );
      setValue("acceptMessages", !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseType>;
      toast.error(
        axiosError.response?.data.message ??
          "Failed to update message settings",
      );
    } finally {
      setIsSwitchLoading(false);
    }
  };

  return (
    <main className="container mx-auto space-y-4">
      <h2 className="mt-12 text-4xl font-semibold text-zinc-300">
        User Dashboard
      </h2>
      <p className="capitalize text-zinc-400">Copy your unique link</p>
      {/* input for copy */}
      <div className="relative">
        <Input
          value={profileUrl}
          disabled
          placeholder="profile url"
          className="h-16 border-zinc-700 bg-zinc-900"
        />
        <button
          type="button"
          className={cn(
            "absolute right-6 top-4 z-[2] rounded-md border p-0.5 backdrop-blur-2xl dark:border-neutral-800",
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
        <p>Accept Messages</p>
      </div>
      <Separator />

      <div>
        <Button className="bg-zinc-300">
          <RefreshCwIcon className="" />
        </Button>
      </div>
      {/* Messages */}
      <section className="grid h-[400px] w-full grid-cols-2 gap-4 lg:h-[250px]">
        <MagicCard className="flex cursor-pointer items-center justify-center whitespace-normal text-4xl shadow-2xl">
          <div>
            <p>Whats the current status </p>
            <span className="text-sm text-zinc-400">{Date().slice(0, 16)}</span>
          </div>
          <div className="mt-14 flex items-center justify-center">
            <Button
              variant={"destructive"}
              className="transition-all duration-150 ease-in-out active:scale-90"
            >
              <X />
            </Button>
          </div>
        </MagicCard>
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
