"use client";

import { useEffect, useState } from "react";
import { LogIn, LogOut, ChevronDown } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { data: session, status } = useSession();

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
      className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full border border-zinc-800 bg-black/70 backdrop-blur-xl transition-all duration-300 ${
        scrolled ? "w-[700px] px-5 py-2" : "w-[900px] px-7 py-3"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white font-bold text-black">
            D
          </div>

          <span className="text-lg font-semibold text-white">
            DevBuild
          </span>
        </div>

        <div className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>

          <a href="#how-it-works" className="transition hover:text-white">
            How it works
          </a>

          <a href="#journey" className="transition hover:text-white">
            Journey
          </a>
        </div>

        <div className="relative">
          {status === "loading" ? (
            <div className="h-10 w-24 animate-pulse rounded-full bg-zinc-800" />
          ) : session?.user ? (
            <>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-2 py-1.5 transition hover:bg-zinc-800"
              >
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                )}

                <span className="hidden max-w-24 truncate text-sm text-white sm:block">
                  {session.user.name}
                </span>

                <ChevronDown
                  size={15}
                  className={`text-zinc-400 transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-64 rounded-2xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl">
                  <div className="flex items-center gap-3 rounded-xl p-3">
                    {session.user.image && (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="h-10 w-10 rounded-full"
                      />
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {session.user.name}
                      </p>

                      <p className="truncate text-xs text-zinc-500">
                        {session.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="my-1 border-t border-zinc-800" />

                  <button
                    onClick={() => signOut()}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => signIn("github")}
              className="flex cursor-pointer items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              <LogIn size={16} />
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}