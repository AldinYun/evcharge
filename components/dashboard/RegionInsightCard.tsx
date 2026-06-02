import Link from "next/link";
import type { AirRegionMetric } from "@/lib/types";

type Metric = "ventilationScore" | "avgPm10" | "avgPm25" | "outdoorActivityScore" | "laundryScore";

export function RegionInsightCard({ title, regions, metric }: { title: string; regions: AirRegionMetric[]; metric: Metric }) {
  const display = (region: AirRegionMetric) => {
    if (metric === "avgPm10" || metric === "avgPm25") return `${Math.round(region[metric])}㎍/㎥`;
    return `${region[metric]}점`;
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <div className="mt-4 space-y-3">
        {regions.slice(0, 5).map((region, index) => (
          <Link
            key={region.id}
            href={`/region/${encodeURIComponent(region.sido)}`}
            className="flex items-center justify-between gap-3 rounded-md border border-slate-100 p-3 hover:bg-slate-50"
          >
            <span className="min-w-0">
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-700">
                {index + 1}
              </span>
              <span className="font-medium">{region.sigungu ? `${region.sido} ${region.sigungu}` : region.sido}</span>
            </span>
            <span className="shrink-0 text-sm font-semibold text-slate-900">{display(region)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
