import { microgram, ventilationStatusLabel } from "@/lib/format";
import type { AirRegionMetric } from "@/lib/types";

type SidoShape = {
  sido: string;
  path: string;
  label: { x: number; y: number };
};

const shapes: SidoShape[] = [
  { sido: "서울", path: "M214 105 L245 98 L260 119 L249 145 L218 149 L199 127 Z", label: { x: 228, y: 127 } },
  { sido: "인천", path: "M160 112 L198 101 L210 126 L194 154 L157 148 L142 126 Z", label: { x: 178, y: 131 } },
  { sido: "경기", path: "M198 55 L286 43 L340 91 L324 174 L272 207 L205 184 L184 151 L216 147 L249 145 L260 119 L245 98 L214 105 L199 127 L194 154 L157 148 L143 118 Z", label: { x: 274, y: 153 } },
  { sido: "강원", path: "M286 43 L430 38 L506 94 L480 177 L403 211 L324 174 L340 91 Z", label: { x: 412, y: 126 } },
  { sido: "충북", path: "M272 207 L324 174 L403 211 L394 286 L323 318 L264 277 Z", label: { x: 333, y: 253 } },
  { sido: "충남", path: "M163 213 L264 190 L272 207 L264 277 L294 333 L217 354 L159 320 L130 263 Z", label: { x: 210, y: 290 } },
  { sido: "세종", path: "M245 278 L271 272 L286 294 L274 318 L247 315 L235 295 Z", label: { x: 260, y: 298 } },
  { sido: "대전", path: "M256 330 L295 318 L319 344 L300 378 L260 372 L242 349 Z", label: { x: 284, y: 353 } },
  { sido: "경북", path: "M394 286 L480 177 L548 238 L536 388 L469 453 L382 421 L352 345 Z", label: { x: 463, y: 331 } },
  { sido: "대구", path: "M398 409 L454 395 L482 430 L459 471 L410 466 L382 431 Z", label: { x: 436, y: 434 } },
  { sido: "전북", path: "M217 354 L294 333 L352 345 L382 421 L336 472 L239 470 L176 423 Z", label: { x: 285, y: 420 } },
  { sido: "광주", path: "M207 508 L249 495 L278 522 L259 558 L216 557 L194 532 Z", label: { x: 238, y: 531 } },
  { sido: "전남", path: "M176 423 L239 470 L336 472 L365 548 L315 642 L212 654 L120 602 L102 512 Z", label: { x: 252, y: 587 } },
  { sido: "경남", path: "M336 472 L382 421 L410 466 L459 471 L501 520 L470 610 L382 631 L315 642 L365 548 Z", label: { x: 402, y: 556 } },
  { sido: "울산", path: "M501 520 L540 495 L573 522 L558 567 L512 566 L489 540 Z", label: { x: 528, y: 539 } },
  { sido: "부산", path: "M470 610 L512 566 L558 567 L574 612 L538 657 L486 649 Z", label: { x: 526, y: 616 } },
  { sido: "제주", path: "M138 731 C185 705 252 708 291 735 C257 768 181 773 138 731 Z", label: { x: 215, y: 739 } }
];

function fillColor(score: number) {
  if (score >= 75) return "#0f766e";
  if (score >= 55) return "#f59e0b";
  return "#e11d48";
}

function textColor(score: number) {
  return score >= 55 ? "#ffffff" : "#ffffff";
}

function hrefForSido(sido: string) {
  return `/region/${encodeURIComponent(sido)}`;
}

export function SidoAirMap({ regions, cityRegions = [] }: { regions: AirRegionMetric[]; cityRegions?: AirRegionMetric[] }) {
  const bySido = new Map(regions.map((region) => [region.sido, region]));
  const cityRanking = [...cityRegions].sort((a, b) => b.ventilationScore - a.ventilationScore).slice(0, 12);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <h2 className="text-lg font-semibold text-slate-950">전국 시도별 환기 지도</h2>
      <p className="mt-1 text-sm text-slate-600">시도 영역을 선택하면 지역 상세로 이동합니다. 색상은 환기 점수 기준입니다.</p>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(280px,1fr)_300px]">
        <div className="rounded-lg border border-slate-200 bg-sky-50 p-3">
          <svg viewBox="80 20 520 780" role="img" aria-label="전국 시도별 환기 점수 지도" className="h-auto w-full">
            <title>전국 시도별 환기 점수 지도</title>
            <rect x="80" y="20" width="520" height="780" rx="24" fill="#f0f9ff" />
            {shapes.map((shape) => {
              const region = bySido.get(shape.sido);
              const score = region?.ventilationScore ?? 0;
              return (
                <a key={shape.sido} href={hrefForSido(shape.sido)} aria-label={`${shape.sido} 환기 점수 ${score}점`}>
                  <path
                    d={shape.path}
                    fill={region ? fillColor(score) : "#cbd5e1"}
                    stroke="#ffffff"
                    strokeWidth="5"
                    strokeLinejoin="round"
                    className="transition-opacity hover:opacity-80"
                  />
                  <text
                    x={shape.label.x}
                    y={shape.label.y - 4}
                    textAnchor="middle"
                    fontSize="18"
                    fontWeight="700"
                    fill={textColor(score)}
                    pointerEvents="none"
                  >
                    {shape.sido}
                  </text>
                  {region ? (
                    <text
                      x={shape.label.x}
                      y={shape.label.y + 19}
                      textAnchor="middle"
                      fontSize="17"
                      fontWeight="800"
                      fill={textColor(score)}
                      pointerEvents="none"
                    >
                      {score}
                    </text>
                  ) : null}
                </a>
              );
            })}
          </svg>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-sm bg-teal-700" />
              좋음
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-sm bg-amber-500" />
              보통
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-sm bg-rose-600" />
              주의
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-700">시/구 단위 환기 상위 지역</h3>
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
                  <span>PM2.5 {microgram(region.avgPm25)}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
