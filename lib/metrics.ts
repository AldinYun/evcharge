import type { ChargerCounts } from "@/lib/types";

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));
const safeRate = (numerator: number, denominator: number) => (denominator > 0 ? numerator / denominator : 0);

export function availabilityRate(counts: Pick<ChargerCounts, "availableChargers" | "totalChargers">) {
  return safeRate(counts.availableChargers, counts.totalChargers);
}

export function congestionRate(counts: Pick<ChargerCounts, "availableChargers" | "chargingChargers" | "reservedChargers">) {
  const activeChargers = counts.availableChargers + counts.chargingChargers + counts.reservedChargers;
  return safeRate(counts.chargingChargers, activeChargers);
}

export function faultRate(counts: Pick<ChargerCounts, "maintenanceChargers" | "faultChargers" | "unknownChargers" | "totalChargers">) {
  const unavailableChargers = counts.maintenanceChargers + counts.faultChargers + counts.unknownChargers;
  return safeRate(unavailableChargers, counts.totalChargers);
}

export function fastChargerRate(counts: Pick<ChargerCounts, "fastChargers" | "totalChargers">) {
  return safeRate(counts.fastChargers, counts.totalChargers);
}

export function reliabilityScore(rate: number) {
  return 1 - rate;
}

export function freshnessScore(updatedAt: Date, now = new Date()) {
  const minutes = Math.max(0, now.getTime() - updatedAt.getTime()) / 60000;
  if (minutes <= 15) return 1;
  if (minutes <= 60) return 0.7;
  if (minutes <= 180) return 0.4;
  return 0.1;
}

export function chargingOpportunityScore(input: {
  availabilityRate: number;
  fastChargerRate: number;
  reliabilityScore: number;
  freshnessScore: number;
}) {
  const score =
    input.availabilityRate * 45 +
    input.fastChargerRate * 20 +
    input.reliabilityScore * 25 +
    input.freshnessScore * 10;
  return Math.round(clamp(score));
}
