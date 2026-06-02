import { airGrade, freshnessScore, laundryScore, outdoorActivityScore, ventilationScore, ventilationStatus } from "@/lib/metrics";
import type { AirDashboardDataset, AirQualityReading, AirRegionMetric, MonitoringStation, StationAirMetric } from "@/lib/types";

const avg = (values: number[]) => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0);
const latestDate = (dates: Date[]) => new Date(Math.max(...dates.map((date) => date.getTime())));

function stationMetric(station: MonitoringStation, reading: AirQualityReading): StationAirMetric {
  const fresh = freshnessScore(reading.measuredAt);
  return {
    stationId: station.id,
    stationName: station.name,
    sido: station.sido,
    sigungu: station.sigungu,
    pm10: reading.pm10,
    pm25: reading.pm25,
    o3: reading.o3,
    humidity: reading.humidity,
    windSpeed: reading.windSpeed,
    airGrade: airGrade(reading.pm10, reading.pm25),
    ventilationStatus: ventilationStatus(reading.pm10, reading.pm25, reading.windSpeed),
    ventilationScore: ventilationScore({ ...reading, freshnessScore: fresh }),
    outdoorActivityScore: outdoorActivityScore({ ...reading, freshnessScore: fresh }),
    laundryScore: laundryScore(reading),
    freshnessScore: fresh,
    measuredAt: reading.measuredAt
  };
}

function regionMetric(id: string, sido: string, stationMetrics: StationAirMetric[], sigungu?: string): AirRegionMetric {
  const avgPm10 = avg(stationMetrics.map((metric) => metric.pm10));
  const avgPm25 = avg(stationMetrics.map((metric) => metric.pm25));
  const avgO3 = avg(stationMetrics.map((metric) => metric.o3));
  const avgHumidity = avg(stationMetrics.map((metric) => metric.humidity));
  const avgWindSpeed = avg(stationMetrics.map((metric) => metric.windSpeed));
  const measuredAt = latestDate(stationMetrics.map((metric) => metric.measuredAt));
  const fresh = freshnessScore(measuredAt);
  const grades = stationMetrics.map((metric) => metric.airGrade);

  return {
    id,
    sido,
    sigungu,
    stationCount: stationMetrics.length,
    goodCount: grades.filter((grade) => grade === "good").length,
    moderateCount: grades.filter((grade) => grade === "moderate").length,
    badCount: grades.filter((grade) => grade === "bad").length,
    veryBadCount: grades.filter((grade) => grade === "very_bad").length,
    avgPm10,
    avgPm25,
    avgO3,
    avgHumidity,
    avgWindSpeed,
    airGrade: airGrade(avgPm10, avgPm25),
    ventilationStatus: ventilationStatus(avgPm10, avgPm25, avgWindSpeed),
    ventilationScore: ventilationScore({ pm10: avgPm10, pm25: avgPm25, humidity: avgHumidity, windSpeed: avgWindSpeed, freshnessScore: fresh }),
    outdoorActivityScore: outdoorActivityScore({ pm10: avgPm10, pm25: avgPm25, o3: avgO3, freshnessScore: fresh }),
    laundryScore: laundryScore({ pm10: avgPm10, pm25: avgPm25, humidity: avgHumidity, windSpeed: avgWindSpeed }),
    freshnessScore: fresh,
    measuredAt
  };
}

export function aggregateAirDataset(stations: MonitoringStation[], readings: AirQualityReading[]): AirDashboardDataset {
  const readingByStation = new Map(readings.map((reading) => [reading.stationId, reading]));
  const stationMetrics = stations
    .map((station) => {
      const reading = readingByStation.get(station.id);
      return reading ? stationMetric(station, reading) : null;
    })
    .filter((metric): metric is StationAirMetric => metric !== null);

  const sidoMetrics = Array.from(new Set(stationMetrics.map((metric) => metric.sido))).map((sido) =>
    regionMetric(`sido:${sido}`, sido, stationMetrics.filter((metric) => metric.sido === sido))
  );

  const sigunguMetrics = Array.from(new Set(stationMetrics.map((metric) => `${metric.sido}|${metric.sigungu}`))).map((key) => {
    const [sido, sigungu] = key.split("|");
    return regionMetric(
      `sigungu:${sido}:${sigungu}`,
      sido,
      stationMetrics.filter((metric) => metric.sido === sido && metric.sigungu === sigungu),
      sigungu
    );
  });

  const national = regionMetric("national", "전국", stationMetrics);
  return { stations, readings, national, sidoMetrics, sigunguMetrics, stationMetrics, lastMeasuredAt: national.measuredAt };
}
