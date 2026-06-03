import Link from "next/link";
import { microgram, number, ventilationStatusLabel } from "@/lib/format";
import type { AirRegionMetric } from "@/lib/types";

type Metric = "ventilationScore" | "avgPm10" | "avgPm25" | "outdoorActivityScore" | "laundryScore";

export function AirRankingTable({ regions, metric, title }: { regions: AirRegionMetric[]; metric: Metric; title: string }) {
  const value = (region: AirRegionMetric) => {
    if (metric === "avgPm10") return microgram(region.avgPm10);
    if (metric === "avgPm25") return microgram(region.avgPm25);
    return `${number(region[metric])}점`;
  };

  const hrefFor = (region: AirRegionMetric) =>
    region.sigungu ? `/region/${encodeURIComponent(region.sido)}/${encodeURIComponent(region.sigungu)}` : `/region/${encodeURIComponent(region.sido)}`;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <h2 className="mb-4 text-lg font-semibold text-slate-950">{title}</h2>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="py-3 pr-3">순위</th>
              <th className="py-3 pr-3">지역</th>
              <th className="py-3 pr-3">지표</th>
              <th className="py-3 pr-3">미세먼지</th>
              <th className="py-3 pr-3">초미세먼지</th>
              <th className="py-3">환기 상태</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((region, index) => (
              <tr key={region.id} className="border-b border-slate-100 last:border-0">
                <td className="py-3 pr-3 font-semibold">{index + 1}</td>
                <td className="py-3 pr-3">
                  <Link className="font-medium text-teal-700" href={hrefFor(region)}>
                    {region.sigungu ? `${region.sido} ${region.sigungu}` : region.sido}
                  </Link>
                </td>
                <td className="py-3 pr-3 font-semibold">{value(region)}</td>
                <td className="py-3 pr-3">{microgram(region.avgPm10)}</td>
                <td className="py-3 pr-3">{microgram(region.avgPm25)}</td>
                <td className="py-3">{ventilationStatusLabel(region.ventilationStatus)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 md:hidden">
        {regions.map((region, index) => (
          <Link key={region.id} href={hrefFor(region)} className="block rounded-md border border-slate-200 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold">
                {index + 1}. {region.sigungu ? `${region.sido} ${region.sigungu}` : region.sido}
              </div>
              <div className="text-sm font-bold text-teal-700">{value(region)}</div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-slate-600">
              <span>미세먼지 {microgram(region.avgPm10)}</span>
              <span>초미세먼지 {microgram(region.avgPm25)}</span>
              <span>{ventilationStatusLabel(region.ventilationStatus)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
