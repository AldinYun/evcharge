import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { ChargingStatusChart } from "@/components/charts/ChargingStatusChart";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { RegionRankingTable } from "@/components/tables/RegionRankingTable";
import { getDashboardDataset } from "@/lib/data";
import { percent } from "@/lib/format";

type PageProps = { params: { sido: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const sido = decodeURIComponent(params.sido);
  return {
    title: `${sido} 전기차 충전소 현황 | 충전 가능률·혼잡도 분석`,
    description: `${sido} 지역의 전기차 충전 가능률, 혼잡도, 고장률, 급속 충전기 비율 분석`
  };
}

export default async function RegionPage({ params }: PageProps) {
  const sido = decodeURIComponent(params.sido);
  const data = await getDashboardDataset();
  const region = data.sidoMetrics.find((metric) => metric.sido === sido);
  if (!region) notFound();

  const sigungu = data.sigunguMetrics
    .filter((metric) => metric.sido === sido)
    .sort((a, b) => b.chargingOpportunityScore - a.chargingOpportunityScore);

  return (
    <DashboardShell title={`${sido} 전기차 충전소 현황`} description="시군구별 가능률, 혼잡도, 고장/점검 비율, 급속 충전기 비율을 비교합니다.">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="충전 가능률" value={percent(region.availabilityRate)} tone="good" />
        <MetricCard label="혼잡도" value={percent(region.congestionRate)} tone="warn" />
        <MetricCard label="고장/점검 비율" value={percent(region.faultRate)} tone="bad" />
        <MetricCard label="급속 충전기 비율" value={percent(region.fastChargerRate)} />
        <MetricCard label="충전 여유도 점수" value={`${region.chargingOpportunityScore}점`} tone="good" />
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-6">
          <AdSlot slotId={`region-${sido}`} minHeight={140} />
          <RegionRankingTable title="시군구별 지역 랭킹" regions={sigungu} metric="chargingOpportunityScore" />
        </div>
        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <h2 className="text-lg font-semibold">상태 분포</h2>
            <ChargingStatusChart
              available={region.availableChargers}
              charging={region.chargingChargers}
              reserved={region.reservedChargers}
              maintenance={region.maintenanceChargers}
              fault={region.faultChargers}
              unknown={region.unknownChargers}
            />
          </section>
          <AdSlot slotId={`region-side-${sido}`} minHeight={240} />
        </aside>
      </div>
    </DashboardShell>
  );
}
