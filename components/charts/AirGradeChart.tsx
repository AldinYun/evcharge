"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { number } from "@/lib/format";

const gradeItems = [
  {
    key: "good",
    name: "좋음",
    description: "대체로 환기와 야외활동에 부담이 낮은 측정소",
    color: "#0f9f8f"
  },
  {
    key: "moderate",
    name: "보통",
    description: "민감군은 상태를 확인하고 환기 시간을 조절할 구간",
    color: "#f2c94c"
  },
  {
    key: "bad",
    name: "나쁨",
    description: "환기와 장시간 야외활동에 주의가 필요한 측정소",
    color: "#f97316"
  },
  {
    key: "veryBad",
    name: "매우 나쁨",
    description: "환기를 피하고 실내 공기 관리가 필요한 측정소",
    color: "#e11d48"
  }
] as const;

export function AirGradeChart({ good, moderate, bad, veryBad }: { good: number; moderate: number; bad: number; veryBad: number }) {
  const countByKey = { good, moderate, bad, veryBad };
  const total = good + moderate + bad + veryBad;
  const data = gradeItems.map((item) => ({
    ...item,
    value: countByKey[item.key],
    percent: total ? Math.round((countByKey[item.key] / total) * 1000) / 10 : 0
  }));

  return (
    <div className="w-full">
      <p className="mt-2 text-sm leading-6 text-slate-600">
        전국 측정소를 현재 PM10·PM2.5 기준으로 분류한 비율입니다. 색이 진한 경고 구간이 많을수록 환기와 야외활동을 보수적으로 판단하는 게 좋습니다.
      </p>

      <div className="mt-3 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={54} outerRadius={92} paddingAngle={2}>
              {data.map((entry) => (
                <Cell key={entry.key} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, _name, item) => {
                const payload = item.payload as (typeof data)[number];
                return [`${number(Number(value))}곳 (${payload.percent}%)`, "측정소"];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {data.map((item) => (
          <div key={item.key} className="rounded-md border border-slate-200 p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
              </span>
              <span className="text-sm font-bold text-slate-900">
                {number(item.value)}곳 · {item.percent}%
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
