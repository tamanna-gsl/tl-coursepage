import type { Chapter, CourseModule, ModuleType } from "../../data/courseContent";
import { statusOf, completedCount, type ModuleStatus } from "./progress";
import {
  BookIcon,
  ChatIcon,
  CheckIcon,
  ClipboardCheckIcon,
  LockIcon,
  SparklesIcon,
} from "../icons";
import { cn } from "../../lib/cn";

function typeIcon(type: ModuleType, className: string) {
  switch (type) {
    case "read":
      return <BookIcon className={className} aria-hidden />;
    case "chat":
      return <ChatIcon className={className} aria-hidden />;
    case "assessment":
      return <ClipboardCheckIcon className={className} aria-hidden />;
    case "case-study":
      return <SparklesIcon className={className} aria-hidden />;
  }
}

function statusWord(status: ModuleStatus) {
  return status === "completed"
    ? "completed"
    : status === "current"
      ? "current module"
      : status === "locked"
        ? "locked"
        : "available";
}

// Left rail listing the active chapter's modules and the locked chapters below.
// Built so it can collapse (Screen 9) without restructuring.
export function ModuleRail({
  chapter,
  otherChapters,
  completed,
  currentId,
  onSelect,
  onLockedHint,
}: {
  chapter: Chapter;
  otherChapters: Chapter[];
  completed: Set<string>;
  currentId: string;
  onSelect: (module: CourseModule) => void;
  onLockedHint: () => void;
}) {
  const modules = chapter.modules ?? [];
  const chapterIndex = 1;

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-card">
      {/* Active chapter */}
      <div className="border-b border-border px-4 py-4">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Chapter {chapterIndex}
        </p>
        <h2 className="mt-0.5 font-heading text-base font-bold text-foreground">
          {chapter.name}
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {completedCount(modules, completed)} of {modules.length} Modules
        </p>
      </div>

      <ul className="px-2 py-2">
        {modules.map((module, i) => {
          const status = statusOf(modules, i, completed, currentId);
          const locked = status === "locked";
          return (
            <li key={module.id}>
              <button
                type="button"
                disabled={locked}
                aria-current={status === "current" ? "step" : undefined}
                onClick={() => (locked ? onLockedHint() : onSelect(module))}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  status === "current"
                    ? "bg-primary/10"
                    : locked
                      ? "cursor-not-allowed opacity-55"
                      : "hover:bg-muted"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    status === "completed"
                      ? "bg-primary/15 text-primary"
                      : status === "current"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {status === "completed" ? (
                    <CheckIcon className="h-4 w-4" aria-hidden />
                  ) : locked ? (
                    <LockIcon className="h-4 w-4" aria-hidden />
                  ) : (
                    typeIcon(module.type, "h-4 w-4")
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block truncate text-sm font-semibold",
                      status === "current"
                        ? "text-foreground"
                        : locked
                          ? "text-muted-foreground"
                          : "text-foreground"
                    )}
                  >
                    {module.title}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {module.typeLabel}
                  </span>
                </span>
                <span className="sr-only">{statusWord(status)}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Locked future chapters (collapsed) */}
      <div className="mt-1 border-t border-border px-2 py-2">
        {otherChapters.map((ch, i) => (
          <button
            key={ch.id}
            type="button"
            disabled
            onClick={onLockedHint}
            className="flex w-full cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-left opacity-60"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <LockIcon className="h-4 w-4" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-muted-foreground">
                Chapter {chapterIndex + 1 + i}: {ch.name}
              </span>
              <span className="block text-xs text-muted-foreground">
                0 of {ch.moduleCount} Modules
              </span>
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              Locked
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
