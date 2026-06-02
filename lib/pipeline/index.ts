import { cacheAggregate } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { aggregateAirDataset } from "@/lib/pipeline/aggregator";
import { collectAirApiData } from "@/lib/pipeline/collector";
import { normalizeAirApiResponse } from "@/lib/pipeline/normalizer";

export async function runAirQualityPipeline() {
  const startedAt = new Date();
  let runId: string | undefined;

  try {
    const run = await prisma.pipelineRun.create({ data: { status: "running", startedAt } });
    runId = run.id;
  } catch {
    runId = undefined;
  }

  try {
    const collected = await collectAirApiData();
    const normalized = normalizeAirApiResponse(collected.stations);
    const aggregate = aggregateAirDataset(normalized.stations, normalized.readings);
    cacheAggregate(aggregate);

    try {
      await prisma.$transaction(async (tx) => {
        for (const raw of collected.rawResponses) {
          await tx.rawAirApiResponse.create({ data: { payload: raw as object } });
        }
        for (const station of normalized.stations) {
          await tx.monitoringStation.upsert({ where: { id: station.id }, update: station, create: station });
        }
        for (const reading of normalized.readings) {
          await tx.airQualityReading.upsert({ where: { id: reading.id }, update: reading, create: reading });
        }
        for (const metric of aggregate.sidoMetrics.concat(aggregate.sigunguMetrics)) {
          await tx.airRegionMetric.upsert({ where: { id: metric.id }, update: metric, create: metric });
        }
        for (const metric of aggregate.stationMetrics) {
          await tx.stationAirMetric.upsert({ where: { stationId: metric.stationId }, update: metric, create: metric });
        }
      });
    } catch (error) {
      if (runId) {
        await prisma.pipelineRun.update({
          where: { id: runId },
          data: {
            status: "partial_success",
            finishedAt: new Date(),
            sampleCount: normalized.readings.length,
            errorMessage: error instanceof Error ? error.message : "DB save failed"
          }
        });
      }
      return { status: "partial_success" as const, stationCount: normalized.stations.length, sampleCount: normalized.readings.length };
    }

    if (runId) {
      await prisma.pipelineRun.update({
        where: { id: runId },
        data: { status: "success", finishedAt: new Date(), sampleCount: normalized.readings.length }
      });
    }

    return { status: "success" as const, stationCount: normalized.stations.length, sampleCount: normalized.readings.length };
  } catch (error) {
    if (runId) {
      await prisma.pipelineRun.update({
        where: { id: runId },
        data: { status: "failed", finishedAt: new Date(), errorMessage: error instanceof Error ? error.message : "Unknown failure" }
      });
    }
    throw error;
  }
}
