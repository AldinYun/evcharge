import type { DashboardDataset } from "@/lib/types";

const globalCache = globalThis as unknown as {
  evchargeAggregateCache?: {
    dataset: DashboardDataset;
    cachedAt: Date;
  };
};

export function cacheAggregate(dataset: DashboardDataset) {
  globalCache.evchargeAggregateCache = { dataset, cachedAt: new Date() };
}

export function getCachedAggregate() {
  return globalCache.evchargeAggregateCache;
}
