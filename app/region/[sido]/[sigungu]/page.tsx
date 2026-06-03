import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { getDashboardDataset } from "@/lib/data";
import { dateTime, microgram, ventilationStatusLabel } from "@/lib/format";

type PageProps = { params: { sido: string; sigungu: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const sido = decodeURIComponent(params.sido);
  const sigungu = decodeURIComponent(params.sigungu);
  return {
    title: `${sido} ${sigungu} 미세먼지 현황 | 환기 가능 여부 분석`,
    description: `${sido} ${sigungu} 미세먼지, 초미세먼지, 환기 점수`
  };
}

export default async function SigunguPage({ params }: PageProps) {
  const sido = decodeURIComponent(params.sido);
  const sigungu = decodeURIComponent(params.sigungu);
  const data = await getDashboardDataset();
  const region = data.sigunguMetrics.find((metric) => metric.sido === sido && metric.sigungu === sigungu);
  if (!region) notFound();
  const stations = data.stationMetrics.filter((metric) => metric.sido === sido && metric.sigungu === sigungu).sort((a, b) => b.ventilationScore - a.ventilationScore);

  return (
    <DashboardShell title={`${sido} ${sigungu} 미세먼지 현황`} description="시 단위 측정소별 미세먼지와 환기 점수를 보여줍니다.">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="환기 점수" value={`${region.ventilationScore}점`} tone={region.ventilationScore >= 70 ? "good" : "warn"} />
        <MetricCard label="환기 상태" value={ventilationStatusLabel(region.ventilationStatus)} tone={region.ventilationStatus === "recommended" ? "good" : "warn"} />
        <MetricCard label="미세먼지" value={microgram(region.avgPm10)} />
        <MetricCard label="초미세먼지" value={microgram(region.avgPm25)} tone={region.avgPm25 > 35 ? "bad" : "default"} />
        <MetricCard label="측정소 수" value={`${region.stationCount}곳`} />
      </section>

      <div className="mt-6">
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-950">측정소별 현황</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {stations.map((station) => (
              <div key={station.stationId} className="rounded-md border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{station.stationName}</div>
                    <div className="mt-1 text-sm text-slate-600">최근 측정 {dateTime(station.measuredAt)}</div>
                  </div>
                  <div className="text-sm font-bold text-teal-700">{station.ventilationScore}점</div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-600">
                  <span>미세먼지 {microgram(station.pm10)}</span>
                  <span>초미세먼지 {microgram(station.pm25)}</span>
                  <span>{ventilationStatusLabel(station.ventilationStatus)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
