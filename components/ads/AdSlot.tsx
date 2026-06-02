import clsx from "clsx";

type AdSlotProps = {
  slotId: string;
  className?: string;
  minHeight?: number;
};

export function AdSlot({ slotId, className, minHeight = 160 }: AdSlotProps) {
  const isProduction = process.env.NODE_ENV === "production";
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <aside
      className={clsx("rounded-lg border border-dashed border-slate-300 bg-white/75 p-3", className)}
      style={{ minHeight }}
      aria-label="Advertisement"
    >
      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">광고</div>
      {isProduction && clientId ? (
        <ins
          className="adsbygoogle block"
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex h-full min-h-28 items-center justify-center rounded-md bg-slate-100 text-sm text-slate-500">
          AdSense slot {slotId}
        </div>
      )}
    </aside>
  );
}
