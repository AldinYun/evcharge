"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { percent } from "@/lib/format";

type StationLocation = {
  id: string;
  name: string;
  address: string;
  sido: string;
  sigungu: string;
  latitude: number;
  longitude: number;
  operator: string;
};

type StationLocationMetric = {
  stationId: string;
  availabilityRate: number;
  congestionRate: number;
  fastChargerRate: number;
  chargingOpportunityScore: number;
  availableChargers: number;
  totalChargers: number;
};

type NearbyStationFinderProps = {
  stations: StationLocation[];
  metrics: StationLocationMetric[];
  limit?: number;
  compact?: boolean;
};

type UserLocation = {
  latitude: number;
  longitude: number;
  label: string;
};

const sampleLocations: UserLocation[] = [
  { label: "서울 시청", latitude: 37.5665, longitude: 126.978 },
  { label: "부산 해운대", latitude: 35.1631, longitude: 129.1635 },
  { label: "제주 공항", latitude: 33.5067, longitude: 126.493 }
];

function distanceKm(from: UserLocation, station: StationLocation) {
  const radius = 6371;
  const toRadians = (degree: number) => (degree * Math.PI) / 180;
  const latDistance = toRadians(station.latitude - from.latitude);
  const lonDistance = toRadians(station.longitude - from.longitude);
  const a =
    Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(station.latitude)) *
      Math.sin(lonDistance / 2) *
      Math.sin(lonDistance / 2);
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function NearbyStationFinder({ stations, metrics, limit = 8, compact = false }: NearbyStationFinderProps) {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [status, setStatus] = useState("현재 위치 또는 모의 위치를 선택하세요.");
  const metricByStation = useMemo(() => new Map(metrics.map((metric) => [metric.stationId, metric])), [metrics]);

  const nearbyStations = useMemo(() => {
    if (!location) return [];
    return stations
      .map((station) => ({
        station,
        metric: metricByStation.get(station.id),
        distance: distanceKm(location, station)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  }, [limit, location, metricByStation, stations]);

  const requestCurrentLocation = () => {
    if (!navigator.geolocation) {
      setStatus("이 브라우저에서는 위치 확인을 지원하지 않습니다.");
      return;
    }

    setStatus("현재 위치를 확인하는 중입니다.");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          label: "내 현재 위치"
        });
        setStatus("현재 위치 기준으로 가까운 충전소를 정렬했습니다.");
      },
      () => setStatus("위치 권한을 사용할 수 없습니다. 모의 위치로 테스트할 수 있습니다."),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">내 위치 기반 가까운 충전소</h2>
          <p className="mt-1 text-sm text-slate-600">{status}</p>
        </div>
        <button
          type="button"
          onClick={requestCurrentLocation}
          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
        >
          현재 위치 사용
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {sampleLocations.map((sample) => (
          <button
            key={sample.label}
            type="button"
            onClick={() => {
              setLocation(sample);
              setStatus(`${sample.label} 기준으로 가까운 충전소를 정렬했습니다.`);
            }}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
          >
            {sample.label}
          </button>
        ))}
      </div>

      {location ? (
        <div className={compact ? "mt-4 space-y-3" : "mt-5 grid grid-cols-1 gap-3 md:grid-cols-2"}>
          {nearbyStations.map(({ station, metric, distance }) => (
            <Link key={station.id} href={`/station/${station.id}`} className="block rounded-md border border-slate-200 p-3 hover:bg-slate-50">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-semibold text-slate-950">{station.name}</div>
                  <div className="mt-1 text-sm text-slate-600">{station.address}</div>
                </div>
                <div className="shrink-0 text-sm font-bold text-teal-700">{distance.toFixed(1)}km</div>
              </div>
              {metric ? (
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-600">
                  <span>가능 {metric.availableChargers}/{metric.totalChargers}</span>
                  <span>가능률 {percent(metric.availabilityRate)}</span>
                  <span>점수 {metric.chargingOpportunityScore}</span>
                </div>
              ) : null}
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
