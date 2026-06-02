import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/AdSlot";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { NearbyStationFinder } from "@/components/location/NearbyStationFinder";
import { getDashboardDataset } from "@/lib/data";

export const metadata: Metadata = {
  title: "내 주변 전기차 충전소 | 위치 기반 충전 가능률 분석",
  description: "브라우저 현재 위치를 기준으로 가까운 전기차 충전소와 충전 가능률을 확인합니다."
};

export default async function NearbyPage() {
  const data = await getDashboardDataset();
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
    <DashboardShell title="내 주변 전기차 충전소" description="현재 위치 또는 모의 위치 기준으로 가까운 충전소를 거리순으로 정렬합니다.">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <NearbyStationFinder stations={stationLocations} metrics={locationMetrics} limit={16} />
        <aside className="space-y-6">
          <AdSlot slotId="nearby-side" minHeight={260} />
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-950">위치 데이터 안내</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              현재 버전은 mock 충전소 좌표를 사용합니다. 실제 공공 API 연결 후에는 수집된 위도와 경도를 기준으로 같은 계산을 적용합니다.
            </p>
          </section>
        </aside>
      </div>
    </DashboardShell>
  );
}
