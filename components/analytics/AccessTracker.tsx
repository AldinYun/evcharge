"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function AccessTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const payload = JSON.stringify({ path: pathname, referrer: document.referrer || undefined });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics/pageview", new Blob([payload], { type: "application/json" }));
      return;
    }
    fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true
    }).catch(() => undefined);
  }, [pathname]);

  return null;
}
