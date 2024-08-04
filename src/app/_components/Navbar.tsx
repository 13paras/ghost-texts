"use client";

import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { SVGProps } from "react";

const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="flex items-center justify-between border p-4 shadow-lg">
      <div className="flex items-center gap-2">
        <GhostIcon className="h-12 w-12 text-blue-500" />
        <h2 className="text-2xl font-extrabold">Ghost Texts</h2>
      </div>
      {user ? (
        <>
          {/* <button
          type="button"
          onClick={() => signOut()}
          className="group relative overflow-hidden rounded-full bg-purple-700 px-10 py-2 text-lg transition-all"
        >
          <span className="absolute bottom-0 left-0 h-48 w-full origin-bottom translate-y-full transform overflow-hidden rounded-full bg-white/15 transition-all duration-300 ease-out group-hover:translate-y-14"></span>
          <span className="font-semibold text-purple-200">Logout</span>
        </button> */}
          <Button onClick={() => signOut()}>Logout</Button>
        </>
      ) : (
        <Link href={"/sign-in"}>
          {/* <button
            type="button"
            className="group relative overflow-hidden rounded-full bg-purple-700 px-10 py-2 text-lg transition-all"
          >
            <span className="absolute bottom-0 left-0 h-48 w-full origin-bottom translate-y-full transform overflow-hidden rounded-full bg-white/15 transition-all duration-300 ease-out group-hover:translate-y-14"></span>
            <span className="font-semibold text-purple-200">Login</span>
          </button> */}
          <Button>Login</Button>
        </Link>
      )}
    </nav>
  );
};

export default Navbar;

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
