import type { AirQualityReading, ExternalAirStation, MonitoringStation } from "@/lib/types";

const numeric = (value: unknown, fallback: number) => {
  if (value === undefined || value === null || value === "-" || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const coordinate = (value: unknown, fallback: number, min: number, max: number) => {
  const parsed = numeric(value, fallback);
  return parsed >= min && parsed <= max ? parsed : fallback;
};

const slug = (value: string) => value.replace(/\s+/g, "-").replace(/[^\p{L}\p{N}-]/gu, "");

const stationId = (station: ExternalAirStation) =>
  slug(`AIR-${station.sidoName}-${station.sigunguName ?? "unknown"}-${station.stationCode ?? station.stationName}`);

export function normalizeAirApiResponse(externalStations: ExternalAirStation[]) {
  const stations: MonitoringStation[] = [];
  const readings: AirQualityReading[] = [];
  const seenStations = new Set<string>();

  externalStations.forEach((external) => {
    const id = stationId(external);
    const measuredAt = external.dataTime ? new Date(external.dataTime) : new Date();
    const safeMeasuredAt = Number.isNaN(measuredAt.getTime()) ? new Date() : measuredAt;

    if (!seenStations.has(id)) {
      stations.push({
        id,
        name: external.stationName,
        sido: external.sidoName,
        sigungu: external.sigunguName ?? external.addr.split(/\s+/)[1] ?? "미분류",
        address: external.addr,
        latitude: coordinate(external.latitude, 37.5665, -90, 90),
        longitude: coordinate(external.longitude, 126.978, -180, 180)
      });
      seenStations.add(id);
    }

    readings.push({
      id: `READ-${id}-${safeMeasuredAt.getTime()}`,
      stationId: id,
      measuredAt: safeMeasuredAt,
      pm10: numeric(external.pm10Value, 35),
      pm25: numeric(external.pm25Value, 18),
      o3: numeric(external.o3Value, 0.03),
      no2: numeric(external.no2Value, 0.02),
      co: numeric(external.coValue, 0.5),
      so2: numeric(external.so2Value, 0.004),
      humidity: numeric(external.humidity, 50),
      windSpeed: numeric(external.windSpeed, 3.5)
    });
  });

  return { stations, readings };
}
