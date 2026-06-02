export type ChargerStatus = "available" | "charging" | "reserved" | "maintenance" | "fault" | "unknown";
export type ChargerSpeed = "fast" | "slow";

export type Station = {
  id: string;
  name: string;
  address: string;
  sido: string;
  sigungu: string;
  latitude: number;
  longitude: number;
  operator: string;
  updatedAt: Date;
};

export type Charger = {
  id: string;
  stationId: string;
  status: ChargerStatus;
  speed: ChargerSpeed;
  type: string;
  outputKw: number;
  updatedAt: Date;
};

export type ChargerCounts = {
  totalChargers: number;
  availableChargers: number;
  chargingChargers: number;
  reservedChargers: number;
  maintenanceChargers: number;
  faultChargers: number;
  unknownChargers: number;
  fastChargers: number;
  slowChargers: number;
};

export type RegionMetric = ChargerCounts & {
  id: string;
  sido: string;
  sigungu?: string;
  stationCount: number;
  availabilityRate: number;
  congestionRate: number;
  faultRate: number;
  fastChargerRate: number;
  reliabilityScore: number;
  freshnessScore: number;
  chargingOpportunityScore: number;
  updatedAt: Date;
};

export type StationMetric = ChargerCounts & {
  stationId: string;
  stationName: string;
  sido: string;
  sigungu: string;
  availabilityRate: number;
  congestionRate: number;
  faultRate: number;
  fastChargerRate: number;
  reliabilityScore: number;
  freshnessScore: number;
  chargingOpportunityScore: number;
  updatedAt: Date;
};

export type DashboardDataset = {
  stations: Station[];
  chargers: Charger[];
  national: RegionMetric;
  sidoMetrics: RegionMetric[];
  sigunguMetrics: RegionMetric[];
  stationMetrics: StationMetric[];
  lastUpdatedAt: Date;
};

export type ExternalEvStation = {
  statId: string;
  statNm: string;
  addr: string;
  lat?: string | number;
  lng?: string | number;
  busiNm?: string;
  chargers: Array<{
    chgerId: string;
    stat?: string;
    chgerType?: string;
    output?: string | number;
    lastTsdt?: string;
  }>;
};
