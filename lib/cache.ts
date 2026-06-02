import type { AirDashboardDataset } from "@/lib/types";

const globalCache = globalThis as unknown as {
  airDashboardCache?: {
    dataset: AirDashboardDataset;
    cachedAt: Date;
  };
};

export function cacheAggregate(dataset: AirDashboardDataset) {
  globalCache.airDashboardCache = { dataset, cachedAt: new Date() };
}

export function getCachedAggregate() {
  return globalCache.airDashboardCache;
}
