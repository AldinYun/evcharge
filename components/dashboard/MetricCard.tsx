type MetricCardProps = {
  label: string;
  value: string;
  helper?: string;
  tone?: "default" | "good" | "warn" | "bad";
};

const toneMap = {
  default: "border-slate-200",
  good: "border-teal-300",
  warn: "border-amber-300",
  bad: "border-rose-300"
};

export function MetricCard({ label, value, helper, tone = "default" }: MetricCardProps) {
  return (
    <section className={`rounded-lg border ${toneMap[tone]} bg-white p-4 shadow-soft`}>
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-3 text-2xl font-semibold text-slate-950 sm:text-3xl">{value}</div>
      {helper ? <p className="mt-2 text-sm text-slate-600">{helper}</p> : null}
    </section>
  );
}
