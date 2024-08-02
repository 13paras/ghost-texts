"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import WorkButton from "./animata/button/work-button";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";

const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user: User = session?.user as User;
  console.log({ user });
  return (
    <nav className="p-4 flex items-center justify-between">
      <h2 className="text-2xl font-extrabold">Ghost Texts</h2>
      {user ? (
        <button
          type="button"
          onClick={() => signOut()}
          className="group relative overflow-hidden rounded-full bg-purple-700 px-10 py-2 text-lg transition-all"
        >
          <span className="absolute bottom-0 left-0 h-48 w-full origin-bottom translate-y-full transform overflow-hidden rounded-full bg-white/15 transition-all duration-300 ease-out group-hover:translate-y-14"></span>
          <span className="font-semibold text-purple-200">Logout</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => router.push("/sign-in")}
          className="group relative overflow-hidden rounded-full bg-purple-700 px-10 py-2 text-lg transition-all"
        >
          <span className="absolute bottom-0 left-0 h-48 w-full origin-bottom translate-y-full transform overflow-hidden rounded-full bg-white/15 transition-all duration-300 ease-out group-hover:translate-y-14"></span>
          <span className="font-semibold text-purple-200">Login</span>
        </button>
      )}
    </nav>
  );
};

export default Navbar;
