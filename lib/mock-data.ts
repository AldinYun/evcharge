import { aggregateAirDataset } from "@/lib/pipeline/aggregator";
import type { AirDashboardDataset, AirQualityReading, MonitoringStation } from "@/lib/types";

const regions = [
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

export function createMockAirData() {
  const stations: MonitoringStation[] = [];
  const readings: AirQualityReading[] = [];
  const now = new Date();
  let index = 0;

  for (const [sido, sigungus] of regions) {
    for (const sigungu of sigungus) {
      for (let local = 0; local < 3; local += 1) {
        index += 1;
        const id = `AIR-${index.toString().padStart(4, "0")}`;
        const pmSeed = (index * 17 + local * 13) % 135;
        const pm10 = 18 + pmSeed;
        const pm25 = 8 + Math.round(pmSeed * 0.47);
        const humidity = 34 + ((index * 11) % 52);
        const windSpeed = 1 + ((index * 7) % 130) / 10;
        const measuredAt = new Date(now.getTime() - ((index * 9) % 210) * 60000);

        stations.push({
          id,
          name: `${sido} ${sigungu} 측정소 ${local + 1}`,
          sido,
          sigungu,
          address: `${sido} ${sigungu} 맑은공기로 ${100 + index}`,
          latitude: 33.2 + ((index * 37) % 600) / 100,
          longitude: 126.2 + ((index * 29) % 500) / 100
        });

        readings.push({
          id: `READ-${index.toString().padStart(5, "0")}`,
          stationId: id,
          measuredAt,
          pm10,
          pm25,
          o3: 0.018 + ((index * 3) % 60) / 1000,
          no2: 0.01 + ((index * 5) % 45) / 1000,
          co: 0.3 + ((index * 2) % 9) / 10,
          so2: 0.002 + ((index * 2) % 12) / 1000,
          humidity,
          windSpeed
        });
      }
    }
  }

  return { stations, readings };
}

export function getMockAirDashboardDataset(): AirDashboardDataset {
  const { stations, readings } = createMockAirData();
  return aggregateAirDataset(stations, readings);
}
