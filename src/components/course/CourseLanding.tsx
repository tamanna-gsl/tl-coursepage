import { useEffect, useState } from "react";
import type { Chapter, Course } from "../../data/courseContent";
import { Button } from "../Button";
import { ArrowLeftIcon, LockIcon, PlayIcon, SparklesIcon } from "../icons";
import { cn } from "../../lib/cn";

// Per-chapter accent palette, used subtly (top strip, eyebrow, icon tile, and
// outcome dots) to infuse colour while keeping the cards elegant.
const ACCENTS = [
  {
    strip: "bg-[hsl(171_100%_42%)]",
    eyebrow: "text-[hsl(171_100%_28%)]",
    tile: "bg-[hsl(171_100%_95%)] text-[hsl(171_100%_30%)]",
    dot: "bg-[hsl(171_100%_42%)]",
    link: "text-[hsl(171_100%_28%)]",
  },
  {
    strip: "bg-[hsl(221_80%_52%)]",
    eyebrow: "text-[hsl(221_70%_40%)]",
    tile: "bg-[hsl(221_91%_95%)] text-[hsl(221_70%_42%)]",
    dot: "bg-[hsl(221_80%_52%)]",
    link: "text-[hsl(221_70%_40%)]",
  },
  {
    strip: "bg-[hsl(28_95%_52%)]",
    eyebrow: "text-[hsl(28_85%_40%)]",
    tile: "bg-[hsl(28_100%_94%)] text-[hsl(28_85%_42%)]",
    dot: "bg-[hsl(28_95%_52%)]",
    link: "text-[hsl(28_85%_40%)]",
  },
  {
    strip: "bg-[hsl(258_75%_62%)]",
    eyebrow: "text-[hsl(258_60%_52%)]",
    tile: "bg-[hsl(258_90%_96%)] text-[hsl(258_55%_55%)]",
    dot: "bg-[hsl(258_75%_62%)]",
    link: "text-[hsl(258_55%_52%)]",
  },
  {
    strip: "bg-[hsl(142_55%_42%)]",
    eyebrow: "text-[hsl(142_55%_30%)]",
    tile: "bg-[hsl(142_60%_95%)] text-[hsl(142_50%_30%)]",
    dot: "bg-[hsl(142_55%_42%)]",
    link: "text-[hsl(142_55%_30%)]",
  },
  {
    strip: "bg-[hsl(340_75%_55%)]",
    eyebrow: "text-[hsl(340_70%_45%)]",
    tile: "bg-[hsl(340_90%_96%)] text-[hsl(340_70%_48%)]",
    dot: "bg-[hsl(340_75%_55%)]",
    link: "text-[hsl(340_70%_45%)]",
  },
];

// Locked chapters share one muted accent so they read as uniformly inert.
const LOCKED_ACCENT = {
  strip: "bg-muted-foreground/30",
  eyebrow: "text-muted-foreground",
  tile: "bg-muted text-muted-foreground",
  dot: "bg-muted-foreground/40",
  link: "text-muted-foreground",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Distinct from the state tag: a hint that the chapter holds a case study,
// reusing the library's magenta case-study identity. Shown for any state.
function CaseStudyMarker() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(319_100%_95%)] px-2.5 py-1 text-[11px] font-bold text-[hsl(319_75%_42%)]">
      <SparklesIcon className="h-3.5 w-3.5" aria-hidden />
      Includes a case study
    </span>
  );
}

function ChapterCard({
  chapter,
  index,
  onOpen,
}: {
  chapter: Chapter;
  index: number;
  onOpen: () => void;
}) {
  const locked = chapter.locked;
  const accent = locked ? LOCKED_ACCENT : ACCENTS[index % ACCENTS.length];

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-[transform,box-shadow] duration-300 ease-smooth hover:-translate-y-0.5 hover:shadow-module">
      <div className={cn("h-1.5 w-full", accent.strip)} aria-hidden />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl",
              accent.tile,
              locked && "ring-1 ring-border"
            )}
          >
            {locked ? (
              <LockIcon className="h-6 w-6" aria-hidden />
            ) : (
              <PlayIcon className="h-5 w-5" aria-hidden />
            )}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
              locked
                ? "bg-muted text-foreground/70"
                : "bg-primary/10 text-primary-dark"
            )}
          >
            {locked && <LockIcon className="h-3.5 w-3.5" aria-hidden />}
            {locked ? "Locked" : "In Progress"}
          </span>
        </div>

        <p
          className={cn(
            "mt-4 text-xs font-bold uppercase tracking-wide",
            accent.eyebrow
          )}
        >
          Chapter {index + 1}
        </p>
        <h3 className="mt-0.5 font-heading text-lg font-bold text-foreground">
          {chapter.name}
        </h3>

        {chapter.hasCaseStudy && (
          <div className="mt-2">
            <CaseStudyMarker />
          </div>
        )}

        <p className="mt-2 text-sm text-muted-foreground">
          {chapter.description}
        </p>

        <ul className="mt-3 space-y-1.5">
          {chapter.outcomes.map((o) => (
            <li
              key={o}
              className="flex items-start gap-2 text-sm text-foreground/80"
            >
              <span
                className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", accent.dot)}
                aria-hidden
              />
              {o}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs font-semibold text-muted-foreground">
            {chapter.moduleCount} Modules
          </span>
          {locked ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <LockIcon className="h-3.5 w-3.5" aria-hidden />
              Locked
            </span>
          ) : (
            <button
              type="button"
              onClick={onOpen}
              className={cn(
                "inline-flex items-center gap-1 text-sm font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                accent.link
              )}
            >
              View Modules
              <span aria-hidden>&rsaquo;</span>
            </button>
          )}
        </div>
      </div>

      <span className="sr-only">
        Chapter {index + 1}. {locked ? "Locked." : "In progress."}
        {chapter.hasCaseStudy ? " Includes a case study." : ""}
      </span>
    </article>
  );
}

