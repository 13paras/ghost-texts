"use client";

import { MagicCard } from "@/app/_components/magicui/magic-card";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent, CardFooter } from "@/app/_components/ui/card";
import { Input } from "@/app/_components/ui/input";
import { signupSchema, userValidation } from "@/schemas/signup.schema";
import Link from "next/link";
import { SVGProps, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";
import { ApiResponseType } from "@/types/ApiResponse";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [username, setUsername] = useState<string>("");
  const [usernameMessage, setUsernameMessage] = useState<string>("");
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [submittingResponse, setSubmittingResponse] = useState<boolean>(false);

  const router = useRouter();

  const debounced = useDebounceCallback(setUsername, 500);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUniqueUsername = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.post("/api/check-unique-username", {
            username,
          });
          setUsernameMessage(response?.data?.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponseType>;
          console.log("Axios UsernameError: ", axiosError);
          setUsernameMessage(
            axiosError.message ?? "Error while checking username",
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUniqueUsername();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setSubmittingResponse(true);
    try {
      const response = await axios.post("/api/sign-up", {
        ...data,
      });
      if (response.status === 201) {
        toast.success("User created successfully");
        router.push("/dashboard");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseType>;
      console.log("OnSubmit axiosError: ", axiosError);
      toast.error(axiosError.message ?? "Error while creating user");
    } finally {
      setSubmittingResponse(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg py-4">
        <div className="flex flex-col items-center space-y-4 p-6">
          <GhostIcon className="h-12 w-12 text-blue-500" />
          <h2 className="pb-2 text-center text-4xl font-bold tracking-tight text-foreground">
            Join Ghost Texts
          </h2>
          <p className="text-center text-zinc-300">
            Sign up to start your anonymous adventure
          </p>
        </div>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 text-zinc-400"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-zinc-300">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="username"
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value);
                        }}
                      />
                    </FormControl>
                    {isCheckingUsername && (
                      <Loader2Icon className="animate-spin" />
                    )}
                    <p
                      className={`text-sm ${
                        usernameMessage === "Username is available"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {username} {usernameMessage}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-zinc-300">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-zinc-300">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="*******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardFooter>
                <Button type="submit" className="w-full">
                  Sign up
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium hover:underline"
            prefetch={false}
          >
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Signup;

function GhostIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 10h.01" />
      <path d="M15 10h.01" />
      <path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
