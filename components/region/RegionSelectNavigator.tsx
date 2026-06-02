"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AirRegionMetric } from "@/lib/types";

export function RegionSelectNavigator({ regions }: { regions: AirRegionMetric[] }) {
  const router = useRouter();
  const sidoList = useMemo(() => Array.from(new Set(regions.map((region) => region.sido))).sort(), [regions]);
  const [sido, setSido] = useState(sidoList[0] ?? "");
  const sigunguList = useMemo(
    () =>
      regions
        .filter((region) => region.sido === sido && region.sigungu)
        .map((region) => region.sigungu as string)
        .sort(),
    [regions, sido]
  );
  const [sigungu, setSigungu] = useState("");

  const go = () => {
    if (!sido) return;
    if (sigungu) {
      router.push(`/region/${encodeURIComponent(sido)}/${encodeURIComponent(sigungu)}`);
      return;
    }
    router.push(`/region/${encodeURIComponent(sido)}`);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1">
          <label className="text-sm font-medium text-slate-600" htmlFor="sido-select">
            시도
          </label>
          <select
            id="sido-select"
            value={sido}
            onChange={(event) => {
              setSido(event.target.value);
              setSigungu("");
            }}
            className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            {sidoList.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-0 flex-1">
          <label className="text-sm font-medium text-slate-600" htmlFor="sigungu-select">
            시/군/구
          </label>
          <select
            id="sigungu-select"
            value={sigungu}
            onChange={(event) => setSigungu(event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">전체 보기</option>
            {sigunguList.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <button type="button" onClick={go} className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white">
          지역 보기
        </button>
      </div>
    </section>
  );
}
