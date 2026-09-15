import {
  Brain,
  GitCommit,
  GitFork,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function DashboardPreview() {
  return (
    <section id="how-it-works"className="relative mx-auto w-full max-w-6xl px-6 pb-32">
      
      {/* Glow behind dashboard */}
      <div className="absolute left-1/2 top-20 -z-10 h-96 w-3/4 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />

      {/* Dashboard */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#090b10]/95 shadow-2xl shadow-black/40">

        {/* Dashboard Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white font-bold text-black">
              D
            </div>

            <div>
              <p className="text-sm font-semibold">DevBuild</p>
              <p className="text-xs text-zinc-500">
                Developer Growth Dashboard
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-400 sm:flex">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            GitHub Connected
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 md:p-8">

          {/* Heading */}
          <div className="mb-8">
            <p className="text-sm text-zinc-500">
              YOUR DEVELOPMENT JOURNEY
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              See how you're growing.
            </h2>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <StatCard
              icon={<GitFork size={18} />}
              label="Projects"
              value="12"
              change="+3 this month"
            />

            <StatCard
              icon={<GitCommit size={18} />}
              label="Commits"
              value="1,284"
              change="+18% this month"
            />

            <StatCard
              icon={<Brain size={18} />}
              label="Skills Detected"
              value="18"
              change="+4 recently"
            />

            <StatCard
              icon={<TrendingUp size={18} />}
              label="Growth Score"
              value="87%"
              change="+12% this month"
            />

          </div>

          {/* Bottom Section */}
          <div className="mt-6 grid gap-6 lg:grid-cols-3">

            {/* Timeline */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 lg:col-span-2">

              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">
                    Developer Timeline
                  </h3>

                  <p className="mt-1 text-xs text-zinc-500">
                    Your recent engineering milestones
                  </p>
                </div>

                <Sparkles
                  size={18}
                  className="text-blue-400"
                />
              </div>

              <div className="space-y-6">

                <TimelineItem
                  date="Today"
                  title="Started building DevBuild"
                  description="Next.js • TypeScript • Tailwind"
                />

                <TimelineItem
                  date="3 days ago"
                  title="Added PostgreSQL"
                  description="Database architecture milestone"
                />

                <TimelineItem
                  date="1 week ago"
                  title="Built GitHub integration"
                  description="OAuth • GitHub API"
                />

                <TimelineItem
                  date="2 weeks ago"
                  title="Started learning TypeScript"
                  description="Strong typing • Interfaces • Generics"
                />

              </div>
            </div>

            {/* AI Insight */}
            <div className="rounded-xl border border-blue-500/10 bg-blue-500/[0.03] p-6">

              <div className="flex items-center gap-2">
                <Sparkles
                  size={18}
                  className="text-blue-400"
                />

                <h3 className="font-semibold">
                  AI Insight
                </h3>
              </div>

              <p className="mt-6 text-sm leading-6 text-zinc-400">
                Your recent projects show a clear shift toward
                full-stack development. You're increasingly working
                with typed systems, databases, and production tooling.
              </p>

              <div className="mt-6 rounded-lg border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-zinc-500">
                  NEXT SUGGESTION
                </p>

                <p className="mt-2 text-sm font-medium">
                  Explore background job processing
                </p>

                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  It could complement the architecture you're
                  currently building.
                </p>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}


/* -------------------------------- */
/* Stat Card */
/* -------------------------------- */

function StatCard({
  icon,
  label,
  value,
  change,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/20">

      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      <p className="mt-5 text-sm text-zinc-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold">
        {value}
      </p>

      <p className="mt-2 text-xs text-zinc-600">
        {change}
      </p>

    </div>
  );
}


/* -------------------------------- */
/* Timeline Item */
/* -------------------------------- */

function TimelineItem({
  date,
  title,
  description,
}: {
  date: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">

      <div className="relative flex w-20 shrink-0 justify-end text-right">
        <span className="text-xs text-zinc-600">
          {date}
        </span>
      </div>

      <div className="relative border-l border-white/10 pl-6">

        <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-blue-400" />

        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-1 text-xs text-zinc-500">
          {description}
        </p>

      </div>
    </div>
  );
}