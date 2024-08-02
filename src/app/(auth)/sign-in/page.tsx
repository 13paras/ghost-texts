"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signinSchema } from "@/schemas/signIn.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SVGProps } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// TODO: Add signup form from aceternity ui

const Login = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // Next-auth provide sign in functionality by itself
  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast.error("Invalid credentials");
      } else {
        toast.error(result.error);
      }
    }

    if (result?.url) {
      router.push("/dashboard");
    }
  };
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg py-4">
        <div className="flex flex-col items-center space-y-4 p-6">
          <GhostIcon className="h-12 w-12 text-blue-500" />
          <h2 className="text-4xl text-center pb-2 font-bold tracking-tight text-foreground ">
            Welcome Back to Ghost Texts
          </h2>
          <p className="text-zinc-300 text-center">
            Sign in to continue your secret conversations
          </p>
        </div>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-base">
                      Username/Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="username/email"
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
                    <FormLabel className="font-semibold text-base">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="******" type="password" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardFooter>
                <Button type="submit" className="w-full">
                  Sign in
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium hover:underline"
            prefetch={false}
          >
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;

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
