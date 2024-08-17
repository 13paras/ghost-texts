"use client";

import { ConfettiButton } from "@/app/_components/magicui/confetti";
import { Button } from "@/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Textarea } from "@/app/_components/ui/textarea";
import { messageSchema } from "@/schemas/message.schema";
import { ApiResponseType } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { CircleDashedIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const PublicProfile = () => {
  const [charCount, setCharCount] = useState<number>(0);
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setSendingMessage(true);
    try {
      const isUserAcceptingMsg = await axios.get<ApiResponseType>(
        "/api/accept-messages",
      );

      /*       if (!isUserAcceptingMsg.data.isAcceptingMessages) {
        toast.error("Not Accepting", {
          description: "User not accepting messages",
        });
      } */

      const response = await axios.post<ApiResponseType>("/api/send-message", {
        username: params.username,
        content: data.content,
      });

      if (response.data.success) {
        toast.success("Success", {
          description:
            response.data.message || "Your ghost message is sent successfully",
        });

        // Clearing the message after the message is sent.
        // form.reset();
        form.reset({ content: "" });
        setCharCount(0);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseType>;
      console.error(axiosError);
      toast.error("Not Accepting", {
        description:
          axiosError.response?.data.message + " currently!!" ??
          "User is not accepting message currently!!",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <main className="container mx-auto h-screen space-y-6">
      <div className="space-y-4 py-16 text-center">
        <h1 className="text-center text-xl font-bold text-gray-400 md:text-3xl">
          Got any juicy gossip or burning questions? Spill the beans!
        </h1>
        <p className="mt-2 text-center text-lg text-white/60">
          Don&apos;t be shy, I know you&apos;re curious! 😉
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 lg:w-2/3"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">
                  Send Anonymous message to @{params.username}{" "}
                  <span className="block text-sm text-white/70">
                    Minimun 10 characters
                  </span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here!"
                    className="h-40 resize-none border-zinc-700"
                    {...field}
                    maxLength={150}
                    onChange={(e) => {
                      field.onChange(e);
                      setCharCount(e.target.value.length);
                    }}
                  />
                </FormControl>
                <div
                  className={`text-right text-sm ${
                    charCount > 500
                      ? "text-red-500"
                      : charCount > 450
                        ? "text-orange-400"
                        : "text-green-500"
                  }`}
                >
                  {charCount} / 520
                </div>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-center">
            <ConfettiButton
              disabled={!form.formState.isValid}
              className="flex items-center gap-3"
              type="submit"
            >
              {sendingMessage && (
                <CircleDashedIcon className="h-5 w-5 animate-spin" />
              )}
              Send Message
            </ConfettiButton>
          </div>
        </form>
      </Form>
    </main>
  );
};

export default PublicProfile;
