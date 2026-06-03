"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { microgram, ventilationStatusLabel } from "@/lib/format";

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

type UserLocation = {
  latitude: number;
  longitude: number;
  label: string;
  accuracy?: number;
  savedAt?: number;
};

const sampleLocations: UserLocation[] = [
  { label: "서울 시청", latitude: 37.5665, longitude: 126.978 },
  { label: "수원 시청", latitude: 37.2636, longitude: 127.0286 },
  { label: "부산 해운대", latitude: 35.1631, longitude: 129.1635 },
  { label: "제주 공항", latitude: 33.5067, longitude: 126.493 }
];

const savedLocationKey = "airvent:user-location";
const savedLocationMaxAgeMs = 10 * 60 * 1000;
const maxTrustedAccuracyMeters = 10000;

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

function isLocationAllowedOrigin() {
  if (typeof window === "undefined") return false;
  if (window.isSecureContext) return true;
  return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
}

function isKoreaCoordinate(station: Station) {
  return station.latitude >= 32 && station.latitude <= 39.5 && station.longitude >= 124 && station.longitude <= 132;
}

function loadSavedLocation() {
  try {
    const raw = window.localStorage.getItem(savedLocationKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserLocation;
    if (!Number.isFinite(parsed.latitude) || !Number.isFinite(parsed.longitude) || !parsed.label) return null;
    if (!parsed.savedAt || Date.now() - parsed.savedAt > savedLocationMaxAgeMs) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveLocation(location: UserLocation) {
  try {
    window.localStorage.setItem(savedLocationKey, JSON.stringify({ ...location, savedAt: Date.now() }));
  } catch {
    // localStorage can be unavailable in restricted browser modes.
  }
}

function clearSavedLocation() {
  try {
    window.localStorage.removeItem(savedLocationKey);
  } catch {
    // localStorage can be unavailable in restricted browser modes.
  }
}

function accuracyText(accuracy?: number) {
  if (!accuracy) return "";
  if (accuracy >= 1000) return `위치 오차 약 ${(accuracy / 1000).toFixed(1)}km`;
  return `위치 오차 약 ${Math.round(accuracy)}m`;
}

function coordinateText(location: UserLocation) {
  return `브라우저 감지 좌표 ${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`;
}

function stationCoordinateText(station: Station) {
  return `측정소 좌표 ${station.latitude.toFixed(5)}, ${station.longitude.toFixed(5)}`;
}

export function NearbyAirStationFinder({ stations, metrics, limit = 10 }: { stations: Station[]; metrics: Metric[]; limit?: number }) {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [status, setStatus] = useState("현재 위치를 확인하면 가까운 측정소의 대기 상태를 보여드립니다.");
  const requestedRef = useRef(false);
  const metricByStation = useMemo(() => new Map(metrics.map((metric) => [metric.stationId, metric])), [metrics]);
  const validStations = useMemo(() => stations.filter(isKoreaCoordinate), [stations]);
  const invalidStationCount = stations.length - validStations.length;

  const nearby = useMemo(() => {
    if (!location) return [];
    return validStations
      .map((station) => ({ station, metric: metricByStation.get(station.id), distance: distanceKm(location, station) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  }, [limit, location, metricByStation, validStations]);

  const nearest = nearby[0];

  const useLocation = (nextLocation: UserLocation, nextStatus: string, shouldSave = true) => {
    setLocation(nextLocation);
    if (shouldSave) saveLocation(nextLocation);
    setStatus(nextStatus);
  };

  const requestLocation = () => {
    clearSavedLocation();
    setLocation(null);

    if (!isLocationAllowedOrigin()) {
      setStatus("브라우저 위치 기능은 HTTPS 또는 localhost에서만 동작합니다. https://aircheck.kr 주소로 접속해 주세요.");
      return;
    }

    if (!navigator.geolocation) {
      setStatus("이 브라우저는 위치 확인을 지원하지 않습니다. 아래 기준 지역을 선택해 가까운 측정소를 확인해 주세요.");
      return;
    }

    setStatus("현재 위치 권한을 확인하는 중입니다.");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          label: "현재 위치"
        };
        const accuracy = position.coords.accuracy;

        if (accuracy > maxTrustedAccuracyMeters) {
          setLocation(null);
          setStatus(
            `${accuracyText(accuracy)}로 정확도가 낮아 가까운 측정소를 확정하지 않았습니다. 휴대폰은 GPS를 켜고, 노트북은 위치 권한과 Wi-Fi를 켠 뒤 다시 확인해 주세요.`
          );
          return;
        }

        useLocation(nextLocation, `현재 위치 기준으로 가까운 측정소를 정렬했습니다. ${accuracyText(accuracy)}`);
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? "위치 권한이 거부되었습니다. 브라우저 권한에서 위치 접근을 허용한 뒤 다시 확인해 주세요."
            : "현재 위치를 가져오지 못했습니다. 잠시 뒤 다시 시도하거나 아래 기준 지역을 선택해 주세요.";
        setStatus(message);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    const saved = loadSavedLocation();
    if (saved) {
      setLocation(saved);
      setStatus(`${saved.label} 기준으로 가까운 측정소를 정렬했습니다. ${accuracyText(saved.accuracy)}`);
    }

    if (requestedRef.current) return;
    requestedRef.current = true;
    if (isLocationAllowedOrigin()) requestLocation();
  }, []);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">내 주변 미세먼지</h2>
          <p className="mt-1 text-sm text-slate-600">{status}</p>
          {location ? <p className="mt-1 text-xs text-slate-500">{coordinateText(location)}</p> : null}
          {invalidStationCount > 0 ? (
            <p className="mt-1 text-xs text-amber-700">
              좌표가 비정상인 측정소 {invalidStationCount}곳은 거리 계산에서 제외했습니다. 데이터 수집을 다시 실행하면 보정됩니다.
            </p>
          ) : null}
        </div>
        <button type="button" onClick={requestLocation} className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white">
          위치 다시 확인
        </button>
      </div>

      {nearest ? (
        <div className="mt-4 rounded-md border border-teal-200 bg-teal-50 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-sm font-medium text-teal-800">가장 가까운 측정소</div>
              <div className="mt-1 text-xl font-semibold text-slate-950">
                {nearest.station.sido} {nearest.station.sigungu}
              </div>
              <div className="mt-1 text-sm text-slate-600">{nearest.station.name}</div>
              <div className="mt-1 text-xs text-slate-500">{stationCoordinateText(nearest.station)}</div>
            </div>
            <div className="text-sm font-bold text-teal-700">{nearest.distance.toFixed(1)}km</div>
          </div>
          {nearest.metric ? (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <div className="text-xs text-slate-500">환기 상태</div>
                <div className="mt-1 font-semibold">{ventilationStatusLabel(nearest.metric.ventilationStatus)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">환기 점수</div>
                <div className="mt-1 font-semibold">{nearest.metric.ventilationScore}점</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">미세먼지</div>
                <div className="mt-1 font-semibold">{microgram(nearest.metric.pm10)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">초미세먼지</div>
                <div className="mt-1 font-semibold">{microgram(nearest.metric.pm25)}</div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {sampleLocations.map((sample) => (
          <button
            key={sample.label}
            type="button"
            onClick={() => useLocation(sample, `${sample.label} 기준으로 가까운 측정소를 정렬했습니다.`, false)}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
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
                  <span>미세먼지 {microgram(metric.pm10)}</span>
                  <span>초미세먼지 {microgram(metric.pm25)}</span>
                  <span>{ventilationStatusLabel(metric.ventilationStatus)}</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
