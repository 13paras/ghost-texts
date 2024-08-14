"use client";

import Meteors from "@/app/_components/magicui/meteors";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/app/_components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { MessageCircle } from "lucide-react";
import messages from "../../messages.json";

export default function Home() {
  return (
    <main>
      {/* Meteor BG */}
      <div className="relative flex h-[500px] w-full flex-col items-center justify-center space-y-5 overflow-hidden rounded-lg bg-background md:shadow-xl">
        <Meteors number={30} />
        <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-6xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        Dive into the world of Ghostly Whispers
        </span>
        <p className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-lg font-semibold leading-none text-transparent dark:from-white dark:to-slate-800/10">
        Unleash your inner mischief with Ghost Text - where your secrets stay safe
        </p>
      </div>
      <div className="flex flex-col items-center">
        {/* Carousel for Messages */}
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card className="border-gray-50/[.1] bg-gray-50/[.10] transition hover:bg-gray-50/[.15]">
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-start space-y-2 md:flex-row md:space-x-4 md:space-y-0">
                    <MessageCircle className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </main>
  );
}
