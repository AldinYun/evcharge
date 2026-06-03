"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { number } from "@/lib/format";

const gradeItems = [
  {
    key: "good",
    slug: "good",
    name: "좋음",
    description: "대체로 환기와 야외활동에 부담이 낮은 측정소",
    color: "#0f9f8f"
  },
  {
    key: "moderate",
    slug: "moderate",
    name: "보통",
    description: "민감군은 상태를 확인하고 환기 시간을 조절할 구간",
    color: "#f2c94c"
  },
  {
    key: "bad",
    slug: "bad",
    name: "나쁨",
    description: "환기와 장시간 야외활동에 주의가 필요한 측정소",
    color: "#f97316"
  },
  {
    key: "veryBad",
    slug: "very-bad",
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

  const goToGrade = (slug: string) => {
    window.location.href = `/grade/${slug}`;
  };

  return (
    <div className="w-full">
      <p className="mt-2 text-sm leading-6 text-slate-600">
        전국 측정소를 현재 PM10·PM2.5 기준으로 분류한 비율입니다. 차트 조각이나 범례를 선택하면 해당 등급 측정소 목록을 볼 수 있습니다.
      </p>

      <div className="mt-3 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={54}
              outerRadius={92}
              paddingAngle={2}
              cursor="pointer"
              onClick={(_entry, index) => {
                const item = data[index];
                if (item) goToGrade(item.slug);
              }}
            >
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
          <a key={item.key} href={`/grade/${item.slug}`} className="rounded-md border border-slate-200 p-3 hover:bg-slate-50">
            <div className="flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="whitespace-nowrap">{item.name}</span>
              </span>
              <span className="shrink-0 whitespace-nowrap text-sm font-bold text-slate-900">
                {number(item.value)}곳 · {item.percent}%
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-600">{item.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
