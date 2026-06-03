import Link from "next/link";

export function InfoPage({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <Link href="/" className="text-sm font-semibold text-teal-700">
            에어체크
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-slate-950 sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
        </div>
      </header>
      <article className="mx-auto max-w-3xl px-4 py-8">
        <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-700 shadow-soft sm:p-7">
          {children}
        </div>
      </article>
    </main>
  );
}

export function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      <div className="mt-2 space-y-2">{children}</div>
    </section>
  );
}
