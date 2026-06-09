import Link from "next/link";

export function DashboardShell({ children, title, description }: { children: React.ReactNode; title: string; description: string }) {
  return (
    <main className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">{title}</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:text-base">{description}</p>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm font-medium" aria-label="주요 메뉴">
            <Link className="rounded-md border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50" href="/nearby">
              내 주변
            </Link>
            <Link className="rounded-md border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50" href="/rankings">
              지역 순위
            </Link>
            <Link className="rounded-md border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50" href="/guide">
              생활 가이드
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-600 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>에어체크는 공공 대기질 자료를 생활 정보로 정리해 보여줍니다.</p>
          <nav className="flex flex-wrap gap-3" aria-label="사이트 정보">
            <Link href="/about" className="hover:text-slate-950">
              소개
            </Link>
            <Link href="/guide" className="hover:text-slate-950">
              생활 가이드
            </Link>
            <Link href="/privacy" className="hover:text-slate-950">
              개인정보처리방침
            </Link>
            <Link href="/contact" className="hover:text-slate-950">
              문의
            </Link>
            <Link href="/terms" className="hover:text-slate-950">
              이용 안내
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
