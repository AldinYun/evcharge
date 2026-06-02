import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { AirGradeChart } from "@/components/charts/AirGradeChart";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AirRankingTable } from "@/components/tables/AirRankingTable";
import { getDashboardDataset } from "@/lib/data";
import { dateTime } from "@/lib/format";

type PageProps = { params: { sido: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const sido = decodeURIComponent(params.sido);
  return {
    title: `${sido} 미세먼지 현황 | 환기 가능 여부·초미세먼지 분석`,
    description: `${sido} 지역 미세먼지, 초미세먼지, 환기 점수, 생활 지수`
  };
}

export default async function RegionPage({ params }: PageProps) {
  const sido = decodeURIComponent(params.sido);
  const data = await getDashboardDataset();
  const region = data.sidoMetrics.find((metric) => metric.sido === sido);
  if (!region) notFound();
  const sigungu = data.sigunguMetrics.filter((metric) => metric.sido === sido).sort((a, b) => b.ventilationScore - a.ventilationScore);

  return (
    <DashboardShell title={`${sido} 미세먼지·환기 현황`} description="시군구별 환기 점수, 미세먼지, 초미세먼지, 생활 점수를 비교합니다.">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="환기 점수" value={`${region.ventilationScore}점`} tone={region.ventilationScore >= 70 ? "good" : "warn"} />
        <MetricCard label="PM10" value={`${Math.round(region.avgPm10)}㎍/㎥`} />
        <MetricCard label="PM2.5" value={`${Math.round(region.avgPm25)}㎍/㎥`} tone={region.avgPm25 > 35 ? "bad" : "default"} />
        <MetricCard label="야외활동" value={`${region.outdoorActivityScore}점`} />
        <MetricCard label="측정 시각" value={dateTime(region.measuredAt)} />
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-6">
          <AdSlot slotId={`region-${sido}`} minHeight={140} />
          <AirRankingTable title="시군구별 환기 랭킹" regions={sigungu} metric="ventilationScore" />
        </div>
        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <h2 className="text-lg font-semibold">대기질 등급 분포</h2>
            <AirGradeChart good={region.goodCount} moderate={region.moderateCount} bad={region.badCount} veryBad={region.veryBadCount} />
          </section>
          <AdSlot slotId={`region-side-${sido}`} minHeight={240} />
        </aside>
      </div>
    </DashboardShell>
  );
}
