"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type ChargingStatusChartProps = {
  available: number;
  charging: number;
  reserved: number;
  maintenance: number;
  fault: number;
  unknown: number;
};

const colors = ["#0f9f8f", "#f59e0b", "#3b82f6", "#a855f7", "#e11d48", "#64748b"];

export function ChargingStatusChart(props: ChargingStatusChartProps) {
  const data = [
    { name: "사용 가능", value: props.available },
    { name: "충전 중", value: props.charging },
    { name: "예약", value: props.reserved },
    { name: "점검", value: props.maintenance },
    { name: "고장", value: props.fault },
    { name: "미확인", value: props.unknown }
  ];

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={96} paddingAngle={2}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}기`, "충전기"]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
