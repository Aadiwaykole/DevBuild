"use client";

import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`
        fixed left-1/2 z-50 -translate-x-1/2
        border border-white/15
        bg-[#09090b]/80
        backdrop-blur-md
        transition-all duration-500 ease-in-out
        ${
          scrolled
            ? "top-4 w-[90%] max-w-3xl rounded-full px-5 py-3"
            : "top-4 w-[92%] max-w-6xl rounded-full px-7 py-4"
        }
      `}
    >
      <div className="flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className={`
              flex items-center justify-center
              rounded-lg bg-white font-bold text-black
              transition-all duration-500
              ${scrolled ? "h-8 w-8" : "h-9 w-9"}
            `}
          >
            D
          </div>

          <span
            className={`
              font-semibold tracking-tight
              transition-all duration-500
              ${scrolled ? "text-lg" : "text-xl"}
            `}
          >
            DevBuild
          </span>
        </div>

        {/* Navigation */}
        <div
          className={`
            hidden items-center text-sm font-medium md:flex
            transition-all duration-500
            ${scrolled ? "gap-6" : "gap-9"}
          `}
        >
          <a
            href="#features"
            className="text-zinc-400 transition hover:text-white"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="text-zinc-400 transition hover:text-white"
          >
            How it works
          </a>

          <a
            href="#journey"
            className="text-zinc-400 transition hover:text-white"
          >
            Journey
          </a>
        </div>

        {/* Sign In */}
        <button
          className={`
            flex items-center gap-2 rounded-full
            bg-white font-medium text-black
            transition-all duration-500
            hover:bg-zinc-200
            ${scrolled ? "px-4 py-2 text-xs" : "px-5 py-2.5 text-sm"}
          `}
        >
          <LogIn size={scrolled ? 14 : 16} />
          Sign in
        </button>

      </div>
    </nav>
  );
}