"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ActivityData {
  month: string;
  commits: number;
}

export default function DeveloperActivity() {
  const [data, setData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchActivity() {
      try {
        const response = await fetch("/api/github/activity");

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const result = await response.json();

        const activity = Object.entries(result.monthlyActivity)
          .map(([month, commits]) => ({
            month,
            commits: Number(commits),
          }))
          .sort((a, b) => a.month.localeCompare(b.month));

        setData(activity);
      } catch (error) {
        console.error("Failed to fetch developer activity:", error);
        setError("Failed to load developer activity");
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
  }, []);

  if (loading) {
    return (
      <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <p className="text-sm text-zinc-500">
          Loading developer activity...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 rounded-2xl border border-red-900 bg-zinc-950 p-6">
        <p className="text-sm text-red-400">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-zinc-900">
          Your Development Activity
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Commit activity across your repositories
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              stroke="#e4e4e7"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{ fill: "#52525b", fontSize: 12 }}
              axisLine={{ stroke: "#d4d4d8" }}
              tickLine={false}
            />

            <YAxis
              allowDecimals={false}
              tick={{ fill: "#52525b", fontSize: 12 }}
              axisLine={{ stroke: "#d4d4d8" }}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e4e4e7",
                borderRadius: "10px",
              }}
            />

            <Bar
              dataKey="commits"
              name="Commits"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}