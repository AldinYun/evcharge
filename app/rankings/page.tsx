import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/AdSlot";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { RegionRankingTable } from "@/components/tables/RegionRankingTable";
import { getDashboardDataset } from "@/lib/data";

export const metadata: Metadata = {
  title: "전국 전기차 충전소 순위 | 충전 가능성·혼잡도·급속 충전기 분석",
  description: "충전하기 좋은 지역, 혼잡도 높은 지역, 급속 충전기 비율, 고장/점검 비율 TOP 20"
};

export default async function RankingsPage() {
  const data = await getDashboardDataset();
  const regions = data.sigunguMetrics;

  return (
    <DashboardShell title="전국 전기차 충전소 순위" description="시군구 단위로 충전 가능성, 혼잡도, 급속 충전기 비율, 고장/점검 비율을 비교합니다.">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RegionRankingTable
          title="충전하기 좋은 지역 TOP 20"
          regions={[...regions].sort((a, b) => b.chargingOpportunityScore - a.chargingOpportunityScore).slice(0, 20)}
          metric="chargingOpportunityScore"
        />
        <RegionRankingTable
          title="혼잡도 높은 지역 TOP 20"
          regions={[...regions].sort((a, b) => b.congestionRate - a.congestionRate).slice(0, 20)}
          metric="congestionRate"
        />
        <AdSlot slotId="rankings-mid" className="xl:col-span-2" minHeight={140} />
        <RegionRankingTable
          title="급속 충전기 비율 높은 지역 TOP 20"
          regions={[...regions].sort((a, b) => b.fastChargerRate - a.fastChargerRate).slice(0, 20)}
          metric="fastChargerRate"
        />
        <RegionRankingTable
          title="고장/점검 비율 높은 지역 TOP 20"
          regions={[...regions].sort((a, b) => b.faultRate - a.faultRate).slice(0, 20)}
          metric="faultRate"
        />
      </div>
    </DashboardShell>
  );
}
