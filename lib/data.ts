import { unstable_noStore as noStore } from "next/cache";
import { getCachedAggregate } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { getMockAirDashboardDataset } from "@/lib/mock-data";
import { ventilationScore } from "@/lib/metrics";
import { aggregateAirDataset } from "@/lib/pipeline/aggregator";
import type { AirQualityReading, MonitoringStation } from "@/lib/types";

async function getDatabaseDashboardDataset() {
  const [stations, lastPipelineRun] = await Promise.all([
    prisma.monitoringStation.findMany(),
    prisma.pipelineRun.findFirst({
      where: { status: { in: ["success", "partial_success"] } },
      orderBy: { finishedAt: "desc" }
    })
  ]);
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
  const dataset = aggregateAirDataset(normalizedStations, latestReadings);
  return {
    ...dataset,
    lastCollectedAt: lastPipelineRun?.finishedAt ?? lastPipelineRun?.startedAt ?? dataset.lastMeasuredAt
  };
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

export type AirTrendPoint = {
  time: string;
  measuredAt: Date;
  pm10: number;
  pm25: number;
  ventilationScore: number;
};

function hourKey(date: Date) {
  const key = new Date(date);
  key.setMinutes(0, 0, 0);
  return key.toISOString();
}

function formatTrendHour(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", hour: "2-digit", hour12: false }).format(date);
}

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

export async function getRegionTrend(sido: string, sigungu?: string): Promise<AirTrendPoint[]> {
  noStore();

  try {
    const since = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const stations = await prisma.monitoringStation.findMany({
      where: { sido, ...(sigungu ? { sigungu } : {}) },
      select: { id: true }
    });
    const stationIds = stations.map((station) => station.id);
    if (!stationIds.length) return [];

    const readings = await prisma.airQualityReading.findMany({
      where: { stationId: { in: stationIds }, measuredAt: { gte: since } },
      orderBy: { measuredAt: "asc" }
    });

    const buckets = new Map<string, typeof readings>();
    for (const reading of readings) {
      const key = hourKey(reading.measuredAt);
      buckets.set(key, [...(buckets.get(key) ?? []), reading]);
    }

    return [...buckets.entries()]
      .map(([key, bucket]) => {
        const measuredAt = new Date(key);
        const pm10 = average(bucket.map((reading) => reading.pm10));
        const pm25 = average(bucket.map((reading) => reading.pm25));
        const humidity = average(bucket.map((reading) => reading.humidity));
        const windSpeed = average(bucket.map((reading) => reading.windSpeed));
        return {
          time: `${formatTrendHour(measuredAt)}시`,
          measuredAt,
          pm10: Math.round(pm10),
          pm25: Math.round(pm25),
          ventilationScore: ventilationScore({ pm10, pm25, humidity, windSpeed, freshnessScore: 1 })
        };
      })
      .slice(-24);
  } catch {
    return [];
  }
}

export async function getPipelineStatus() {
  noStore();

  try {
    const [latestRun, lastSuccess, lastFailure, stationCount, sampleCount] = await Promise.all([
      prisma.pipelineRun.findFirst({ orderBy: { startedAt: "desc" } }),
      prisma.pipelineRun.findFirst({ where: { status: { in: ["success", "partial_success"] } }, orderBy: { finishedAt: "desc" } }),
      prisma.pipelineRun.findFirst({ where: { status: "failed" }, orderBy: { finishedAt: "desc" } }),
      prisma.monitoringStation.count(),
      prisma.airQualityReading.count()
    ]);

    if (latestRun || lastSuccess || stationCount > 0 || sampleCount > 0) {
      return {
        status: "healthy" as const,
        latestRunAt: latestRun?.finishedAt ?? latestRun?.startedAt ?? lastSuccess?.finishedAt ?? lastSuccess?.startedAt ?? new Date(),
        latestRunStatus: latestRun?.status ?? "unknown",
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
    latestRunAt: dataset.lastCollectedAt ?? dataset.lastMeasuredAt,
    latestRunStatus: "mock",
    lastSuccessAt: dataset.lastMeasuredAt,
    lastFailureAt: new Date(dataset.lastMeasuredAt.getTime() - 1000 * 60 * 60 * 26),
    stationCount: dataset.stations.length,
    sampleCount: dataset.readings.length,
    message: "Mock AirKorea collector 기준 정상 수집 대기"
  };
}

export async function getAccessAnalytics() {
  noStore();
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  try {
    const [totalViews, views24h, views7d, topPages] = await Promise.all([
      prisma.pageView.count(),
      prisma.pageView.count({ where: { createdAt: { gte: since24h } } }),
      prisma.pageView.count({ where: { createdAt: { gte: since7d } } }),
      prisma.pageView.groupBy({
        by: ["path"],
        _count: { path: true },
        orderBy: { _count: { path: "desc" } },
        take: 10
      })
    ]);

    return {
      totalViews,
      views24h,
      views7d,
      topPages: topPages.map((page) => ({ path: page.path, count: page._count.path }))
    };
  } catch {
    return { totalViews: 0, views24h: 0, views7d: 0, topPages: [] };
  }
}
