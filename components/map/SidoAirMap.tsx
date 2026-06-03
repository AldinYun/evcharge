import { koreaSidoShapes, koreaSidoViewBox } from "@/lib/korea-sido-map";
import { microgram, ventilationStatusLabel } from "@/lib/format";
import type { AirRegionMetric } from "@/lib/types";

function fillColor(score: number) {
  if (score >= 75) return "#0f766e";
  if (score >= 55) return "#f59e0b";
  return "#e11d48";
}

function hrefForSido(sido: string) {
  return `/region/${encodeURIComponent(sido)}`;
}

function textShadowColor(score: number) {
  return score >= 55 ? "rgba(15, 23, 42, 0.35)" : "rgba(255, 255, 255, 0.3)";
}

export function SidoAirMap({ regions, cityRegions = [] }: { regions: AirRegionMetric[]; cityRegions?: AirRegionMetric[] }) {
  const bySido = new Map(regions.map((region) => [region.sido, region]));
  const cityRanking = [...cityRegions].sort((a, b) => b.ventilationScore - a.ventilationScore).slice(0, 12);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <h2 className="text-lg font-semibold text-slate-950">전국 시도별 대기질 지도</h2>
      <p className="mt-1 text-sm text-slate-600">
        시도 영역을 선택하면 지역 상세로 이동합니다. 색상은 생활 대기 점수 기준입니다.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(280px,1fr)_300px]">
        <div className="rounded-lg border border-slate-200 bg-sky-50 p-3">
          <svg viewBox={koreaSidoViewBox} role="img" aria-label="전국 시도별 대기질 점수 지도" className="h-auto w-full">
            <title>전국 시도별 대기질 점수 지도</title>
            <rect x="0" y="0" width="800" height="759" rx="18" fill="#f0f9ff" />
            <g transform="translate(32 8) scale(1.08)">
              {koreaSidoShapes.map((shape) => {
                const region = bySido.get(shape.sido);
                const score = region?.ventilationScore ?? 0;
                const fill = region ? fillColor(score) : "#cbd5e1";
                const shadow = textShadowColor(score);

                return (
                  <a key={shape.sido} href={hrefForSido(shape.sido)} aria-label={`${shape.sido} 대기질 점수 ${score}점`}>
                    <path
                      d={shape.d}
                      fill={fill}
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeLinejoin="round"
                      className="transition-opacity hover:opacity-80"
                    />
                    <text
                      x={shape.label.x}
                      y={shape.label.y - 5}
                      textAnchor="middle"
                      fontSize={shape.label.fontSize}
                      fontWeight="800"
                      fill="#ffffff"
                      pointerEvents="none"
                      style={{ textShadow: `0 1px 2px ${shadow}` }}
                    >
                      {shape.sido}
                    </text>
                    {region ? (
                      <text
                        x={shape.label.x}
                        y={shape.label.y + shape.label.fontSize}
                        textAnchor="middle"
                        fontSize={Math.max(12, shape.label.fontSize - 1)}
                        fontWeight="800"
                        fill="#ffffff"
                        pointerEvents="none"
                        style={{ textShadow: `0 1px 2px ${shadow}` }}
                      >
                        {score}
                      </text>
                    ) : null}
                  </a>
                );
              })}
            </g>
          </svg>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span className="h-3 w-3 rounded-sm bg-teal-700" />
              좋음
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span className="h-3 w-3 rounded-sm bg-amber-500" />
              보통
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span className="h-3 w-3 rounded-sm bg-rose-600" />
              주의
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-700">시/구 단위 대기질 상위 지역</h3>
          <div className="mt-3 space-y-2">
            {cityRanking.map((region) => (
              <a
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
                  <span>초미세 {microgram(region.avgPm25)}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
