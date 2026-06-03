import Link from "next/link";
import { microgram, ventilationStatusLabel } from "@/lib/format";
import type { AirRegionMetric } from "@/lib/types";

const positions: Record<string, { x: number; y: number }> = {
  서울: { x: 45, y: 16 },
  인천: { x: 31, y: 18 },
  경기: { x: 47, y: 25 },
  강원: { x: 66, y: 18 },
  충북: { x: 55, y: 39 },
  충남: { x: 38, y: 44 },
  세종: { x: 46, y: 45 },
  대전: { x: 48, y: 51 },
  경북: { x: 68, y: 50 },
  대구: { x: 66, y: 61 },
  전북: { x: 43, y: 62 },
  광주: { x: 39, y: 75 },
  전남: { x: 37, y: 83 },
  경남: { x: 59, y: 74 },
  울산: { x: 75, y: 70 },
  부산: { x: 70, y: 79 },
  제주: { x: 27, y: 94 }
};

function fillClass(score: number) {
  if (score >= 75) return "bg-teal-600 hover:bg-teal-700";
  if (score >= 55) return "bg-amber-400 hover:bg-amber-500";
  return "bg-rose-500 hover:bg-rose-600";
}

export function SidoAirMap({ regions, cityRegions = [] }: { regions: AirRegionMetric[]; cityRegions?: AirRegionMetric[] }) {
  const bySido = new Map(regions.map((region) => [region.sido, region]));
  const cityRanking = [...cityRegions].sort((a, b) => b.ventilationScore - a.ventilationScore).slice(0, 12);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <h2 className="text-lg font-semibold text-slate-950">전국 시도별 환기 지도</h2>
      <p className="mt-1 text-sm text-slate-600">시도 마커를 선택하면 지역 상세로 이동합니다.</p>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(260px,1fr)_300px]">
        <div className="relative aspect-[3/4] min-h-[440px] overflow-hidden rounded-lg border border-slate-200 bg-sky-50">
          <div className="absolute left-[18%] top-[6%] h-[86%] w-[64%] rounded-[45%_55%_48%_52%] border border-slate-300 bg-white shadow-inner" />
          <div className="absolute left-[18%] top-[86%] h-[12%] w-[25%] rounded-[60%] border border-slate-300 bg-white shadow-inner" />
          {Object.entries(positions).map(([sido, position]) => {
            const region = bySido.get(sido);
            if (!region) return null;
            return (
              <Link
                key={sido}
                href={`/region/${encodeURIComponent(sido)}`}
                className={`absolute z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full text-xs font-semibold text-white shadow transition ${fillClass(
                  region.ventilationScore
                )}`}
                style={{ left: `${position.x}%`, top: `${position.y}%` }}
                title={`${sido} ${region.ventilationScore}점`}
              >
                <span>{sido}</span>
                <span>{region.ventilationScore}</span>
              </Link>
            );
          })}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-700">시/구 단위 환기 상위 지역</h3>
          <div className="mt-3 space-y-2">
            {cityRanking.map((region) => (
              <Link
                key={region.id}
                href={`/region/${encodeURIComponent(region.sido)}/${encodeURIComponent(region.sigungu ?? "")}`}
                className="block rounded-md border border-slate-200 p-3 hover:bg-slate-50"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">
                    {region.sido} {region.sigungu}
                  </span>
                  <span className="text-sm font-bold text-teal-700">{region.ventilationScore}점</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <span>{ventilationStatusLabel(region.ventilationStatus)}</span>
                  <span>PM2.5 {microgram(region.avgPm25)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
