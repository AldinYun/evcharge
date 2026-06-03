import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/AdSlot";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { NearbyAirStationFinder } from "@/components/location/NearbyAirStationFinder";
import { getDashboardDataset } from "@/lib/data";

export const metadata: Metadata = {
  title: "내 주변 미세먼지 측정소 | 위치 기반 환기 점수",
  description: "브라우저 현재 위치 기준으로 가까운 미세먼지 측정소와 환기 점수를 확인합니다."
};

export default async function NearbyPage() {
  const data = await getDashboardDataset();
  const stations = data.stations.map(({ id, name, address, sido, sigungu, latitude, longitude }) => ({
    id,
    name,
    address,
    sido,
    sigungu,
    latitude,
    longitude
  }));
  const metrics = data.stationMetrics.map(({ stationId, pm10, pm25, ventilationScore, ventilationStatus }) => ({
    stationId,
    pm10,
    pm25,
    ventilationScore,
    ventilationStatus
  }));

  return (
    <DashboardShell
      title="내 주변 미세먼지 측정소"
      description="현재 위치 또는 선택한 기준 지역으로 가까운 측정소를 거리순으로 정렬합니다."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <NearbyAirStationFinder stations={stations} metrics={metrics} limit={16} />
        <aside className="space-y-6">
          <AdSlot slotId="nearby-side" minHeight={260} />
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-950">위치 권한 안내</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              브라우저 위치 기능은 보안 정책상 HTTPS 또는 localhost에서 동작합니다. 서버 IP의 HTTP 주소로 접속한 경우에는 기준 지역 버튼을 사용하거나 HTTPS
              리버스 프록시를 설정해 주세요.
            </p>
          </section>
        </aside>
      </div>
    </DashboardShell>
  );
}
