import {
  availabilityRate,
  chargingOpportunityScore,
  congestionRate,
  fastChargerRate,
  faultRate,
  freshnessScore,
  reliabilityScore
} from "@/lib/metrics";
import type { Charger, ChargerCounts, DashboardDataset, RegionMetric, Station, StationMetric } from "@/lib/types";

const emptyCounts = (): ChargerCounts => ({
  totalChargers: 0,
  availableChargers: 0,
  chargingChargers: 0,
  reservedChargers: 0,
  maintenanceChargers: 0,
  faultChargers: 0,
  unknownChargers: 0,
  fastChargers: 0,
  slowChargers: 0
});

function countChargers(chargers: Charger[]): ChargerCounts {
  return chargers.reduce((counts, charger) => {
    counts.totalChargers += 1;
    counts.fastChargers += charger.speed === "fast" ? 1 : 0;
    counts.slowChargers += charger.speed === "slow" ? 1 : 0;
    if (charger.status === "available") counts.availableChargers += 1;
    if (charger.status === "charging") counts.chargingChargers += 1;
    if (charger.status === "reserved") counts.reservedChargers += 1;
    if (charger.status === "maintenance") counts.maintenanceChargers += 1;
    if (charger.status === "fault") counts.faultChargers += 1;
    if (charger.status === "unknown") counts.unknownChargers += 1;
    return counts;
  }, emptyCounts());
}

function latestDate(dates: Date[]) {
  return new Date(Math.max(...dates.map((date) => date.getTime())));
}

function metricFields(counts: ChargerCounts, updatedAt: Date) {
  const available = availabilityRate(counts);
  const congestion = congestionRate(counts);
  const fault = faultRate(counts);
  const fast = fastChargerRate(counts);
  const reliability = reliabilityScore(fault);
  const freshness = freshnessScore(updatedAt);
  return {
    availabilityRate: available,
    congestionRate: congestion,
    faultRate: fault,
    fastChargerRate: fast,
    reliabilityScore: reliability,
    freshnessScore: freshness,
    chargingOpportunityScore: chargingOpportunityScore({
      availabilityRate: available,
      fastChargerRate: fast,
      reliabilityScore: reliability,
      freshnessScore: freshness
    })
  };
}

function buildRegionMetric(id: string, stations: Station[], chargers: Charger[], sido: string, sigungu?: string): RegionMetric {
  const counts = countChargers(chargers);
  const updatedAt = latestDate([...stations.map((station) => station.updatedAt), ...chargers.map((charger) => charger.updatedAt)]);
  return {
    id,
    sido,
    sigungu,
    stationCount: stations.length,
    ...counts,
    ...metricFields(counts, updatedAt),
    updatedAt
  };
}

export function aggregateDataset(stations: Station[], chargers: Charger[]): DashboardDataset {
  const chargersByStation = new Map<string, Charger[]>();
  for (const charger of chargers) {
    const list = chargersByStation.get(charger.stationId) ?? [];
    list.push(charger);
    chargersByStation.set(charger.stationId, list);
  }

  const stationMetrics: StationMetric[] = stations.map((station) => {
    const stationChargers = chargersByStation.get(station.id) ?? [];
    const counts = countChargers(stationChargers);
    const updatedAt = latestDate([station.updatedAt, ...stationChargers.map((charger) => charger.updatedAt)]);
    return {
      stationId: station.id,
      stationName: station.name,
      sido: station.sido,
      sigungu: station.sigungu,
      ...counts,
      ...metricFields(counts, updatedAt),
      updatedAt
    };
  });

  const sidoNames = Array.from(new Set(stations.map((station) => station.sido)));
  const sidoMetrics = sidoNames.map((sido) => {
    const regionStations = stations.filter((station) => station.sido === sido);
    const stationIds = new Set(regionStations.map((station) => station.id));
    return buildRegionMetric(`sido:${sido}`, regionStations, chargers.filter((charger) => stationIds.has(charger.stationId)), sido);
  });

  const sigunguKeys = Array.from(new Set(stations.map((station) => `${station.sido}|${station.sigungu}`)));
  const sigunguMetrics = sigunguKeys.map((key) => {
    const [sido, sigungu] = key.split("|");
    const regionStations = stations.filter((station) => station.sido === sido && station.sigungu === sigungu);
    const stationIds = new Set(regionStations.map((station) => station.id));
    return buildRegionMetric(`sigungu:${sido}:${sigungu}`, regionStations, chargers.filter((charger) => stationIds.has(charger.stationId)), sido, sigungu);
  });

  const national = buildRegionMetric("national", stations, chargers, "전국");
  return { stations, chargers, national, sidoMetrics, sigunguMetrics, stationMetrics, lastUpdatedAt: national.updatedAt };
}
