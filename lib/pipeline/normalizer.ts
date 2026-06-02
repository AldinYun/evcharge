import type { AirQualityReading, ExternalAirStation, MonitoringStation } from "@/lib/types";

const numeric = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const coordinate = (value: unknown, fallback: number) => {
  const parsed = numeric(value, fallback);
  return parsed >= -180 && parsed <= 180 ? parsed : fallback;
};

const stationId = (station: ExternalAirStation, index: number) =>
  `AIR-${station.sidoName}-${station.sigunguName ?? "unknown"}-${station.stationName}-${index}`.replace(/\s+/g, "-");

export function normalizeAirApiResponse(externalStations: ExternalAirStation[]) {
  const stations: MonitoringStation[] = [];
  const readings: AirQualityReading[] = [];

  externalStations.forEach((external, index) => {
    const id = stationId(external, index);
    const measuredAt = external.dataTime ? new Date(external.dataTime) : new Date();
    const station: MonitoringStation = {
      id,
      name: external.stationName,
      sido: external.sidoName,
      sigungu: external.sigunguName ?? external.addr.split(/\s+/)[1] ?? "미분류",
      address: external.addr,
      latitude: coordinate(external.latitude, 37.5665),
      longitude: coordinate(external.longitude, 126.978)
    };

    stations.push(station);
    readings.push({
      id: `READ-${id}`,
      stationId: id,
      measuredAt: Number.isNaN(measuredAt.getTime()) ? new Date() : measuredAt,
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
