function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex items-center gap-1" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
        <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
      </span>
      <span className="font-heading text-lg font-extrabold tracking-tight">
        <span className="text-primary">talk</span>
        <span className="text-foreground"> &amp; learn</span>
      </span>
    </div>
  );
}

export function Header({ studentName }: { studentName: string }) {
  const initial = studentName.charAt(0).toUpperCase();
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            Welcome,{" "}
            <span className="font-semibold text-foreground">{studentName}</span>
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-tertiary text-sm font-bold text-foreground shadow-sm">
            {initial}
          </span>
        </div>
      </div>
    </header>
  );
}
