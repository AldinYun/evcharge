"use client";

import { useMemo, useState } from "react";

type Station = {
  id: string;
  name: string;
  address: string;
  sido: string;
  sigungu: string;
  latitude: number;
  longitude: number;
};

type Metric = {
  stationId: string;
  pm10: number;
  pm25: number;
  ventilationScore: number;
  ventilationStatus: string;
};

type UserLocation = { latitude: number; longitude: number; label: string };

const sampleLocations: UserLocation[] = [
  { label: "서울 시청", latitude: 37.5665, longitude: 126.978 },
  { label: "부산 해운대", latitude: 35.1631, longitude: 129.1635 },
  { label: "제주 공항", latitude: 33.5067, longitude: 126.493 }
];

function distanceKm(from: UserLocation, station: Station) {
  const radius = 6371;
  const rad = (degree: number) => (degree * Math.PI) / 180;
  const lat = rad(station.latitude - from.latitude);
  const lng = rad(station.longitude - from.longitude);
  const a =
    Math.sin(lat / 2) * Math.sin(lat / 2) +
    Math.cos(rad(from.latitude)) * Math.cos(rad(station.latitude)) * Math.sin(lng / 2) * Math.sin(lng / 2);
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function NearbyAirStationFinder({ stations, metrics, limit = 10 }: { stations: Station[]; metrics: Metric[]; limit?: number }) {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [status, setStatus] = useState("현재 위치 또는 모의 위치를 선택하세요.");
  const metricByStation = useMemo(() => new Map(metrics.map((metric) => [metric.stationId, metric])), [metrics]);

  const nearby = useMemo(() => {
    if (!location) return [];
    return stations
      .map((station) => ({ station, metric: metricByStation.get(station.id), distance: distanceKm(location, station) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  }, [limit, location, metricByStation, stations]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatus("이 브라우저에서는 위치 확인을 지원하지 않습니다.");
      return;
    }
    setStatus("현재 위치를 확인하는 중입니다.");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude, label: "내 현재 위치" });
        setStatus("현재 위치 기준 가까운 측정소를 정렬했습니다.");
      },
      () => setStatus("위치 권한을 사용할 수 없습니다. 모의 위치로 테스트할 수 있습니다."),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">내 주변 미세먼지 측정소</h2>
          <p className="mt-1 text-sm text-slate-600">{status}</p>
        </div>
        <button type="button" onClick={requestLocation} className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white">
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
              setStatus(`${sample.label} 기준 가까운 측정소를 정렬했습니다.`);
            }}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
          >
            {sample.label}
          </button>
        ))}
      </div>

      {location ? (
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {nearby.map(({ station, metric, distance }) => (
            <div key={station.id} className="rounded-md border border-slate-200 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-950">{station.name}</div>
                  <div className="mt-1 text-sm text-slate-600">{station.address}</div>
                </div>
                <div className="shrink-0 text-sm font-bold text-teal-700">{distance.toFixed(1)}km</div>
              </div>
              {metric ? (
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-600">
                  <span>PM10 {Math.round(metric.pm10)}</span>
                  <span>PM2.5 {Math.round(metric.pm25)}</span>
                  <span>환기 {metric.ventilationScore}점</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
