import type { ReactNode } from "react";
import { GetSetLearnLogo } from "../GetSetLearnLogo";
import { Button } from "../Button";

// Chrome that wraps the whole case study session (Reading, Discussion,
// Evaluation). Top bar: Get Set Learn logo left, case title centred, and
// Save & Exit (destructive red) right.
export function SessionShell({
  title,
  onSaveExit,
  children,
}: {
  title: string;
  onSaveExit: () => void;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
          <GetSetLearnLogo />
          <p
            className="truncate text-center font-heading text-sm font-bold text-secondary sm:text-base"
            title={title}
          >
            {title}
          </p>
          <Button
            variant="destructive"
            size="sm"
            className="shrink-0"
            onClick={onSaveExit}
          >
            Save &amp; Exit
          </Button>
        </div>
      </header>

      {children}
    </div>
  );
}
