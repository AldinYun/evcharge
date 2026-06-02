import { createMockStationsAndChargers } from "@/lib/mock-data";
import type { ExternalEvStation } from "@/lib/types";

export type CollectResult = {
  rawResponses: unknown[];
  stations: ExternalEvStation[];
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function withRetry<T>(task: () => Promise<T>, retries = 3): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      if (attempt < retries) await sleep(250 * attempt);
    }
  }
  throw lastError;
}

function mockExternalStations(): ExternalEvStation[] {
  const { stations, chargers } = createMockStationsAndChargers();
  return stations.map((station) => ({
    statId: station.id,
    statNm: station.name,
    addr: station.address,
    lat: station.latitude,
    lng: station.longitude,
    busiNm: station.operator,
    chargers: chargers
      .filter((charger) => charger.stationId === station.id)
      .map((charger) => ({
        chgerId: charger.id,
        stat: charger.status,
        chgerType: charger.type,
        output: charger.outputKw,
        lastTsdt: charger.updatedAt.toISOString()
      }))
  }));
}

export async function collectEvApiData(): Promise<CollectResult> {
  const baseUrl = process.env.EV_API_BASE_URL;
  const apiKey = process.env.EV_API_KEY;

  if (!baseUrl || !apiKey) {
    const stations = mockExternalStations();
    return { rawResponses: [{ source: "mock", count: stations.length }], stations };
  }

  const rawResponses: unknown[] = [];
  const stations: ExternalEvStation[] = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    const url = new URL(baseUrl);
    url.searchParams.set("serviceKey", apiKey);
    url.searchParams.set("pageNo", String(page));
    url.searchParams.set("numOfRows", "500");

    const payload = await withRetry(async () => {
      const response = await fetch(url.toString(), { cache: "no-store" });
      if (!response.ok) throw new Error(`EV API failed: ${response.status}`);
      return response.json() as Promise<{ items?: ExternalEvStation[]; totalCount?: number }>;
    });

    rawResponses.push(payload);
    const items = payload.items ?? [];
    stations.push(...items);
    hasNext = items.length > 0 && stations.length < (payload.totalCount ?? stations.length);
    page += 1;
  }

  return { rawResponses, stations };
}
