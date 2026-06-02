import type { Charger, ChargerSpeed, ChargerStatus, ExternalEvStation, Station } from "@/lib/types";

const statusMap: Record<string, ChargerStatus> = {
  "1": "available",
  "2": "charging",
  "3": "reserved",
  "4": "maintenance",
  "5": "fault",
  "9": "unknown",
  available: "available",
  charging: "charging",
  reserved: "reserved",
  maintenance: "maintenance",
  fault: "fault",
  unknown: "unknown"
};

function parseAddress(address: string) {
  const [sido = "미분류", sigungu = "미분류"] = address.trim().split(/\s+/);
  return { sido, sigungu };
}

function validCoordinate(value: unknown, fallback: number) {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) && numeric >= -180 && numeric <= 180 ? numeric : fallback;
}

function normalizeSpeed(type: string | undefined, output: string | number | undefined): ChargerSpeed {
  const kw = Number(output ?? 0);
  if (kw >= 50) return "fast";
  if ((type ?? "").toLowerCase().includes("dc")) return "fast";
  return "slow";
}

export function normalizeEvApiResponse(externalStations: ExternalEvStation[]) {
  const stations: Station[] = [];
  const chargers: Charger[] = [];

  for (const external of externalStations) {
    const { sido, sigungu } = parseAddress(external.addr);
    const station: Station = {
      id: external.statId,
      name: external.statNm,
      address: external.addr,
      sido,
      sigungu,
      latitude: validCoordinate(external.lat, 37.5665),
      longitude: validCoordinate(external.lng, 126.978),
      operator: external.busiNm ?? "미상",
      updatedAt: new Date()
    };
    stations.push(station);

    for (const charger of external.chargers) {
      const updatedAt = charger.lastTsdt ? new Date(charger.lastTsdt) : station.updatedAt;
      const speed = normalizeSpeed(charger.chgerType, charger.output);
      chargers.push({
        id: `${external.statId}-${charger.chgerId}`,
        stationId: external.statId,
        status: statusMap[String(charger.stat ?? "unknown")] ?? "unknown",
        speed,
        type: charger.chgerType ?? (speed === "fast" ? "DC" : "AC"),
        outputKw: Number(charger.output ?? (speed === "fast" ? 50 : 7)),
        updatedAt: Number.isNaN(updatedAt.getTime()) ? station.updatedAt : updatedAt
      });
    }
  }

  return { stations, chargers };
}
