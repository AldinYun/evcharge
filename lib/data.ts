import { getCachedAggregate } from "@/lib/cache";
import { getMockAirDashboardDataset } from "@/lib/mock-data";

export async function getDashboardDataset() {
  return getCachedAggregate()?.dataset ?? getMockAirDashboardDataset();
}

export async function getPipelineStatus() {
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
