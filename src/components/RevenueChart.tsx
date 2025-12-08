"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
  }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  // Format data for the chart
  const chartData = data.map((item) => ({
    month: new Date(item.month).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    }),
    revenue: Number(item.revenue),
  }));

  // If no data, show some sample data
  const sampleData = [
    { month: "Jan 25", revenue: 1200 },
    { month: "Feb 25", revenue: 1800 },
    { month: "Mar 25", revenue: 2400 },
    { month: "Apr 25", revenue: 2100 },
    { month: "May 25", revenue: 2800 },
    { month: "Jun 25", revenue: 3200 },
    { month: "Jul 25", revenue: 2900 },
    { month: "Aug 25", revenue: 3500 },
    { month: "Sep 25", revenue: 3800 },
    { month: "Oct 25", revenue: 4200 },
    { month: "Nov 25", revenue: 4800 },
    { month: "Dec 25", revenue: 5200 },
  ];

  const displayData = chartData.length > 0 ? chartData : sampleData;

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={displayData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            className="dark:stroke-gray-600"
          />
          <XAxis
            dataKey="month"
            stroke="#6b7280"
            className="dark:stroke-gray-400"
            fontSize={12}
          />
          <YAxis
            stroke="#6b7280"
            className="dark:stroke-gray-400"
            fontSize={12}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            labelStyle={{ color: "#374151" }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#dc2626"
            strokeWidth={3}
            dot={{ fill: "#dc2626", strokeWidth: 2, r: 4 }}
            activeDot={{
              r: 6,
              stroke: "#dc2626",
              strokeWidth: 2,
              fill: "white",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
