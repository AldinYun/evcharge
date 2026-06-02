import { getCachedAggregate } from "@/lib/cache";
import { getMockDashboardDataset } from "@/lib/mock-data";

export async function getDashboardDataset() {
  return getCachedAggregate()?.dataset ?? getMockDashboardDataset();
}

export async function getPipelineStatus() {
  const dataset = getMockDashboardDataset();
  return {
    status: "healthy" as const,
    lastSuccessAt: dataset.lastUpdatedAt,
    lastFailureAt: new Date(dataset.lastUpdatedAt.getTime() - 1000 * 60 * 60 * 27),
    stationCount: dataset.stations.length,
    chargerCount: dataset.chargers.length,
    message: "Mock collector 기준 정상 수집 대기"
  };
}
