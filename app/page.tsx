import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/AdSlot";
import { AirGradeChart } from "@/components/charts/AirGradeChart";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RegionInsightCard } from "@/components/dashboard/RegionInsightCard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { NearbyAirStationFinder } from "@/components/location/NearbyAirStationFinder";
import { AirRankingTable } from "@/components/tables/AirRankingTable";
import { getDashboardDataset } from "@/lib/data";
import { dateTime, microgram, number, ventilationStatusLabel } from "@/lib/format";

export const metadata: Metadata = {
  title: "오늘 환기해도 될까 | 전국 미세먼지·환기 타이밍",
  description: "전국 미세먼지와 초미세먼지 기준으로 지금 환기 가능 여부와 생활 점수를 계산합니다."
};

export default async function HomePage() {
  const data = await getDashboardDataset();
  const national = data.national;
  const bestVentilation = [...data.sidoMetrics].sort((a, b) => b.ventilationScore - a.ventilationScore);
  const worstPm25 = [...data.sidoMetrics].sort((a, b) => b.avgPm25 - a.avgPm25);
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
    <DashboardShell title="오늘 환기해도 될까" description="미세먼지, 초미세먼지, 습도, 풍속을 rule-based 공식으로 계산한 생활 대기질 대시보드입니다.">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="전국 환기 점수" value={`${national.ventilationScore}점`} tone={national.ventilationScore >= 70 ? "good" : "warn"} />
        <MetricCard label="평균 PM10" value={microgram(national.avgPm10)} />
        <MetricCard label="평균 PM2.5" value={microgram(national.avgPm25)} tone={national.avgPm25 > 35 ? "bad" : "default"} />
        <MetricCard label="측정소 수" value={number(national.stationCount)} />
        <MetricCard label="환기 판정" value={ventilationStatusLabel(national.ventilationStatus)} tone={national.ventilationStatus === "recommended" ? "good" : "warn"} />
        <MetricCard label="야외활동 점수" value={`${national.outdoorActivityScore}점`} />
        <MetricCard label="빨래 점수" value={`${national.laundryScore}점`} />
        <MetricCard label="최근 측정" value={dateTime(data.lastMeasuredAt)} />
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-6">
          <NearbyAirStationFinder stations={stationLocations} metrics={locationMetrics} limit={6} />
          <AdSlot slotId="home-mid" minHeight={140} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <RegionInsightCard title="환기하기 좋은 지역" regions={bestVentilation} metric="ventilationScore" />
            <RegionInsightCard title="초미세먼지 높은 지역" regions={worstPm25} metric="avgPm25" />
          </div>
          <AirRankingTable title="전국 시도별 환기 점수" regions={bestVentilation} metric="ventilationScore" />
        </div>
        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <h2 className="text-lg font-semibold">대기질 등급 분포</h2>
            <AirGradeChart good={national.goodCount} moderate={national.moderateCount} bad={national.badCount} veryBad={national.veryBadCount} />
          </section>
          <AdSlot slotId="home-side" minHeight={260} />
        </aside>
      </div>
    </DashboardShell>
  );
}
