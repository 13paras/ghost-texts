"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

const Dashboard = () => {
  const [copied, setCopied] = useState(false);
  const inputText = "http://localhost:3000";
  const [copiedText, copy] = useCopyToClipboard();

  const handleCopy = (text: string) => {
    if (copied) return;
    copy(text)
      .then(() => {
        console.log("Copied!", { text });
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1000);
      })
      .catch((error) => {
        console.error("Failed to copy!", error);
      });
  };

  return (
    <main className="container mx-auto space-y-4">
      <h2 className="text-4xl mt-12 text-zinc-300 font-semibold">
        User Dashboard
      </h2>
      <p className="capitalize text-zinc-400">Copy your unique link</p>
      {/* input for copy */}
      <div className="relative">
        <Input
          value={inputText}
          disabled
          placeholder="profile url"
          className="h-16 bg-zinc-900 border-zinc-700"
        />
        <button
          className={cn(
            "absolute right-6 top-4 p-0.5 border dark:border-neutral-800 rounded-md backdrop-blur-2xl z-[2]"
          )}
          onClick={() => handleCopy(inputText)}
        >
          {copied ? <CheckMark /> : <ClipBoard />}
        </button>
      </div>
      {copiedText}
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
    className={"scale-[0.70] dark:stroke-neutral-400 stroke-neutral-800"}
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
    className={"scale-[0.70] dark:stroke-neutral-400 stroke-neutral-800"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
