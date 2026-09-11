export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-text-primary">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <h1 className="font-serif text-2xl">Sunday — 13 September</h1>
          <p className="font-sans text-sm text-text-muted">
            Service ready · 42 slides
          </p>
        </header>

        <div className="mb-8 flex gap-3 font-sans text-sm">
          <button className="rounded-sm bg-surface px-4 py-2">Preview</button>
          <button className="rounded-sm bg-surface px-4 py-2">Edit</button>
          <button className="rounded-sm bg-primary px-4 py-2 text-background">
            Generate PPT
          </button>
        </div>

        <div className="mb-8 rounded-sm border border-text-muted/30 bg-surface p-4 font-sans text-sm">
          <p className="mb-2 font-medium text-accent">⚠️ 2 items need attention</p>
          <p className="text-text-muted">Hymn 245 — not found</p>
          <p className="text-text-muted">Bible reading — confirmed</p>
        </div>

        <section>
          <h2 className="mb-3 font-sans text-xs uppercase tracking-wide text-text-muted">
            Service order
          </h2>
          <ol className="font-serif text-base leading-relaxed">
            <li>01 Welcome</li>
            <li>02 Opening Hymn</li>
            <li>03 Old Testament</li>
            <li>04 Psalm</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
