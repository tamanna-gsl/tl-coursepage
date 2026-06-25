import { useEffect, useMemo, useRef, useState } from "react";
import type { Course, CourseModule } from "../../data/courseContent";
import { reports } from "../../data/reportData";
import { catalogue } from "../../data/catalogue";
import { isCaseStudy, type CaseStudyItem } from "../../types";
import { completionPercent } from "./progress";
import { ModuleRail } from "./ModuleRail";
import { LessonContent, type ContentState } from "./LessonContent";
import { PreSessionContent } from "../PreSessionContent";
import { ReadingScreen } from "../../screens/ReadingScreen";
import { DiscussionScreen } from "../../screens/DiscussionScreen";
import { EvaluationScreen } from "../../screens/EvaluationScreen";
import { Button } from "../Button";
import { AlertIcon, ChevronRightIcon, MenuIcon, SwitchIcon, XIcon } from "../icons";
import { cn } from "../../lib/cn";

// Which phase of the embedded case study session is active (null = not in an
// active session; the pre-session prompt shows when on the case study step).
type CaseSession = null | "reading" | "discussion" | "evaluation";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function caseItemFor(module: CourseModule | undefined): CaseStudyItem | null {
  if (!module || module.type !== "case-study" || !module.caseId) return null;
  const found = catalogue.find((i) => i.id === module.caseId);
  return found && isCaseStudy(found) ? found : null;
}

