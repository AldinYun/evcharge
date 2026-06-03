import { createMockAirData } from "@/lib/mock-data";
import type { ExternalAirStation } from "@/lib/types";

export type CollectResult = {
  rawResponses: unknown[];
  stations: ExternalAirStation[];
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const sidoNames = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주", "세종"];

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

function endpoint(baseUrl: string, operation: string) {
  const trimmed = baseUrl.replace(/\/$/, "");
  return trimmed.endsWith(operation) ? trimmed : `${trimmed}/${operation}`;
}

function itemsFromPayload<T>(payload: unknown): T[] {
  const root = payload as {
    response?: { body?: { items?: T[] | { item?: T[] } } };
    items?: T[];
  };
  const bodyItems = root.response?.body?.items;
  if (Array.isArray(bodyItems)) return bodyItems;
  if (bodyItems && "item" in bodyItems && Array.isArray(bodyItems.item)) return bodyItems.item;
  if (Array.isArray(root.items)) return root.items;
  return [];
}

async function fetchAirKoreaItems<T>(baseUrl: string, operation: string, apiKey: string, params: Record<string, string>) {
  const url = new URL(endpoint(baseUrl, operation));
  url.searchParams.set("serviceKey", apiKey);
  url.searchParams.set("returnType", "json");
  url.searchParams.set("numOfRows", params.numOfRows ?? "1000");
  url.searchParams.set("pageNo", params.pageNo ?? "1");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const payload = await withRetry(async () => {
    const response = await fetch(url.toString(), { cache: "no-store" });
    if (!response.ok) throw new Error(`AirKorea API failed: ${response.status}`);
    return response.json() as Promise<unknown>;
  });

  return { payload, items: itemsFromPayload<T>(payload) };
}

type AirKoreaReadingItem = {
  stationName?: string;
  sidoName?: string;
  dataTime?: string;
  mangName?: string;
  pm10Value?: string;
  pm25Value?: string;
  o3Value?: string;
  no2Value?: string;
  coValue?: string;
  so2Value?: string;
};

type AirKoreaStationItem = {
  stationName?: string;
  addr?: string;
  dmX?: string;
  dmY?: string;
};

function sigunguFromAddress(address: string) {
  return address.trim().split(/\s+/)[1] ?? "미분류";
}

export async function collectAirApiData(): Promise<CollectResult> {
  const baseUrl = process.env.AIR_API_BASE_URL;
  const stationBaseUrl = process.env.AIR_STATION_API_BASE_URL;
  const apiKey = process.env.AIR_API_KEY;
  const shouldFetchStationInfo = process.env.AIR_FETCH_STATION_INFO !== "false";

  if (!baseUrl || !apiKey) {
    const stations = mockExternalStations();
    return { rawResponses: [{ source: "mock-air", count: stations.length }], stations };
  }

  const rawResponses: unknown[] = [];
  const stations: ExternalAirStation[] = [];
  const stationInfoBySidoName = new Map<string, AirKoreaStationItem>();

  for (const sidoName of sidoNames) {
    if (stationBaseUrl && shouldFetchStationInfo) {
      const stationInfo = await fetchAirKoreaItems<AirKoreaStationItem>(stationBaseUrl, "getMsrstnList", apiKey, {
        addr: sidoName,
        numOfRows: "1000",
        pageNo: "1"
      });
      rawResponses.push({ source: "station-info", sidoName, payload: stationInfo.payload });
      for (const item of stationInfo.items) {
        if (item.stationName) stationInfoBySidoName.set(`${sidoName}:${item.stationName}`, item);
      }
    }

    const reading = await fetchAirKoreaItems<AirKoreaReadingItem>(baseUrl, "getCtprvnRltmMesureDnsty", apiKey, {
      sidoName,
      ver: "1.0",
      numOfRows: "1000",
      pageNo: "1"
    });
    rawResponses.push({ source: "air-reading", sidoName, payload: reading.payload });

    for (const item of reading.items) {
      if (!item.stationName) continue;
      const stationInfo = stationInfoBySidoName.get(`${sidoName}:${item.stationName}`);
      const address = stationInfo?.addr ?? `${sidoName} ${item.stationName}`;
      stations.push({
        stationName: item.stationName,
        sidoName,
        sigunguName: sigunguFromAddress(address),
        addr: address,
        latitude: stationInfo?.dmX,
        longitude: stationInfo?.dmY,
        mangName: item.mangName,
        pm10Value: item.pm10Value,
        pm25Value: item.pm25Value,
        o3Value: item.o3Value,
        no2Value: item.no2Value,
        coValue: item.coValue,
        so2Value: item.so2Value,
        dataTime: item.dataTime
      });
    }
  }

  return { rawResponses, stations };
}
