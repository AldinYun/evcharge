import { unstable_noStore as noStore } from "next/cache";
import { getCachedAggregate } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { getMockAirDashboardDataset } from "@/lib/mock-data";
import { aggregateAirDataset } from "@/lib/pipeline/aggregator";
import type { AirQualityReading, MonitoringStation } from "@/lib/types";

async function getDatabaseDashboardDataset() {
  const stations = await prisma.monitoringStation.findMany();
  if (stations.length === 0) return null;

  const readings = await prisma.airQualityReading.findMany({
    orderBy: { measuredAt: "desc" },
    take: stations.length * 3
  });

  const latestReadingByStation = new Map<string, AirQualityReading>();
  for (const reading of readings) {
    if (!latestReadingByStation.has(reading.stationId)) {
      latestReadingByStation.set(reading.stationId, {
        id: reading.id,
        stationId: reading.stationId,
        measuredAt: reading.measuredAt,
        pm10: reading.pm10,
        pm25: reading.pm25,
        o3: reading.o3,
        no2: reading.no2,
        co: reading.co,
        so2: reading.so2,
        humidity: reading.humidity,
        windSpeed: reading.windSpeed
      });
    }
  }

  const normalizedStations: MonitoringStation[] = stations.map((station) => ({
    id: station.id,
    name: station.name,
    sido: station.sido,
    sigungu: station.sigungu,
    address: station.address,
    latitude: station.latitude,
    longitude: station.longitude
  }));

  const latestReadings = normalizedStations
    .map((station) => latestReadingByStation.get(station.id))
    .filter((reading): reading is AirQualityReading => reading !== undefined);

  if (latestReadings.length === 0) return null;
  return aggregateAirDataset(normalizedStations, latestReadings);
}

export async function getDashboardDataset() {
  noStore();

  try {
    const databaseDataset = await getDatabaseDashboardDataset();
    if (databaseDataset) return databaseDataset;
  } catch {
    const cached = getCachedAggregate();
    if (cached) return cached.dataset;
  }

  return getCachedAggregate()?.dataset ?? getMockAirDashboardDataset();
}

export async function getPipelineStatus() {
  noStore();

  try {
    const [lastSuccess, lastFailure, stationCount, sampleCount] = await Promise.all([
      prisma.pipelineRun.findFirst({ where: { status: { in: ["success", "partial_success"] } }, orderBy: { finishedAt: "desc" } }),
      prisma.pipelineRun.findFirst({ where: { status: "failed" }, orderBy: { finishedAt: "desc" } }),
      prisma.monitoringStation.count(),
      prisma.airQualityReading.count()
    ]);

    if (lastSuccess || stationCount > 0 || sampleCount > 0) {
      return {
        status: "healthy" as const,
        lastSuccessAt: lastSuccess?.finishedAt ?? lastSuccess?.startedAt ?? new Date(),
        lastFailureAt: lastFailure?.finishedAt ?? lastFailure?.startedAt ?? new Date(0),
        stationCount,
        sampleCount,
        message: "DB 저장 데이터 기준 수집 상태"
      };
    }
  } catch {
    // Fall back to mock status when DATABASE_URL is not reachable.
  }

  const dataset = getMockAirDashboardDataset();
  return {
    status: "healthy" as const,
    lastSuccessAt: dataset.lastMeasuredAt,
    lastFailureAt: new Date(dataset.lastMeasuredAt.getTime() - 1000 * 60 * 60 * 26),
    stationCount: dataset.stations.length,
    sampleCount: dataset.readings.length,
    message: "Mock AirKorea collector 기준 정상 수집 대기"
  };
}
