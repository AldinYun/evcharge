import Link from "next/link";
import { number, percent } from "@/lib/format";
import type { RegionMetric } from "@/lib/types";

type RegionRankingTableProps = {
  regions: RegionMetric[];
  metric: keyof Pick<RegionMetric, "availabilityRate" | "congestionRate" | "faultRate" | "fastChargerRate" | "chargingOpportunityScore">;
  title?: string;
};

export function RegionRankingTable({ regions, metric, title }: RegionRankingTableProps) {
  const displayValue = (region: RegionMetric) =>
    metric === "chargingOpportunityScore" ? `${region.chargingOpportunityScore}점` : percent(Number(region[metric]));

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      {title ? <h2 className="mb-4 text-lg font-semibold text-slate-950">{title}</h2> : null}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="py-3 pr-3">순위</th>
              <th className="py-3 pr-3">지역</th>
              <th className="py-3 pr-3">지표</th>
              <th className="py-3 pr-3">충전소</th>
              <th className="py-3 pr-3">충전기</th>
              <th className="py-3">가능률</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((region, index) => (
              <tr key={region.id} className="border-b border-slate-100 last:border-0">
                <td className="py-3 pr-3 font-semibold">{index + 1}</td>
                <td className="py-3 pr-3">
                  <Link className="font-medium text-teal-700" href={`/region/${encodeURIComponent(region.sido)}`}>
                    {region.sigungu ? `${region.sido} ${region.sigungu}` : region.sido}
                  </Link>
                </td>
                <td className="py-3 pr-3 font-semibold">{displayValue(region)}</td>
                <td className="py-3 pr-3">{number(region.stationCount)}</td>
                <td className="py-3 pr-3">{number(region.totalChargers)}</td>
                <td className="py-3">{percent(region.availabilityRate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 md:hidden">
        {regions.map((region, index) => (
          <Link
            key={region.id}
            href={`/region/${encodeURIComponent(region.sido)}`}
            className="block rounded-md border border-slate-200 p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold">
                {index + 1}. {region.sigungu ? `${region.sido} ${region.sigungu}` : region.sido}
              </div>
              <div className="text-sm font-bold text-teal-700">{displayValue(region)}</div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-slate-600">
              <span>충전소 {number(region.stationCount)}</span>
              <span>충전기 {number(region.totalChargers)}</span>
              <span>가능률 {percent(region.availabilityRate)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
