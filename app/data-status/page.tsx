import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/AdSlot";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { getPipelineStatus } from "@/lib/data";
import { dateTime, number } from "@/lib/format";

export const metadata: Metadata = {
  title: "전기차 충전소 데이터 갱신 상태",
  description: "최근 데이터 수집 상태, 성공/실패 시각, 수집량, 파이프라인 상태"
};

export default async function DataStatusPage() {
  const status = await getPipelineStatus();

  return (
    <DashboardShell title="전기차 충전소 데이터 갱신 상태" description="collector, normalizer, save, aggregate, cache 단계의 mock 파이프라인 상태입니다.">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="파이프라인 상태" value={status.status === "healthy" ? "정상" : "확인 필요"} tone="good" helper={status.message} />
        <MetricCard label="마지막 성공 시각" value={dateTime(status.lastSuccessAt)} />
        <MetricCard label="마지막 실패 시각" value={dateTime(status.lastFailureAt)} tone="warn" />
        <MetricCard label="수집된 충전소 수" value={number(status.stationCount)} />
        <MetricCard label="수집된 충전기 수" value={number(status.chargerCount)} />
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <h2 className="text-lg font-semibold">파이프라인 단계</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {["collect", "normalize", "save", "aggregate", "cache"].map((step) => (
            <div key={step} className="rounded-md border border-teal-200 bg-teal-50 p-3 text-sm font-semibold text-teal-800">
              {step}
            </div>
          ))}
        </div>
      </section>
      <AdSlot slotId="data-status-bottom" className="mt-6" minHeight={150} />
    </DashboardShell>
  );
}
