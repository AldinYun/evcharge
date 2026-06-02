export type AirGrade = "good" | "moderate" | "bad" | "very_bad";
export type VentilationStatus = "recommended" | "caution" | "avoid";

export type MonitoringStation = {
  id: string;
  name: string;
  sido: string;
  sigungu: string;
  address: string;
  latitude: number;
  longitude: number;
};

export type AirQualityReading = {
  id: string;
  stationId: string;
  measuredAt: Date;
  pm10: number;
  pm25: number;
  o3: number;
  no2: number;
  co: number;
  so2: number;
  humidity: number;
  windSpeed: number;
};

export type AirCounts = {
  stationCount: number;
  goodCount: number;
  moderateCount: number;
  badCount: number;
  veryBadCount: number;
};

export type AirRegionMetric = AirCounts & {
  id: string;
  sido: string;
  sigungu?: string;
  avgPm10: number;
  avgPm25: number;
  avgO3: number;
  avgHumidity: number;
  avgWindSpeed: number;
  airGrade: AirGrade;
  ventilationStatus: VentilationStatus;
  ventilationScore: number;
  outdoorActivityScore: number;
  laundryScore: number;
  freshnessScore: number;
  measuredAt: Date;
};

export type StationAirMetric = {
  stationId: string;
  stationName: string;
  sido: string;
  sigungu: string;
  pm10: number;
  pm25: number;
  o3: number;
  humidity: number;
  windSpeed: number;
  airGrade: AirGrade;
  ventilationStatus: VentilationStatus;
  ventilationScore: number;
  outdoorActivityScore: number;
  laundryScore: number;
  freshnessScore: number;
  measuredAt: Date;
};

export type AirDashboardDataset = {
  stations: MonitoringStation[];
  readings: AirQualityReading[];
  national: AirRegionMetric;
  sidoMetrics: AirRegionMetric[];
  sigunguMetrics: AirRegionMetric[];
  stationMetrics: StationAirMetric[];
  lastMeasuredAt: Date;
};

export type ExternalAirStation = {
  stationCode?: string;
  stationName: string;
  sidoName: string;
  sigunguName?: string;
  addr: string;
  latitude?: string | number;
  longitude?: string | number;
  mangName?: string;
  pm10Value?: string | number;
  pm25Value?: string | number;
  o3Value?: string | number;
  no2Value?: string | number;
  coValue?: string | number;
  so2Value?: string | number;
  humidity?: string | number;
  windSpeed?: string | number;
  dataTime?: string;
};
