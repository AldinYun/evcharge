import { aggregateDataset } from "@/lib/pipeline/aggregator";
import type { Charger, ChargerStatus, DashboardDataset, Station } from "@/lib/types";

const regionSeed = [
  ["서울", ["강남구", "마포구", "송파구", "종로구", "영등포구"]],
  ["부산", ["해운대구", "수영구", "동래구", "부산진구"]],
  ["대구", ["수성구", "달서구", "중구", "북구"]],
  ["인천", ["연수구", "남동구", "부평구", "서구"]],
  ["광주", ["서구", "북구", "광산구"]],
  ["대전", ["유성구", "서구", "중구"]],
  ["울산", ["남구", "중구", "북구"]],
  ["세종", ["세종시"]],
  ["경기", ["수원시", "성남시", "고양시", "용인시", "화성시", "남양주시"]],
  ["강원", ["춘천시", "원주시", "강릉시"]],
  ["충북", ["청주시", "충주시", "제천시"]],
  ["충남", ["천안시", "아산시", "서산시"]],
  ["전북", ["전주시", "군산시", "익산시"]],
  ["전남", ["목포시", "여수시", "순천시"]],
  ["경북", ["포항시", "경주시", "구미시"]],
  ["경남", ["창원시", "김해시", "진주시"]],
  ["제주", ["제주시", "서귀포시"]]
] as const;

const statuses: ChargerStatus[] = ["available", "charging", "reserved", "maintenance", "fault", "unknown"];

function pickStatus(index: number): ChargerStatus {
  const weighted: ChargerStatus[] = [
    "available",
    "available",
    "available",
    "charging",
    "charging",
    "reserved",
    "maintenance",
    "fault",
    "unknown"
  ];
  return weighted[index % weighted.length] ?? statuses[index % statuses.length];
}

export function createMockStationsAndChargers() {
  const stations: Station[] = [];
  const chargers: Charger[] = [];
  const now = new Date();
  let stationIndex = 0;

  for (const [sido, sigungus] of regionSeed) {
    for (const sigungu of sigungus) {
      for (let local = 0; local < 4; local += 1) {
        stationIndex += 1;
        const stationId = `ST-${stationIndex.toString().padStart(4, "0")}`;
        const updatedAt = new Date(now.getTime() - ((stationIndex * 7) % 240) * 60000);
        stations.push({
          id: stationId,
          name: `${sido} ${sigungu} 충전스테이션 ${local + 1}`,
          address: `${sido} ${sigungu} 친환경로 ${100 + stationIndex}`,
          sido,
          sigungu,
          latitude: 33.2 + ((stationIndex * 37) % 600) / 100,
          longitude: 126.2 + ((stationIndex * 29) % 500) / 100,
          operator: stationIndex % 3 === 0 ? "한국전력" : stationIndex % 3 === 1 ? "환경공단" : "민간사업자",
          updatedAt
        });

        const chargerCount = 5 + (stationIndex % 5);
        for (let chargerLocal = 0; chargerLocal < chargerCount; chargerLocal += 1) {
          const chargerIndex = chargers.length + 1;
          const speed = chargerIndex % 4 === 0 || chargerIndex % 7 === 0 ? "fast" : "slow";
          chargers.push({
            id: `CH-${chargerIndex.toString().padStart(5, "0")}`,
            stationId,
            status: pickStatus(chargerIndex + stationIndex),
            speed,
            type: speed === "fast" ? "DC Combo" : "AC Slow",
            outputKw: speed === "fast" ? 100 + (chargerIndex % 3) * 50 : 7,
            updatedAt: new Date(updatedAt.getTime() - (chargerLocal % 3) * 600000)
          });
        }
      }
    }
  }

  return { stations, chargers };
}

export function getMockDashboardDataset(): DashboardDataset {
  const { stations, chargers } = createMockStationsAndChargers();
  return aggregateDataset(stations, chargers);
}
