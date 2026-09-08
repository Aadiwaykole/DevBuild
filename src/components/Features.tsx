import {
  Brain,
  Clock3,
  Search,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    icon: Clock3,
    title: "Developer Timeline",
    description:
      "Automatically turn your GitHub activity into a timeline of projects, technologies, and engineering milestones.",
  },
  {
    icon: Brain,
    title: "AI Growth Insights",
    description:
      "Understand how your skills are evolving and discover patterns across the projects you've built.",
  },
  {
    icon: Search,
    title: "Developer Memory",
    description:
      "Search your development history and quickly rediscover what you built, learned, and worked on.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="mx-auto max-w-7xl px-6 py-32"
    >
      {/* Section heading */}
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-5 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-zinc-400">
            <Sparkles size={14} className="text-blue-400" />
            WHY DEVBUILD
          </div>
        </div>

        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Your code is more than
          <span className="block text-zinc-500">
            a list of commits.
          </span>
        </h2>

        <p className="mt-6 text-base leading-7 text-zinc-500 sm:text-lg">
          DevBuild transforms your everyday development activity into
          a clear picture of what you've built, what you've learned,
          and how you're growing.
        </p>
      </div>

      {/* Feature cards */}
      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/20 hover:bg-white/[0.04]"
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

              {/* Icon */}
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-400/5 text-blue-400">
                <Icon size={20} />
              </div>

              {/* Content */}
              <div className="relative mt-7">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {feature.title}
                  </h3>

                  <ArrowUpRight
                    size={18}
                    className="text-zinc-600 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-400"
                  />
                </div>

                <p className="mt-4 text-sm leading-7 text-zinc-500">
                  {feature.description}
                </p>
              </div>

              {/* Bottom line */}
              <div className="mt-8 h-px w-full bg-white/5" />

              <p className="mt-4 text-xs font-medium text-zinc-600">
                EXPLORE FEATURE →
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}