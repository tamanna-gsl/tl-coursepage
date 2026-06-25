import { useMemo, useState } from "react";
import type { Course, CourseModule } from "../../data/courseContent";
import { completionPercent } from "./progress";
import { ModuleRail } from "./ModuleRail";
import { LessonContent, type ContentState } from "./LessonContent";
import { Button } from "../Button";
import { ChevronRightIcon, MenuIcon, SwitchIcon, XIcon } from "../icons";
import { cn } from "../../lib/cn";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// View B: the in-chapter lesson view. Rail + content + progress + navigation,
// built so Screen 9 can collapse the rail and expand the content.
export function ChapterView({
  course,
  onExit,
}: {
  course: Course;
  onExit: () => void;
}) {
  const chapter = course.chapters[0];
  const modules = useMemo(() => chapter.modules ?? [], [chapter]);
  const otherChapters = course.chapters.slice(1);

  const [completed, setCompleted] = useState<Set<string>>(
    () => new Set(modules.filter((m) => m.completed).map((m) => m.id))
  );
  const [currentId, setCurrentId] = useState<string>(
    () => modules.find((m) => !m.completed)?.id ?? modules[0].id
  );
  const [contentState, setContentState] = useState<ContentState>("ready");
  const [mentorIndex, setMentorIndex] = useState(0);
  const [railOpen, setRailOpen] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const currentIndex = modules.findIndex((m) => m.id === currentId);
  const currentModule = modules[currentIndex];
  const percent = completionPercent(modules, completed);
  const mentor = course.mentors[mentorIndex % course.mentors.length];

  const showHint = (msg: string) => {
    setHint(msg);
    window.setTimeout(() => setHint(null), 2200);
  };

  const selectModule = (module: CourseModule) => {
    setCurrentId(module.id);
    setContentState("ready");
    setRailOpen(false);
  };

  const goNext = () => {
    setCompleted((prev) => new Set(prev).add(currentId));
    const next = modules[currentIndex + 1];
    if (next) setCurrentId(next.id);
  };
  const goPrev = () => {
    const prev = modules[currentIndex - 1];
    if (prev) setCurrentId(prev.id);
  };

  const rail = (
    <ModuleRail
      chapter={chapter}
      otherChapters={otherChapters}
      completed={completed}
      currentId={currentId}
      onSelect={selectModule}
      onLockedHint={() => showHint("Complete earlier modules to unlock this.")}
    />
  );

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      {/* Top bar */}
      <header className="z-30 flex shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRailOpen(true)}
            aria-label="Open module list"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
          <span className="hidden text-sm font-bold text-foreground md:block md:w-72">
            Course Content
          </span>
        </div>
        <p className="truncate text-center text-sm font-bold text-secondary sm:text-base">
          {course.title}
        </p>
        <Button variant="outline" size="sm" onClick={onExit}>
          <XIcon className="h-4 w-4" />
          Exit
        </Button>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Desktop rail */}
        <aside className="hidden w-72 shrink-0 border-r border-border md:block">
          {rail}
        </aside>

        {/* Content */}
        <main className="flex min-h-0 flex-1 flex-col">
          {/* Mentor presence */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-card/60 px-4 py-2.5 sm:px-6">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-tertiary text-xs font-bold text-foreground">
                {initials(mentor.name)}
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Your Mentor
                </span>
                <span className="block truncate text-sm font-semibold text-foreground">
                  {mentor.name}
                </span>
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMentorIndex((i) => i + 1)}
            >
              <SwitchIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Switch Mentor</span>
            </Button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <LessonContent
              module={currentModule}
              state={contentState}
              onBack={onExit}
            />
          </div>
        </main>
      </div>

      {/* Foot: navigation + progress */}
      <footer className="z-20 shrink-0 border-t border-border bg-card px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={goPrev}
            disabled={currentIndex <= 0}
          >
            Previous
          </Button>

          <Button
            variant="primary"
            size="sm"
            className="!rounded-full"
            onClick={goNext}
            disabled={currentIndex >= modules.length - 1 && completed.has(currentId)}
          >
            Next Lesson
            <ChevronRightIcon className="h-4 w-4" />
          </Button>

          <div className="hidden min-w-[12rem] sm:block">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-muted-foreground">
                Chapter Completion
              </span>
              <span className="font-bold text-foreground">{percent}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-500 ease-smooth"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
        {/* Mobile completion line */}
        <p className="mt-2 text-center text-xs font-semibold text-muted-foreground sm:hidden">
          Chapter Completion {percent}%
        </p>
      </footer>

      {/* Mobile rail drawer */}
      {railOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setRailOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85%] flex-col bg-card shadow-module">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-bold text-foreground">
                Course Content
              </span>
              <button
                type="button"
                onClick={() => setRailOpen(false)}
                aria-label="Close module list"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1">{rail}</div>
          </div>
        </div>
      )}

      {/* Locked hint toast */}
      {hint && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-module"
        >
          {hint}
        </div>
      )}

      {/* Prototype-only state preview */}
      <div className="fixed bottom-3 left-3 z-40 flex items-center gap-1 rounded-full border border-border bg-card/95 p-1 shadow-module backdrop-blur">
        <span className="px-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          Module
        </span>
        {(["ready", "loading", "error"] as ContentState[]).map((s) => (
          <button
            key={s}
            onClick={() => setContentState(s)}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold capitalize transition-colors",
              contentState === s
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {s === "ready" ? "Default" : s}
          </button>
        ))}
      </div>
    </div>
  );
}
