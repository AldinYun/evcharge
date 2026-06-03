import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AirGradeChart } from "@/components/charts/AirGradeChart";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AirRankingTable } from "@/components/tables/AirRankingTable";
import { getDashboardDataset } from "@/lib/data";
import { dateTime, microgram, ventilationStatusLabel } from "@/lib/format";

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
  const rankingTitle = sido === "경기" ? "경기도 시 단위 환기 랭킹" : "시군구별 환기 랭킹";

  return (
    <DashboardShell title={`${sido} 미세먼지·환기 현황`} description="지역별 환기 점수, 미세먼지, 초미세먼지, 생활 점수를 비교합니다.">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="환기 점수" value={`${region.ventilationScore}점`} tone={region.ventilationScore >= 70 ? "good" : "warn"} />
        <MetricCard label="환기 상태" value={ventilationStatusLabel(region.ventilationStatus)} tone={region.ventilationStatus === "recommended" ? "good" : "warn"} />
        <MetricCard label="미세먼지" value={microgram(region.avgPm10)} />
        <MetricCard label="초미세먼지" value={microgram(region.avgPm25)} tone={region.avgPm25 > 35 ? "bad" : "default"} />
        <MetricCard label="측정 시각" value={dateTime(region.measuredAt)} />
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-6">
          <AirRankingTable title={rankingTitle} regions={sigungu} metric="ventilationScore" />
        </div>
        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <h2 className="text-lg font-semibold">대기질 등급 분포</h2>
            <AirGradeChart good={region.goodCount} moderate={region.moderateCount} bad={region.badCount} veryBad={region.veryBadCount} />
          </section>
        </aside>
      </div>
    </DashboardShell>
  );
}
