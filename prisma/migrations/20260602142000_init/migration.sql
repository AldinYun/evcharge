CREATE TYPE "ChargerStatus" AS ENUM ('available', 'charging', 'reserved', 'maintenance', 'fault', 'unknown');

CREATE TYPE "ChargerSpeed" AS ENUM ('fast', 'slow');

CREATE TABLE "Station" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "sido" TEXT NOT NULL,
    "sigungu" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "operator" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Charger" (
    "id" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "status" "ChargerStatus" NOT NULL,
    "speed" "ChargerSpeed" NOT NULL,
    "type" TEXT NOT NULL,
    "outputKw" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Charger_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChargerStatusSnapshot" (
    "id" TEXT NOT NULL,
    "chargerId" TEXT NOT NULL,
    "status" "ChargerStatus" NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChargerStatusSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RegionMetric" (
    "id" TEXT NOT NULL,
    "sido" TEXT NOT NULL,
    "sigungu" TEXT,
    "stationCount" INTEGER NOT NULL,
    "totalChargers" INTEGER NOT NULL,
    "availableChargers" INTEGER NOT NULL,
    "chargingChargers" INTEGER NOT NULL,
    "reservedChargers" INTEGER NOT NULL,
    "maintenanceChargers" INTEGER NOT NULL,
    "faultChargers" INTEGER NOT NULL,
    "unknownChargers" INTEGER NOT NULL,
    "fastChargers" INTEGER NOT NULL,
    "slowChargers" INTEGER NOT NULL,
    "availabilityRate" DOUBLE PRECISION NOT NULL,
    "congestionRate" DOUBLE PRECISION NOT NULL,
    "faultRate" DOUBLE PRECISION NOT NULL,
    "fastChargerRate" DOUBLE PRECISION NOT NULL,
    "reliabilityScore" DOUBLE PRECISION NOT NULL,
    "freshnessScore" DOUBLE PRECISION NOT NULL,
    "chargingOpportunityScore" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegionMetric_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StationMetric" (
    "stationId" TEXT NOT NULL,
    "stationName" TEXT NOT NULL,
    "sido" TEXT NOT NULL,
    "sigungu" TEXT NOT NULL,
    "totalChargers" INTEGER NOT NULL,
    "availableChargers" INTEGER NOT NULL,
    "chargingChargers" INTEGER NOT NULL,
    "reservedChargers" INTEGER NOT NULL,
    "maintenanceChargers" INTEGER NOT NULL,
    "faultChargers" INTEGER NOT NULL,
    "unknownChargers" INTEGER NOT NULL,
    "fastChargers" INTEGER NOT NULL,
    "slowChargers" INTEGER NOT NULL,
    "availabilityRate" DOUBLE PRECISION NOT NULL,
    "congestionRate" DOUBLE PRECISION NOT NULL,
    "faultRate" DOUBLE PRECISION NOT NULL,
    "fastChargerRate" DOUBLE PRECISION NOT NULL,
    "reliabilityScore" DOUBLE PRECISION NOT NULL,
    "freshnessScore" DOUBLE PRECISION NOT NULL,
    "chargingOpportunityScore" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StationMetric_pkey" PRIMARY KEY ("stationId")
);

CREATE TABLE "RawEvApiResponse" (
    "id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RawEvApiResponse_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PipelineRun" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "finishedAt" TIMESTAMP(3),
    "stationCount" INTEGER NOT NULL DEFAULT 0,
    "chargerCount" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,

    CONSTRAINT "PipelineRun_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Station_sido_sigungu_idx" ON "Station"("sido", "sigungu");
CREATE INDEX "Charger_stationId_idx" ON "Charger"("stationId");
CREATE INDEX "Charger_status_idx" ON "Charger"("status");
CREATE INDEX "ChargerStatusSnapshot_chargerId_capturedAt_idx" ON "ChargerStatusSnapshot"("chargerId", "capturedAt");
CREATE INDEX "RegionMetric_sido_sigungu_idx" ON "RegionMetric"("sido", "sigungu");

ALTER TABLE "Charger" ADD CONSTRAINT "Charger_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChargerStatusSnapshot" ADD CONSTRAINT "ChargerStatusSnapshot_chargerId_fkey" FOREIGN KEY ("chargerId") REFERENCES "Charger"("id") ON DELETE CASCADE ON UPDATE CASCADE;
