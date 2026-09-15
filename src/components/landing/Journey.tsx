export default function Journey() {
  return (
    <section
      id="journey"
      className="border-t border-zinc-900 bg-black px-6 py-32 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-sm text-zinc-500">
          YOUR JOURNEY
        </p>

        <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight">
          See how your development evolves over time.
        </h2>

        <p className="mt-5 max-w-2xl text-zinc-400">
          DevBuild analyzes your GitHub activity and turns projects,
          technologies, and contributions into a meaningful developer journey.
        </p>

        <div className="mt-16 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">01</p>
            <h3 className="mt-8 text-lg font-medium">Discover</h3>
            <p className="mt-3 text-sm text-zinc-400">
              Connect your GitHub account and collect your development data.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">02</p>
            <h3 className="mt-8 text-lg font-medium">Analyze</h3>
            <p className="mt-3 text-sm text-zinc-400">
              Understand projects, technologies, commits, and development patterns.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">03</p>
            <h3 className="mt-8 text-lg font-medium">Understand</h3>
            <p className="mt-3 text-sm text-zinc-400">
              Discover your skill evolution and important development milestones.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">04</p>
            <h3 className="mt-8 text-lg font-medium">Grow</h3>
            <p className="mt-3 text-sm text-zinc-400">
              Get actionable insights about what to improve next.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}