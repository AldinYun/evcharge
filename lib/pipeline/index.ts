import { cacheAggregate } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { aggregateDataset } from "@/lib/pipeline/aggregator";
import { collectEvApiData } from "@/lib/pipeline/collector";
import { normalizeEvApiResponse } from "@/lib/pipeline/normalizer";

export async function runEvStatusPipeline() {
  const startedAt = new Date();
  let runId: string | undefined;

  try {
    const run = await prisma.pipelineRun.create({
      data: { status: "running", startedAt }
    });
    runId = run.id;
  } catch {
    runId = undefined;
  }

  try {
    const collected = await collectEvApiData();
    const normalized = normalizeEvApiResponse(collected.stations);
    const aggregate = aggregateDataset(normalized.stations, normalized.chargers);
    cacheAggregate(aggregate);

    try {
      await prisma.$transaction(async (tx) => {
        for (const raw of collected.rawResponses) {
          await tx.rawEvApiResponse.create({ data: { payload: raw as object } });
        }
        for (const station of normalized.stations) {
          await tx.station.upsert({
            where: { id: station.id },
            update: station,
            create: station
          });
        }
        for (const charger of normalized.chargers) {
          await tx.charger.upsert({
            where: { id: charger.id },
            update: charger,
            create: charger
          });
          await tx.chargerStatusSnapshot.create({
            data: { chargerId: charger.id, status: charger.status, capturedAt: charger.updatedAt }
          });
        }
        for (const metric of aggregate.sidoMetrics.concat(aggregate.sigunguMetrics)) {
          await tx.regionMetric.upsert({
            where: { id: metric.id },
            update: metric,
            create: metric
          });
        }
        for (const metric of aggregate.stationMetrics) {
          await tx.stationMetric.upsert({
            where: { stationId: metric.stationId },
            update: metric,
            create: metric
          });
        }
      });
    } catch (error) {
      if (runId) {
        await prisma.pipelineRun.update({
          where: { id: runId },
          data: {
            status: "partial_success",
            finishedAt: new Date(),
            stationCount: normalized.stations.length,
            chargerCount: normalized.chargers.length,
            errorMessage: error instanceof Error ? error.message : "DB save failed"
          }
        });
      }
      return { status: "partial_success" as const, stationCount: normalized.stations.length, chargerCount: normalized.chargers.length };
    }

    if (runId) {
      await prisma.pipelineRun.update({
        where: { id: runId },
        data: {
          status: "success",
          finishedAt: new Date(),
          stationCount: normalized.stations.length,
          chargerCount: normalized.chargers.length
        }
      });
    }

    return { status: "success" as const, stationCount: normalized.stations.length, chargerCount: normalized.chargers.length };
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
