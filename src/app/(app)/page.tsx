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
import { Spotlight } from "../_components/ui/Spotlight";

export default function Home() {
  return (
    <main>
     
      <div className="bg-grid-white/[0.02] relative flex h-[40rem] w-full flex-col overflow-hidden rounded-md bg-black/[0.96] antialiased md:items-center md:justify-center">
        <Spotlight
          className="-top-40 left-0 md:-top-20 md:left-60"
          fill="white"
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl p-4 pt-20 md:pt-0">
          <h1 className="bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
          Dive into the world of  <br /> Ghostly Whispers.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-center text-base font-normal text-neutral-300">
          Unleash your inner mischief with Ghost Text - where your secrets stay safe
          </p>
        </div>
        <div className="mt-10 flex mx-10 md:mx-0 flex-col items-center">
          {/* Carousel for Messages */}
          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full max-w-sm md:max-w-xl"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="border-gray-50/[.1] bg-gray-50/[.10] transition hover:bg-gray-50/[.15]">
                    <CardHeader>
                      <CardTitle className="text-xl md:text-2xl">{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-2 items-center md:items-start space-y-2 flex-row md:space-x-4 md:space-y-0">
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
      </div>
    </main>
  );
}
