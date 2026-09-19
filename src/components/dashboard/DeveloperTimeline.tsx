"use client";

import { useEffect, useState } from "react";

interface TimelineItem {
  month: string;
  commits: number;
}

export default function DeveloperTimeline() {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const response = await fetch(
          "/api/github/timeline"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch timeline");
        }

        const data = await response.json();

        setTimeline(data.timeline);
      } catch (error) {
        console.error(
          "Failed to fetch developer timeline:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTimeline();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <p className="text-sm text-zinc-500">
          Loading developer timeline...
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Developer Timeline
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Your GitHub development activity over time
        </p>
      </div>

      {timeline.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-600">
          No development activity found.
        </p>
      ) : (
        <div className="relative mt-8">
          <div className="absolute left-3 top-0 h-full w-px bg-zinc-800" />

          <div className="space-y-8">
            {timeline.map((item) => (
              <div
                key={item.month}
                className="relative flex gap-5"
              >
                <div className="relative z-10 mt-1 h-6 w-6 rounded-full border-4 border-zinc-950 bg-white" />

                <div className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {item.month}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        Development activity
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-semibold text-white">
                        {item.commits}
                      </p>

                      <p className="text-xs text-zinc-500">
                        commits
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}