// View B + the embedded case study (Screen 9). Reuses the Screen 4-6 session
// components inside the course frame, with a two-phase reveal: the pre-session
// prompt shows inline with the rail visible, then on Start Session the rail
// collapses and the session takes the freed space.
export function ChapterView({
  course,
  chapterIndex,
  onExit,
  onCaseReportReady,
}: {
  course: Course;
  chapterIndex: number;
  onExit: () => void;
  onCaseReportReady: (caseStudy: CaseStudyItem) => void;
}) {
  const chapter = course.chapters[chapterIndex];
  const chapterNumber = chapterIndex + 1;
  const modules = useMemo(() => chapter.modules ?? [], [chapter]);
  const otherChapters = course.chapters.slice(chapterIndex + 1);

  const [completed, setCompleted] = useState<Set<string>>(
    () => new Set(modules.filter((m) => m.completed).map((m) => m.id))
  );
  const [currentId, setCurrentId] = useState<string>(
    () => modules.find((m) => !m.completed)?.id ?? modules[0].id
  );
  const [contentState, setContentState] = useState<ContentState>("ready");
  const [caseSession, setCaseSession] = useState<CaseSession>(null);
  const [caseError, setCaseError] = useState(false);
  const [mentorIndex, setMentorIndex] = useState(0);
  const [railOpen, setRailOpen] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const currentIndex = modules.findIndex((m) => m.id === currentId);
  const currentModule = modules[currentIndex];
  const percent = completionPercent(modules, completed);
  const mentor = course.mentors[mentorIndex % course.mentors.length];

  const onCaseStudy = currentModule?.type === "case-study";
  const sessionActive = caseSession !== null;
  const railCollapsed = sessionActive;
  const caseItem = caseItemFor(currentModule);

  const railRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Remove the collapsed rail from the tab order / assistive tech.
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    if (railCollapsed) el.setAttribute("inert", "");
    else el.removeAttribute("inert");
  }, [railCollapsed]);

  // Move focus into the content area as the phase changes.
  useEffect(() => {
    stageRef.current?.focus();
  }, [caseSession, currentId]);

  const showHint = (msg: string) => {
    setHint(msg);
    window.setTimeout(() => setHint(null), 2200);
  };

  const selectModule = (module: CourseModule) => {
    setCurrentId(module.id);
    setContentState("ready");
    setCaseSession(null);
    setCaseError(false);
    setRailOpen(false);
  };

  const goNext = () => {
    setCompleted((prev) => new Set(prev).add(currentId));
    const next = modules[currentIndex + 1];
    if (next) {
      setCurrentId(next.id);
      setCaseSession(null);
    }
  };
  const goPrev = () => {
    const prev = modules[currentIndex - 1];
    if (prev) {
      setCurrentId(prev.id);
      setCaseSession(null);
    }
  };

  // Case study session transitions.
  const startSession = () => setCaseSession("reading");
  const cancelPreSession = () => {
    // Return the content area to the previous module, nothing lost.
    const prev = modules[currentIndex - 1];
    if (prev) setCurrentId(prev.id);
    setCaseSession(null);
  };
  // Exit the case study back to the chapter, rail restored. The step stays the
  // current (in progress) module. Re-entry restarts (placeholder pending the
  // platform's real resume-versus-restart behaviour).
  const exitSession = () => setCaseSession(null);
  // Complete the case study and return to the chapter: tick the step, advance,
  // and unlock the next module.
  const completeCaseStudy = () => {
    setCompleted((prev) => new Set(prev).add(currentId));
    const next = modules[currentIndex + 1];
    if (next) setCurrentId(next.id);
    setCaseSession(null);
  };

  const rail = (
    <ModuleRail
      chapter={chapter}
      chapterNumber={chapterNumber}
      otherChapters={otherChapters}
      completed={completed}
      currentId={currentId}
      onSelect={selectModule}
      onLockedHint={() => showHint("Complete earlier modules to unlock this.")}
    />
  );

  const cheer =
    percent >= 67
      ? "You're crushing it!"
      : percent >= 34
        ? "Keep going!"
        : "Just getting started!";

  // Mentor lives at the foot of the rail (chapter context), and slides away
  // with the rail during the case study.
  const mentorCard = (
    <div className="shrink-0 border-t border-border p-3">
      <div className="flex items-center gap-2.5">
        {mentor.imageUrl ? (
          <img
            src={mentor.imageUrl}
            alt=""
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-tertiary text-xs font-bold text-foreground">
            {initials(mentor.name)}
          </span>
        )}
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Your Mentor
          </p>
          <p className="truncate text-sm font-semibold text-foreground">
            {mentor.name}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="mt-2.5 w-full justify-center"
        onClick={() => setMentorIndex((i) => i + 1)}
      >
        <SwitchIcon className="h-4 w-4" />
        Switch Mentor
      </Button>
    </div>
  );

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      {/* Top bar (minimal course context) */}
      <header className="z-30 flex shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {!sessionActive && (
            <button
              type="button"
              onClick={() => setRailOpen(true)}
              aria-label="Open module list"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          )}
          <span className="hidden text-sm font-bold text-foreground md:block md:w-72">
            Course Content
          </span>
        </div>
        <p className="truncate text-center text-sm font-bold text-secondary sm:text-base">
          {course.title}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={sessionActive ? exitSession : onExit}
        >
          <XIcon className="h-4 w-4" />
          {sessionActive ? "Exit Case Study" : "Exit"}
        </Button>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Desktop rail (collapses during the session) */}
        <aside
          ref={railRef}
          aria-hidden={railCollapsed || undefined}
          className={cn(
            "hidden shrink-0 overflow-hidden transition-[width] duration-500 ease-smooth motion-reduce:transition-none md:block",
            railCollapsed ? "w-0" : "w-72 border-r border-border"
          )}
        >
          <div className="flex h-full w-72 flex-col">
            <div className="min-h-0 flex-1">{rail}</div>
            {mentorCard}
          </div>
        </aside>

        {/* Content area */}
        <main
          ref={stageRef}
          tabIndex={-1}
          className="relative flex min-h-0 flex-1 flex-col outline-none"
        >
          {onCaseStudy && !caseItem ? (
            <CaseUnavailable onBack={cancelPreSession} />
          ) : sessionActive && caseItem ? (
            <div className="min-h-0 flex-1">
              {caseSession === "reading" && (
                <ReadingScreen
                  embedded
                  caseStudy={caseItem}
                  onStartDiscussion={() => setCaseSession("discussion")}
                  onSaveExit={exitSession}
                  onBack={exitSession}
                />
              )}
              {caseSession === "discussion" && (
                <DiscussionScreen
                  embedded
                  caseStudy={caseItem}
                  onEndDiscussion={() => setCaseSession("evaluation")}
                  onSaveExit={exitSession}
                />
              )}
              {caseSession === "evaluation" && (
                <EvaluationScreen
                  embedded
                  caseStudy={caseItem}
                  report={reports[caseItem.id]}
                  onBackToCourses={completeCaseStudy}
                  onViewDiscussion={() => setCaseSession("discussion")}
                  onReportReady={onCaseReportReady}
                />
              )}
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-y-auto">
              {onCaseStudy && caseItem ? (
                <div className="mx-auto max-w-2xl p-4 sm:p-6">
                  <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                    <PreSessionContent
                      state={caseError ? "error" : "ready"}
                      caseStudy={caseItem}
                      onClose={cancelPreSession}
                      onStart={startSession}
                      errorBackLabel="Back to chapter"
                    />
                  </div>
                </div>
              ) : (
                <LessonContent
                  module={currentModule}
                  state={contentState}
                  onBack={onExit}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Foot: navigation centred, with a compact Chapter Completion on the
          right (hidden during the case study) */}
      {!onCaseStudy && (
        <footer className="z-20 shrink-0 border-t border-border bg-card px-4 py-3 sm:px-6">
          <div className="relative flex items-center justify-center gap-2">
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
              disabled={
                currentIndex >= modules.length - 1 && completed.has(currentId)
              }
            >
              Next Lesson
              <ChevronRightIcon className="h-4 w-4" />
            </Button>

            <div className="absolute right-0 top-1/2 hidden w-48 -translate-y-1/2 lg:block">
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
              <p className="mt-0.5 text-[11px] font-semibold text-primary-dark">
                {cheer}
              </p>
            </div>
          </div>

          {/* Compact completion shown below the nav on narrower screens */}
          <div className="mx-auto mt-3 max-w-xs lg:hidden">
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
        </footer>
      )}

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
            {mentorCard}
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
      <div className="fixed right-3 top-20 z-40 flex items-center gap-1 rounded-full border border-border bg-card/95 p-1 shadow-module backdrop-blur">
        <span className="px-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          Module
        </span>
        {onCaseStudy ? (
          <button
            onClick={() => setCaseError((v) => !v)}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
              caseError
                ? "bg-destructive text-destructive-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            Case error
          </button>
        ) : (
          (["ready", "loading", "error"] as ContentState[]).map((s) => (
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
          ))
        )}
      </div>
    </div>
  );
}

function CaseUnavailable({ onBack }: { onBack: () => void }) {
  return (
    <div
      role="alert"
      className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center"
    >
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertIcon className="h-8 w-8" />
      </span>
      <h1 className="font-heading text-xl font-bold text-foreground">
        We could not open this case
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        This case study is unavailable right now. Please go back and try again
        shortly.
      </p>
      <Button className="mt-6 !rounded-full" onClick={onBack}>
        Back to chapter
      </Button>
    </div>
  );
}