// View A: course landing page.
export function CourseLanding({
  course,
  onBack,
  onOpenChapter,
}: {
  course: Course;
  onBack: () => void;
  onOpenChapter: (chapter: Chapter) => void;
}) {
  const firstUnlocked = course.chapters.find((c) => !c.locked);
  const totalModules = course.chapters.reduce((s, c) => s + c.moduleCount, 0);
  const resumeModule =
    firstUnlocked?.modules?.find((m) => !m.completed) ??
    firstUnlocked?.modules?.[0];

  const stats = [
    { label: `${course.chapters.length} Chapters`, dot: "bg-[hsl(171_100%_45%)]" },
    { label: `${totalModules} Modules`, dot: "bg-[hsl(221_80%_60%)]" },
    { label: `${course.mentors.length} Mentors`, dot: "bg-[hsl(28_95%_55%)]" },
    { label: course.audience, dot: "bg-[hsl(340_80%_65%)]" },
  ];

  // Grow the progress bar in on load so the band feels alive.
  const [barWidth, setBarWidth] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => setBarWidth(course.progressPercent), 150);
    return () => clearTimeout(t);
  }, [course.progressPercent]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <p className="font-heading text-lg font-extrabold text-secondary">
            Welcome, Student1!
          </p>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </Button>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-tertiary text-sm font-bold text-foreground">
              S
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(222_47%_9%)] via-[hsl(216_45%_11%)] to-[hsl(195_55%_13%)] p-6 text-white shadow-module sm:p-10">
          {/* Soft brand glow for depth */}
          <div
            className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-28 left-1/4 h-72 w-72 rounded-full bg-[hsl(258_100%_70%/0.18)] blur-3xl"
            aria-hidden
          />

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[hsl(171_100%_60%)] ring-1 ring-primary/30">
              <SparklesIcon className="h-3.5 w-3.5" aria-hidden />
              {course.programme} Programme
            </span>

            <h1 className="mt-4 font-heading text-3xl font-extrabold sm:text-4xl">
              {course.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
              {course.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {stats.map((s) => (
                <span
                  key={s.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/85"
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} aria-hidden />
                  {s.label}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <Button
                  variant="gradient"
                  className="!rounded-full"
                  onClick={() => firstUnlocked && onOpenChapter(firstUnlocked)}
                >
                  Continue
                </Button>
                {resumeModule && (
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-white/50">
                      Resume
                    </p>
                    <p className="truncate text-sm font-semibold text-white/90">
                      Chapter 1: {resumeModule.title}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white/70">
                    Course Progress
                  </span>
                  <span className="font-bold">{course.progressPercent}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[hsl(171_100%_45%)] to-[hsl(190_90%_55%)] shadow-[0_0_12px_hsl(171_100%_50%/0.6)] transition-[width] duration-1000 ease-smooth"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-white/60">
                  You are just getting started. Keep going!
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Chapters */}
          <div className="lg:col-span-2">
            <h2 className="font-heading text-2xl font-extrabold text-foreground">
              Curriculum Chapters
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {course.chapters.map((chapter, i) => (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  index={i}
                  onOpen={() => onOpenChapter(chapter)}
                />
              ))}
            </div>
          </div>

          {/* Mentors */}
          <aside>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card lg:sticky lg:top-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Your Mentors
                </h2>
                <span className="text-xs font-semibold text-muted-foreground">
                  {course.mentors.length} Experts
                </span>
              </div>
              <ul className="mt-4 space-y-3">
                {course.mentors.map((m) => (
                  <li
                    key={m.id}
                    className="flex gap-3 rounded-xl border border-border bg-background/60 p-3"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-tertiary text-sm font-bold text-foreground">
                      {initials(m.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground">
                        {m.name}
                      </p>
                      <p className="text-xs font-semibold text-primary-dark">
                        {m.role}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {m.blurb}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
