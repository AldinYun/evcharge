import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { ChargingStatusChart } from "@/components/charts/ChargingStatusChart";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { getDashboardDataset } from "@/lib/data";
import { dateTime, percent } from "@/lib/format";

type PageProps = { params: { stationId: string } };

export const metadata: Metadata = {
  title: "전기차 충전소 상세 현황",
  description: "충전소별 충전기 상태, 가능률, 신뢰도, 최근 갱신 시각"
};

export default async function StationPage({ params }: PageProps) {
  const data = await getDashboardDataset();
  const station = data.stations.find((item) => item.id === params.stationId);
  const metric = data.stationMetrics.find((item) => item.stationId === params.stationId);
  if (!station || !metric) notFound();
  const chargers = data.chargers.filter((charger) => charger.stationId === station.id);

  return (
    <DashboardShell title={station.name} description={`${station.address} · ${station.operator}`}>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="충전 가능률" value={percent(metric.availabilityRate)} tone="good" />
        <MetricCard label="신뢰도 점수" value={percent(metric.reliabilityScore)} />
        <MetricCard label="급속 충전기 비율" value={percent(metric.fastChargerRate)} />
        <MetricCard label="최근 상태 갱신" value={dateTime(metric.updatedAt)} />
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <h2 className="text-lg font-semibold">충전기별 상태</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {chargers.map((charger) => (
              <div key={charger.id} className="rounded-md border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold">{charger.id}</div>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium">{charger.status}</span>
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  {charger.type} · {charger.speed === "fast" ? "급속" : "완속"} · {charger.outputKw}kW
                </div>
              </div>
            ))}
          </div>
        </section>
        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <h2 className="text-lg font-semibold">상태 분포</h2>
            <ChargingStatusChart
              available={metric.availableChargers}
              charging={metric.chargingChargers}
              reserved={metric.reservedChargers}
              maintenance={metric.maintenanceChargers}
              fault={metric.faultChargers}
              unknown={metric.unknownChargers}
            />
          </section>
          <AdSlot slotId={`station-${station.id}`} minHeight={220} />
        </aside>
      </div>
    </DashboardShell>
  );
}
