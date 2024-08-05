"use client"

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const PublicProfile = () => {
  const params = useParams<{ username: string }>();

  const FormSchema = z.object({
    message: z
      .string()
      .min(10, { message: "Message must be at least 10 characters" })
      .max(300, {
        message: "Message must not be longer than 300 characters ",
      }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    
  };
  return (
    <main className="container mx-auto h-screen space-y-6">
      <h1 className="py-16 text-center text-4xl font-bold">
        Public Profile Link
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 lg:w-2/3"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">
                  Send Anonymous message to @{params.username}{" "}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here!"
                    className="h-40 resize-none"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-center">
            <Button className="flex items-center" type="submit">
              Send Message
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
};

export default PublicProfile;
