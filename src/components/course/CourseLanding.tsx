import { useEffect, useState } from "react";
import type { Chapter, Course } from "../../data/courseContent";
import { Button } from "../Button";
import {
  ArrowLeftIcon,
  BookIcon,
  LockIcon,
  PlayIcon,
  SparklesIcon,
  UsersIcon,
} from "../icons";
import { cn } from "../../lib/cn";

// Distinct avatar colours for the peeking mentor cluster in the hero.
const AVATARS = [
  "bg-gradient-to-br from-[hsl(171_100%_45%)] to-[hsl(221_91%_45%)]",
  "bg-gradient-to-br from-[hsl(258_75%_62%)] to-[hsl(319_75%_58%)]",
  "bg-gradient-to-br from-[hsl(28_95%_55%)] to-[hsl(340_80%_60%)]",
];

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

  const stats = [
    { label: `${course.chapters.length} Chapters`, dot: "bg-[hsl(171_100%_60%)]" },
    { label: `${totalModules} Modules`, dot: "bg-[hsl(210_100%_68%)]" },
    { label: `${course.mentors.length} Mentors`, dot: "bg-[hsl(28_100%_62%)]" },
    { label: course.audience, dot: "bg-[hsl(330_100%_70%)]" },
  ];

  const [imgBroken, setImgBroken] = useState(false);

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
        {/* Hero (course image under a teal-to-blue gradient overlay) */}
        <section className="relative overflow-hidden rounded-2xl bg-[linear-gradient(120deg,hsl(171_90%_32%)_0%,hsl(189_85%_31%)_42%,hsl(216_80%_38%)_100%)] p-5 text-white shadow-module sm:p-6">
          {course.imageUrl && !imgBroken && (
            <>
              <img
                src={course.imageUrl}
                alt=""
                aria-hidden
                onError={() => setImgBroken(true)}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(120deg,hsl(171_92%_28%/0.94)_0%,hsl(189_88%_28%/0.9)_45%,hsl(216_82%_34%/0.88)_100%)]"
              />
            </>
          )}

          <div className="relative">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[hsl(28_100%_72%)]">
              <span
                className="h-2 w-2 rounded-full bg-[hsl(28_100%_62%)]"
                aria-hidden
              />
              In-Depth Course
            </span>
            <h1 className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl">
              {course.title}
            </h1>
            <p className="mt-1.5 line-clamp-2 max-w-2xl text-sm leading-relaxed text-white/85">
              {course.description}
            </p>

            {/* Chips + peeking mentor cluster on one row */}
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
              <div className="flex flex-wrap gap-2">
                {stats.map((s) => (
                  <span
                    key={s.label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 text-xs font-medium text-white/90"
                  >
                    <span
                      className={cn("h-1.5 w-1.5 rounded-full", s.dot)}
                      aria-hidden
                    />
                    {s.label}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-2">
                  {course.mentors.slice(0, 3).map((m, i) => (
                    <span
                      key={m.id}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white ring-2 ring-white/80",
                        AVATARS[i % AVATARS.length]
                      )}
                      aria-hidden
                    >
                      {initials(m.name)}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-white/75">
                  Learn with{" "}
                  <span className="font-semibold text-white">
                    {course.mentors.map((m) => m.name.split(" ")[0]).join(" & ")}
                  </span>
                </p>
              </div>
            </div>

            {/* Foot action row: progress across, Continue on the right */}
            <div className="mt-4 flex flex-col gap-4 border-t border-white/20 pt-4 sm:flex-row sm:items-center sm:gap-6">
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white/75">
                    Course Progress
                  </span>
                  <span className="font-bold">{course.progressPercent}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[hsl(171_100%_55%)] to-[hsl(190_100%_62%)] transition-[width] duration-1000 ease-smooth"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
              <Button
                variant="inverse"
                className="w-full shrink-0 !rounded-full sm:w-auto sm:min-w-[8rem]"
                onClick={() => firstUnlocked && onOpenChapter(firstUnlocked)}
              >
                Continue
              </Button>
            </div>
          </div>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Chapters */}
          <div className="lg:col-span-2">
            <h2 className="flex items-center gap-2.5 font-heading text-2xl font-extrabold text-foreground">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookIcon className="h-5 w-5" aria-hidden />
              </span>
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
                <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-foreground">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(258_90%_96%)] text-[hsl(258_60%_55%)]">
                    <UsersIcon className="h-4 w-4" aria-hidden />
                  </span>
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
