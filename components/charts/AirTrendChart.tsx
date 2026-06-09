"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AirTrendPoint } from "@/lib/data";

export function AirTrendChart({ points }: { points: AirTrendPoint[] }) {
  if (points.length < 2) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <h2 className="text-lg font-semibold text-slate-950">최근 대기질 추이</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          아직 추이를 그릴 만큼 측정 이력이 충분하지 않습니다. 수집 배치가 몇 차례 더 실행되면 시간대별 변화가 표시됩니다.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <h2 className="text-lg font-semibold text-slate-950">최근 대기질 추이</h2>
      <p className="mt-1 text-sm text-slate-600">미세먼지와 초미세먼지는 왼쪽 축, 환기 점수는 오른쪽 축 기준으로 표시합니다.</p>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="dust" tick={{ fontSize: 12 }} unit="㎍/㎥" width={58} />
            <YAxis yAxisId="score" orientation="right" tick={{ fontSize: 12 }} domain={[0, 100]} unit="점" width={40} />
            <Tooltip
              formatter={(value, _name, entry) => {
                const dataKey = String(entry.dataKey);
                const label = dataKey === "pm10" ? "미세먼지" : dataKey === "pm25" ? "초미세먼지" : "환기 점수";
                const suffix = dataKey === "ventilationScore" ? "점" : "㎍/㎥";
                return [`${value}${suffix}`, label];
              }}
            />
            <Legend />
            <Line yAxisId="dust" type="monotone" dataKey="pm10" name="미세먼지" stroke="#f59e0b" strokeWidth={2} dot={false} />
            <Line yAxisId="dust" type="monotone" dataKey="pm25" name="초미세먼지" stroke="#e11d48" strokeWidth={2} dot={false} />
            <Line yAxisId="score" type="monotone" dataKey="ventilationScore" name="환기 점수" stroke="#0f766e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
