"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type FastSlowRatioChartProps = {
  fast: number;
  slow: number;
};

export function FastSlowRatioChart({ fast, slow }: FastSlowRatioChartProps) {
  const data = [
    { name: "급속", value: fast },
    { name: "완속", value: slow }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value}기`, "충전기"]} />
          <Bar dataKey="value" fill="#0f9f8f" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
