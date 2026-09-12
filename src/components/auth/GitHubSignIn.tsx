"use client";

import { ArrowRight } from "lucide-react";
import {signIn, } from "next-auth/react";
export default function GitHubSignIn() {
  return (
    <button
      onClick={() => signIn("github")}
      className="group flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
    >
      Start Your Journey

      <ArrowRight
        size={17}
        className="transition-transform duration-300 group-hover:translate-x-1"
      />
    </button>
  );
}