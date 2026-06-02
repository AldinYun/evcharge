import Link from "next/link";

export function DashboardShell({ children, title, description }: { children: React.ReactNode; title: string; description: string }) {
  return (
    <main className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <Link href="/" className="text-sm font-semibold text-teal-700">
              Air Vent Guide
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">{title}</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:text-base">{description}</p>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm font-medium">
            <Link className="rounded-md border border-slate-200 bg-white px-3 py-2" href="/nearby">
              내 주변
            </Link>
            <Link className="rounded-md border border-slate-200 bg-white px-3 py-2" href="/rankings">
              순위
            </Link>
            <Link className="rounded-md border border-slate-200 bg-white px-3 py-2" href="/data-status">
              데이터 상태
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
    </main>
  );
}
