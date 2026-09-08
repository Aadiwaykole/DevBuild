import { ArrowRight, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import DashboardPreview from "@/components/DashboardPreview";
import Features from "@/components/Features";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#030712] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 pt-28 text-center">

        {/* Background Glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[120px]" />

        {/* Badge */}
        <div className="relative z-10 mb-7 flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/5 px-4 py-2 text-sm text-blue-300">
          <Sparkles size={15} />
          AI-powered developer growth intelligence
        </div>

        {/* Heading */}
        <h1 className="relative z-10 max-w-5xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          Your Developer Journey
          <span className="block text-zinc-400">
            Automatically Documented.
          </span>
        </h1>

        {/* Description */}
        <p className="relative z-10 mt-8 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
          DevBuild connects with your GitHub, understands your projects,
          and transforms your coding activity into a meaningful story of
          your growth.
        </p>

        {/* CTA Buttons */}
        <div className="relative z-10 mt-10 flex flex-col gap-4 sm:flex-row">

          <button className="group flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200">
            Start Your Journey

            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>

          <button className="rounded-full border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.07] hover:text-white">
            See How It Works
          </button>

        </div>

        {/* Small Trust Text */}
        <p className="relative z-10 mt-6 text-xs text-zinc-600">
          Connect GitHub • Track your growth • Understand your journey
        </p>

      </section>
      <DashboardPreview />

      <Features/>
    </main>
  );
}