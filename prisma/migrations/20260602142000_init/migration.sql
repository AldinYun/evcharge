CREATE TYPE "AirGrade" AS ENUM ('good', 'moderate', 'bad', 'very_bad');

CREATE TYPE "VentilationStatus" AS ENUM ('recommended', 'caution', 'avoid');

CREATE TABLE "MonitoringStation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sido" TEXT NOT NULL,
    "sigungu" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MonitoringStation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AirQualityReading" (
    "id" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "measuredAt" TIMESTAMP(3) NOT NULL,
    "pm10" DOUBLE PRECISION NOT NULL,
    "pm25" DOUBLE PRECISION NOT NULL,
    "o3" DOUBLE PRECISION NOT NULL,
    "no2" DOUBLE PRECISION NOT NULL,
    "co" DOUBLE PRECISION NOT NULL,
    "so2" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "windSpeed" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AirQualityReading_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AirRegionMetric" (
    "id" TEXT NOT NULL,
    "sido" TEXT NOT NULL,
    "sigungu" TEXT,
    "stationCount" INTEGER NOT NULL,
    "goodCount" INTEGER NOT NULL,
    "moderateCount" INTEGER NOT NULL,
    "badCount" INTEGER NOT NULL,
    "veryBadCount" INTEGER NOT NULL,
    "avgPm10" DOUBLE PRECISION NOT NULL,
    "avgPm25" DOUBLE PRECISION NOT NULL,
    "avgO3" DOUBLE PRECISION NOT NULL,
    "avgHumidity" DOUBLE PRECISION NOT NULL,
    "avgWindSpeed" DOUBLE PRECISION NOT NULL,
    "airGrade" "AirGrade" NOT NULL,
    "ventilationStatus" "VentilationStatus" NOT NULL,
    "ventilationScore" INTEGER NOT NULL,
    "outdoorActivityScore" INTEGER NOT NULL,
    "laundryScore" INTEGER NOT NULL,
    "freshnessScore" DOUBLE PRECISION NOT NULL,
    "measuredAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AirRegionMetric_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StationAirMetric" (
    "stationId" TEXT NOT NULL,
    "stationName" TEXT NOT NULL,
    "sido" TEXT NOT NULL,
    "sigungu" TEXT NOT NULL,
    "pm10" DOUBLE PRECISION NOT NULL,
    "pm25" DOUBLE PRECISION NOT NULL,
    "o3" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "windSpeed" DOUBLE PRECISION NOT NULL,
    "airGrade" "AirGrade" NOT NULL,
    "ventilationStatus" "VentilationStatus" NOT NULL,
    "ventilationScore" INTEGER NOT NULL,
    "outdoorActivityScore" INTEGER NOT NULL,
    "laundryScore" INTEGER NOT NULL,
    "freshnessScore" DOUBLE PRECISION NOT NULL,
    "measuredAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StationAirMetric_pkey" PRIMARY KEY ("stationId")
);

CREATE TABLE "RawAirApiResponse" (
    "id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RawAirApiResponse_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PipelineRun" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "finishedAt" TIMESTAMP(3),
    "sampleCount" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,

    CONSTRAINT "PipelineRun_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "referrer" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MonitoringStation_sido_sigungu_idx" ON "MonitoringStation"("sido", "sigungu");
CREATE INDEX "AirQualityReading_stationId_measuredAt_idx" ON "AirQualityReading"("stationId", "measuredAt");
CREATE INDEX "AirQualityReading_measuredAt_idx" ON "AirQualityReading"("measuredAt");
CREATE INDEX "AirRegionMetric_sido_sigungu_idx" ON "AirRegionMetric"("sido", "sigungu");
CREATE INDEX "PageView_path_idx" ON "PageView"("path");
CREATE INDEX "PageView_createdAt_idx" ON "PageView"("createdAt");

ALTER TABLE "AirQualityReading" ADD CONSTRAINT "AirQualityReading_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "MonitoringStation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
