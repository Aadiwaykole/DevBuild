"use client";

import { ArrowRight } from "lucide-react";
import { githubSignIn } from "@/app/actions";

export default function GitHubSignIn() {
  return (
    <button
      onClick={() => githubSignIn()}
      className="group flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
    >
      Start Your Journey

      <ArrowRight
        size={17}
        className="transition-transform duration-300 group-hover:translate-x-1"
      />
    </button>
  );
}