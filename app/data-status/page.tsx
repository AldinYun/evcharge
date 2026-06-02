import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/AdSlot";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { getAccessAnalytics, getPipelineStatus } from "@/lib/data";
import { dateTime, number } from "@/lib/format";

export const metadata: Metadata = {
  title: "관리자 데이터 상태 | 미세먼지 수집·접근 통계",
  description: "미세먼지 데이터 수집 상태와 페이지 접근 통계를 확인하는 관리자 화면"
};

type PageProps = {
  searchParams?: { secret?: string };
};

function isAuthorized(secret?: string) {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) return true;
  return secret === adminSecret;
}

export default async function DataStatusPage({ searchParams }: PageProps) {
  if (!isAuthorized(searchParams?.secret)) {
    return (
      <DashboardShell title="관리자 전용" description="파이프라인 상태와 접근 통계는 관리자만 볼 수 있습니다.">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-950">접근 권한이 필요합니다</h2>
          <p className="mt-2 text-sm text-slate-600">관리자 비밀값을 포함한 URL로 접속하세요.</p>
          <p className="mt-3 rounded-md bg-slate-100 p-3 text-sm text-slate-700">/data-status?secret=ADMIN_SECRET</p>
        </section>
      </DashboardShell>
    );
  }

  const [status, analytics] = await Promise.all([getPipelineStatus(), getAccessAnalytics()]);

  return (
    <DashboardShell title="미세먼지 데이터 갱신 상태" description="수집 파이프라인 상태와 페이지 접근 통계를 확인합니다.">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="파이프라인 상태" value={status.status === "healthy" ? "정상" : "확인 필요"} tone="good" helper={status.message} />
        <MetricCard label="마지막 성공 시각" value={dateTime(status.lastSuccessAt)} />
        <MetricCard label="마지막 실패 시각" value={dateTime(status.lastFailureAt)} tone="warn" />
        <MetricCard label="측정소 수" value={number(status.stationCount)} />
        <MetricCard label="수집 샘플 수" value={number(status.sampleCount)} />
        <MetricCard label="전체 접근 수" value={number(analytics.totalViews)} />
        <MetricCard label="최근 24시간 접근" value={number(analytics.views24h)} />
        <MetricCard label="최근 7일 접근" value={number(analytics.views7d)} />
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <h2 className="text-lg font-semibold">파이프라인 단계</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {["수집", "정규화", "저장", "집계", "캐시"].map((step) => (
              <div key={step} className="rounded-md border border-teal-200 bg-teal-50 p-3 text-sm font-semibold text-teal-800">
                {step}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <h2 className="text-lg font-semibold">접근 많은 페이지</h2>
          <div className="mt-4 space-y-3">
            {analytics.topPages.length ? (
              analytics.topPages.map((page) => (
                <div key={page.path} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 p-3 text-sm">
                  <span className="truncate font-medium">{page.path}</span>
                  <span className="shrink-0 font-semibold text-teal-700">{number(page.count)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600">아직 기록된 접근이 없습니다.</p>
            )}
          </div>
        </section>
      </div>

      <AdSlot slotId="data-status-bottom" className="mt-6" minHeight={150} />
    </DashboardShell>
  );
}
