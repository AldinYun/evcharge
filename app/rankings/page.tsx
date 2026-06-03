import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AirRankingTable } from "@/components/tables/AirRankingTable";
import { getDashboardDataset } from "@/lib/data";

export const metadata: Metadata = {
  title: "전국 미세먼지 순위 | 환기 가능 지역·초미세먼지 분석",
  description: "전국 시군구별 환기 점수, 미세먼지, 초미세먼지, 야외활동 점수 순위"
};

export default async function RankingsPage() {
  const data = await getDashboardDataset();
  const regions = data.sigunguMetrics;

  return (
    <DashboardShell title="전국 미세먼지·환기 순위" description="자동 수집 대기질 데이터를 시군구 단위로 비교합니다.">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AirRankingTable title="지금 환기 좋은 지역 TOP 20" regions={[...regions].sort((a, b) => b.ventilationScore - a.ventilationScore).slice(0, 20)} metric="ventilationScore" />
        <AirRankingTable title="초미세먼지 높은 지역 TOP 20" regions={[...regions].sort((a, b) => b.avgPm25 - a.avgPm25).slice(0, 20)} metric="avgPm25" />
        <AirRankingTable title="야외활동 좋은 지역 TOP 20" regions={[...regions].sort((a, b) => b.outdoorActivityScore - a.outdoorActivityScore).slice(0, 20)} metric="outdoorActivityScore" />
        <AirRankingTable title="빨래하기 좋은 지역 TOP 20" regions={[...regions].sort((a, b) => b.laundryScore - a.laundryScore).slice(0, 20)} metric="laundryScore" />
      </div>
    </DashboardShell>
  );
}
