import type { Metadata } from "next";
import { AirGradeChart } from "@/components/charts/AirGradeChart";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RegionInsightCard } from "@/components/dashboard/RegionInsightCard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { NearbyAirStationFinder } from "@/components/location/NearbyAirStationFinder";
import { SidoAirMap } from "@/components/map/SidoAirMap";
import { RegionSelectNavigator } from "@/components/region/RegionSelectNavigator";
import { AirRankingTable } from "@/components/tables/AirRankingTable";
import { getDashboardDataset } from "@/lib/data";
import { dateTime, microgram, number, ventilationStatusLabel } from "@/lib/format";

export const metadata: Metadata = {
  title: "오늘 공기 괜찮을까 | 전국 미세먼지·환기 가이드",
  description: "전국 미세먼지와 초미세먼지 관측값을 바탕으로 오늘 공기 상태와 환기 타이밍을 확인합니다."
};

export default async function HomePage() {
  const data = await getDashboardDataset();
  const national = data.national;
  const bestAirQuality = [...data.sigunguMetrics].sort((a, b) => b.ventilationScore - a.ventilationScore);
  const worstPm25 = [...data.sigunguMetrics].sort((a, b) => b.avgPm25 - a.avgPm25);
  const sidoRanking = [...data.sidoMetrics].sort((a, b) => b.ventilationScore - a.ventilationScore);
  const stationLocations = data.stations.map(({ id, name, address, sido, sigungu, latitude, longitude }) => ({
    id,
    name,
    address,
    sido,
    sigungu,
    latitude,
    longitude
  }));
  const locationMetrics = data.stationMetrics.map(({ stationId, pm10, pm25, ventilationScore, ventilationStatus }) => ({
    stationId,
    pm10,
    pm25,
    ventilationScore,
    ventilationStatus
  }));

  return (
    <DashboardShell
      title="오늘 공기 괜찮을까"
      description="전국 미세먼지와 초미세먼지 흐름을 모아, 지금 숨쉬기 좋은 지역과 환기하기 좋은 타이밍을 보여드립니다."
    >
      <div className="lg:hidden">
        <SidoAirMap regions={data.sidoMetrics} cityRegions={data.sigunguMetrics} />
      </div>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-0 lg:grid-cols-4">
        <MetricCard label="전국 대기질 점수" value={`${national.ventilationScore}점`} tone={national.ventilationScore >= 70 ? "good" : "warn"} />
        <MetricCard label="평균 미세먼지" value={microgram(national.avgPm10)} />
        <MetricCard label="평균 초미세먼지" value={microgram(national.avgPm25)} tone={national.avgPm25 > 35 ? "bad" : "default"} />
        <MetricCard label="측정소 수" value={number(national.stationCount)} />
        <MetricCard
          label="환기 판정"
          value={ventilationStatusLabel(national.ventilationStatus)}
          tone={national.ventilationStatus === "recommended" ? "good" : "warn"}
        />
        <MetricCard label="야외활동 점수" value={`${national.outdoorActivityScore}점`} />
        <MetricCard label="빨래 점수" value={`${national.laundryScore}점`} />
        <MetricCard label="최근 수집" value={dateTime(data.lastCollectedAt ?? data.lastMeasuredAt)} />
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-6">
          <RegionSelectNavigator regions={data.sigunguMetrics} />
          <div className="hidden lg:block">
            <SidoAirMap regions={data.sidoMetrics} cityRegions={data.sigunguMetrics} />
          </div>
          <NearbyAirStationFinder stations={stationLocations} metrics={locationMetrics} limit={6} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <RegionInsightCard title="대기질 상위 시/구" regions={bestAirQuality} metric="ventilationScore" />
            <RegionInsightCard title="초미세먼지 높은 시/구" regions={worstPm25} metric="avgPm25" />
          </div>
          <AirRankingTable title="전국 시도별 대기질 점수" regions={sidoRanking} metric="ventilationScore" />
        </div>
        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <h2 className="text-lg font-semibold">대기질 등급 분포</h2>
            <AirGradeChart good={national.goodCount} moderate={national.moderateCount} bad={national.badCount} veryBad={national.veryBadCount} />
          </section>
        </aside>
      </div>
    </DashboardShell>
  );
}
