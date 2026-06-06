"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "8px",
  },
};

export function MonthlySpendChart({ data }) {
  if (!data.length) {
    return <EmptyChart />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis type="number" stroke="#888" fontSize={12} />
        <YAxis dataKey="month" type="category" stroke="#888" fontSize={12} width={60} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="spend" fill="#22c55e" radius={[0, 4, 4, 0]} name="Spend ($)" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RFQTrendsChart({ data }) {
  if (!data.length) {
    return <EmptyChart />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="month" stroke="#888" fontSize={12} />
        <YAxis stroke="#888" fontSize={12} />
        <Tooltip {...tooltipStyle} />
        <Legend />
        <Line type="monotone" dataKey="created" stroke="#22c55e" name="Created" strokeWidth={2} />
        <Line type="monotone" dataKey="awarded" stroke="#3b82f6" name="Awarded" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-64 items-center justify-center text-muted-foreground">
      No data available
    </div>
  );
}
