import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AirActionGuide } from "@/components/dashboard/AirActionGuide";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { getDashboardDataset } from "@/lib/data";
import { airGradeLabel, dateTime, microgram, number, ventilationStatusLabel } from "@/lib/format";
import type { AirGrade } from "@/lib/types";

type PageProps = { params: { grade: string } };

const gradeMap: Record<string, AirGrade> = {
  good: "good",
  moderate: "moderate",
  bad: "bad",
  "very-bad": "very_bad"
};

function gradeFromParam(param: string) {
  return gradeMap[param];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const grade = gradeFromParam(params.grade);
  if (!grade) return { title: "대기질 등급별 측정소" };
  const label = airGradeLabel(grade);
  return {
    title: `${label} 대기질 측정소 | 전국 미세먼지 등급별 현황`,
    description: `${label} 등급으로 분류된 전국 미세먼지 측정소와 미세먼지, 초미세먼지, 환기 점수를 확인합니다.`
  };
}

export default async function GradePage({ params }: PageProps) {
  const grade = gradeFromParam(params.grade);
  if (!grade) notFound();

  const data = await getDashboardDataset();
  const stations = data.stationMetrics
    .filter((station) => station.airGrade === grade)
    .sort((a, b) => {
      if (grade === "good" || grade === "moderate") return b.ventilationScore - a.ventilationScore;
      return b.pm25 - a.pm25;
    });
  const label = airGradeLabel(grade);
  const averagePm25 = stations.length ? stations.reduce((sum, station) => sum + station.pm25, 0) / stations.length : 0;
  const averagePm10 = stations.length ? stations.reduce((sum, station) => sum + station.pm10, 0) / stations.length : 0;
  const latestMeasuredAt = stations.length ? new Date(Math.max(...stations.map((station) => station.measuredAt.getTime()))) : data.lastMeasuredAt;

  return (
    <DashboardShell title={`${label} 대기질 측정소`} description="대기질 등급 분포에서 선택한 등급에 해당하는 전국 측정소 목록입니다.">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="측정소 수" value={number(stations.length)} />
        <MetricCard label="평균 미세먼지" value={microgram(averagePm10)} />
        <MetricCard label="평균 초미세먼지" value={microgram(averagePm25)} tone={averagePm25 > 35 ? "bad" : "default"} />
        <MetricCard label="최근 측정" value={dateTime(latestMeasuredAt)} />
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-950">{label} 등급 측정소</h2>
          <div className="mt-4 space-y-3">
            {stations.length ? (
              stations.map((station) => (
                <Link
                  key={station.stationId}
                  href={`/region/${encodeURIComponent(station.sido)}/${encodeURIComponent(station.sigungu)}`}
                  className="block rounded-md border border-slate-200 p-3 hover:bg-slate-50"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="font-semibold text-slate-950">{station.stationName}</div>
                      <div className="mt-1 text-sm text-slate-600">
                        {station.sido} {station.sigungu}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-teal-700">{station.ventilationScore}점</div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 sm:grid-cols-4">
                    <span>미세먼지 {microgram(station.pm10)}</span>
                    <span>초미세먼지 {microgram(station.pm25)}</span>
                    <span>{ventilationStatusLabel(station.ventilationStatus)}</span>
                    <span>{dateTime(station.measuredAt)}</span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-600">현재 이 등급에 해당하는 측정소가 없습니다.</p>
            )}
          </div>
        </section>
        <aside className="space-y-6">
          <AirActionGuide grade={grade} />
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-950">등급 기준</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              좋음은 미세먼지 30㎍/㎥ 이하이면서 초미세먼지 15㎍/㎥ 이하, 보통은 미세먼지 80㎍/㎥ 이하이면서 초미세먼지 35㎍/㎥ 이하 기준으로 분류합니다.
              그보다 높은 구간은 나쁨 또는 매우 나쁨으로 표시합니다.
            </p>
          </section>
        </aside>
      </div>
    </DashboardShell>
  );
}
