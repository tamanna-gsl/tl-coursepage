import type { ReactNode } from "react";
import { GetSetLearnLogo } from "../GetSetLearnLogo";
import { Button } from "../Button";

// Chrome that wraps the whole case study session (Reading, Discussion,
// Evaluation). Top bar: Get Set Learn logo left, case title centred, and a
// right-hand action. By default that action is Save & Exit (destructive red);
// the terminal Evaluation screen passes its own action (Back to Courses).
export function SessionShell({
  title,
  onSaveExit,
  action,
  children,
}: {
  title: string;
  onSaveExit?: () => void;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <header className="z-30 shrink-0 border-b border-border bg-card">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
          <GetSetLearnLogo />
          <p
            className="truncate text-center font-heading text-sm font-bold text-secondary sm:text-base"
            title={title}
          >
            {title}
          </p>
          <div className="shrink-0">
            {action ?? (
              <Button variant="destructive" size="sm" onClick={onSaveExit}>
                Save &amp; Exit
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
