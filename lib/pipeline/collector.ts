import { createMockAirData } from "@/lib/mock-data";
import type { ExternalAirStation } from "@/lib/types";

export type CollectResult = {
  rawResponses: unknown[];
  stations: ExternalAirStation[];
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function withRetry<T>(task: () => Promise<T>, retries = 3): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      if (attempt < retries) await sleep(300 * attempt);
    }
  }
  throw lastError;
}

function mockExternalStations(): ExternalAirStation[] {
  const { stations, readings } = createMockAirData();
  const readingByStation = new Map(readings.map((reading) => [reading.stationId, reading]));
  return stations.map((station) => {
    const reading = readingByStation.get(station.id);
    return {
      stationName: station.name,
      sidoName: station.sido,
      sigunguName: station.sigungu,
      addr: station.address,
      latitude: station.latitude,
      longitude: station.longitude,
      pm10Value: reading?.pm10,
      pm25Value: reading?.pm25,
      o3Value: reading?.o3,
      no2Value: reading?.no2,
      coValue: reading?.co,
      so2Value: reading?.so2,
      humidity: reading?.humidity,
      windSpeed: reading?.windSpeed,
      dataTime: reading?.measuredAt.toISOString()
    };
  });
}

export async function collectAirApiData(): Promise<CollectResult> {
  const baseUrl = process.env.AIR_API_BASE_URL;
  const apiKey = process.env.AIR_API_KEY;

  if (!baseUrl || !apiKey) {
    const stations = mockExternalStations();
    return { rawResponses: [{ source: "mock-air", count: stations.length }], stations };
  }

  const rawResponses: unknown[] = [];
  const stations: ExternalAirStation[] = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    const url = new URL(baseUrl);
    url.searchParams.set("serviceKey", apiKey);
    url.searchParams.set("pageNo", String(page));
    url.searchParams.set("numOfRows", "500");
    url.searchParams.set("returnType", "json");

    const payload = await withRetry(async () => {
      const response = await fetch(url.toString(), { cache: "no-store" });
      if (!response.ok) throw new Error(`Air API failed: ${response.status}`);
      return response.json() as Promise<{ items?: ExternalAirStation[]; totalCount?: number }>;
    });

    rawResponses.push(payload);
    const items = payload.items ?? [];
    stations.push(...items);
    hasNext = items.length > 0 && stations.length < (payload.totalCount ?? stations.length);
    page += 1;
  }

  return { rawResponses, stations };
}
