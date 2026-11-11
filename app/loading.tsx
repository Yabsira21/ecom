export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header shell */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-muted animate-pulse" />
            <div className="h-5 w-24 rounded bg-muted animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-28 rounded bg-muted animate-pulse" />
            <div className="size-8 rounded-full bg-muted animate-pulse" />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero skeleton */}
        <section className="border-b border-border bg-muted/40 py-16 text-center">
          <div className="mx-auto max-w-7xl px-4 space-y-4 flex flex-col items-center">
            <div className="h-6 w-32 rounded-full bg-muted animate-pulse" />
            <div className="h-10 w-96 rounded-lg bg-muted animate-pulse max-w-full" />
            <div className="h-4 w-72 rounded bg-muted/60 animate-pulse max-w-full" />
            <div className="h-11 w-80 rounded-full bg-muted animate-pulse mt-4 max-w-full" />
          </div>
        </section>

        {/* Products skeleton */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
          <div className="h-7 w-40 rounded bg-muted animate-pulse mb-8" />
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-0"
              >
                <div className="aspect-square w-full bg-muted animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-full rounded bg-muted/60 animate-pulse" />
                  <div className="flex items-center justify-between pt-2">
                    <div className="h-4 w-12 rounded bg-muted animate-pulse" />
                    <div className="h-8 w-20 rounded bg-muted animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
