import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { FastSlowRatioChart } from "@/components/charts/FastSlowRatioChart";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RegionInsightCard } from "@/components/dashboard/RegionInsightCard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { NearbyStationFinder } from "@/components/location/NearbyStationFinder";
import { RegionRankingTable } from "@/components/tables/RegionRankingTable";
import { getDashboardDataset } from "@/lib/data";
import { dateTime, number, percent } from "@/lib/format";

export const metadata: Metadata = {
  title: "전국 전기차 충전 분석 대시보드",
  description: "전국 전기차 충전소의 가능률, 혼잡도, 급속 충전기 비율을 분석합니다."
};

export default async function HomePage() {
  const data = await getDashboardDataset();
  const national = data.national;
  const bestRegions = [...data.sidoMetrics].sort((a, b) => b.chargingOpportunityScore - a.chargingOpportunityScore);
  const crowdedRegions = [...data.sidoMetrics].sort((a, b) => b.congestionRate - a.congestionRate);
  const stationLocations = data.stations.map(({ id, name, address, sido, sigungu, latitude, longitude, operator }) => ({
    id,
    name,
    address,
    sido,
    sigungu,
    latitude,
    longitude,
    operator
  }));
  const locationMetrics = data.stationMetrics.map(
    ({ stationId, availabilityRate, congestionRate, fastChargerRate, chargingOpportunityScore, availableChargers, totalChargers }) => ({
      stationId,
      availabilityRate,
      congestionRate,
      fastChargerRate,
      chargingOpportunityScore,
      availableChargers,
      totalChargers
    })
  );

  return (
    <DashboardShell title="전국 전기차 충전 분석 대시보드" description="공공 API 수집, 정규화, 저장, 집계, 캐싱 구조를 고려한 충전 인프라 분석 화면입니다.">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="총 충전소 수" value={number(national.stationCount)} helper="전국 mock 수집 기준" />
        <MetricCard label="총 충전기 수" value={number(national.totalChargers)} />
        <MetricCard label="사용 가능 충전기" value={number(national.availableChargers)} tone="good" />
        <MetricCard label="충전 중 충전기" value={number(national.chargingChargers)} tone="warn" />
        <MetricCard label="고장/점검/미확인" value={number(national.maintenanceChargers + national.faultChargers + national.unknownChargers)} tone="bad" />
        <MetricCard label="충전 가능률" value={percent(national.availabilityRate)} tone="good" />
        <MetricCard label="혼잡도" value={percent(national.congestionRate)} tone="warn" />
        <MetricCard label="급속 충전기 비율" value={percent(national.fastChargerRate)} />
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-6">
          <NearbyStationFinder stations={stationLocations} metrics={locationMetrics} limit={5} compact />
          <AdSlot slotId="home-mid" minHeight={140} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <RegionInsightCard title="충전 여유도 상위 지역" regions={bestRegions} metric="chargingOpportunityScore" />
            <RegionInsightCard title="혼잡도 높은 지역" regions={crowdedRegions} metric="congestionRate" />
          </div>
          <RegionRankingTable title="전국 시도별 충전 여유도" regions={bestRegions} metric="chargingOpportunityScore" />
        </div>
        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <h2 className="text-lg font-semibold">급속/완속 구성</h2>
            <FastSlowRatioChart fast={national.fastChargers} slow={national.slowChargers} />
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <h2 className="text-lg font-semibold">최근 데이터 갱신</h2>
            <p className="mt-3 text-sm text-slate-600">{dateTime(data.lastUpdatedAt)}</p>
            <Link href="/data-status" className="mt-4 inline-block rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white">
              데이터 상태 보기
            </Link>
          </section>
          <AdSlot slotId="home-side" minHeight={260} />
        </aside>
      </div>
    </DashboardShell>
  );
}
