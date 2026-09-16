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

interface LanguageData {
  language: string;
  bytes: number;
}

export default function LanguageAnalysis() {
  const [data, setData] = useState<LanguageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLanguages() {
      try {
        const response = await fetch("/api/github/languages");

        if (!response.ok) {
          throw new Error("Failed to fetch languages");
        }

        const result = await response.json();

        const languages = Object.entries(result.languageUsage)
          .map(([language, bytes]) => ({
            language,
            bytes: Number(bytes),
          }))
          .sort((a, b) => b.bytes - a.bytes);

        setData(languages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchLanguages();
  }, []);

  if (loading) {
    return (
      <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <p className="text-sm text-zinc-500">
          Loading technology analysis...
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-2xl border border-zinc-800 bg-white p-6">
      <h2 className="text-xl font-semibold text-zinc-900">
        Your Technology Stack
      </h2>

      <p className="mt-1 text-sm text-zinc-500">
        Languages used across your repositories
      </p>

      <div className="mt-6 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 5,
              right: 20,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid
              stroke="#e4e4e7"
              strokeDasharray="3 3"
              horizontal={false}
            />

            <XAxis
              type="number"
              tick={{ fill: "#52525b", fontSize: 12 }}
              axisLine={{ stroke: "#d4d4d8" }}
              tickLine={false}
            />

            <YAxis
              type="category"
              dataKey="language"
              tick={{ fill: "#27272a", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
              width={90}
            />

            <Tooltip
              formatter={(value) => [
                `${Number(value).toLocaleString()} bytes`,
                "Usage",
              ]}
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e4e4e7",
                borderRadius: "10px",
              }}
            />

            <Bar
              dataKey="bytes"
              name="Usage"
              fill="#2563eb"
              radius={[0, 6, 6, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}