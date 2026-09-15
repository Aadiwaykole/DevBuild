"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface CommitActivityProps {
  monthlyActivity: Record<string, number>;
}

export default function CommitActivity({
  monthlyActivity,
}: CommitActivityProps) {
  const data = Object.entries(monthlyActivity).map(
    ([month, commits]) => ({
      month,
      commits,
    })
  );

  return (
    <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-zinc-900">
          Monthly Commit Activity
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Your development activity over time
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
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
                color: "#18181b",
              }}
              cursor={{ fill: "#f4f4f5" }}
            />

            <Bar
              dataKey="commits"
              name="Commits"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
            >
              <LabelList
                dataKey="commits"
                position="top"
                fill="#18181b"
                fontSize={13}
                fontWeight={600}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}