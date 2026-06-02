"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export function AirGradeChart({ good, moderate, bad, veryBad }: { good: number; moderate: number; bad: number; veryBad: number }) {
  const data = [
    { name: "좋음", value: good },
    { name: "보통", value: moderate },
    { name: "나쁨", value: bad },
    { name: "매우 나쁨", value: veryBad }
  ];
  const colors = ["#0f9f8f", "#f2c94c", "#f97316", "#e11d48"];

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={96} paddingAngle={2}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}곳`, "측정소"]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
