import type { MetadataRoute } from "next";
import { getDashboardDataset } from "@/lib/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aircheck.kr";

export const dynamic = "force-dynamic";

function url(path: string) {
  return `${siteUrl}${path}`;
}

function regionPath(sido: string, sigungu?: string | null) {
  const encodedSido = encodeURIComponent(sido);
  if (!sigungu) return `/region/${encodedSido}`;
  return `/region/${encodedSido}/${encodeURIComponent(sigungu)}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getDashboardDataset();
  const lastModified = data.lastCollectedAt ?? data.lastMeasuredAt ?? new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified, changeFrequency: "hourly", priority: 1 },
    { url: url("/nearby"), lastModified, changeFrequency: "daily", priority: 0.8 },
    { url: url("/rankings"), lastModified, changeFrequency: "daily", priority: 0.8 },
    { url: url("/data-status"), lastModified, changeFrequency: "daily", priority: 0.4 },
    { url: url("/about"), lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/privacy"), lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: url("/contact"), lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: url("/terms"), lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: url("/grade/good"), lastModified, changeFrequency: "daily", priority: 0.5 },
    { url: url("/grade/moderate"), lastModified, changeFrequency: "daily", priority: 0.5 },
    { url: url("/grade/bad"), lastModified, changeFrequency: "daily", priority: 0.5 },
    { url: url("/grade/very-bad"), lastModified, changeFrequency: "daily", priority: 0.5 }
  ];

  const sidoPages = data.sidoMetrics.map((region) => ({
    url: url(regionPath(region.sido)),
    lastModified,
    changeFrequency: "daily" as const,
    priority: 0.7
  }));

  const sigunguPages = data.sigunguMetrics.map((region) => ({
    url: url(regionPath(region.sido, region.sigungu)),
    lastModified,
    changeFrequency: "daily" as const,
    priority: 0.6
  }));

  return [...staticPages, ...sidoPages, ...sigunguPages];
}
