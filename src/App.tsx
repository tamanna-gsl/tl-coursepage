import { useEffect, useMemo, useState } from "react";
import { catalogue } from "./data/catalogue";
import { isCaseStudy, type LearningItem, type LearningStatus } from "./types";
import { Header } from "./components/Header";
import { FilterBar, type KindFilter, type SortBy } from "./components/FilterBar";
import { CourseCard } from "./components/CourseCard";
import { CaseStudyCard } from "./components/CaseStudyCard";
import { ListSkeleton } from "./components/states/CardSkeleton";
import { EmptyState } from "./components/states/EmptyState";
import { ErrorState } from "./components/states/ErrorState";
import { PreviewSwitcher, type Phase } from "./components/PreviewSwitcher";

const STUDENT_NAME = "Student1";

// Placeholder action handlers. The pre-session modal and downstream screens
// are separate briefs and not built yet, so these only log for now.
function handleOpenCourse(item: LearningItem) {
  // eslint-disable-next-line no-console
  console.log("[Talk & Learn] open course:", item.id, item.title);
}
function handleViewCase(item: LearningItem) {
  // eslint-disable-next-line no-console
  console.log("[Talk & Learn] view case:", item.id, item.title);
}

const statusOrder: Record<LearningStatus, number> = {
  "in-progress": 0,
  "not-started": 1,
  completed: 2,
};

export default function App() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [filter, setFilter] = useState<KindFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("default");

  // Simulate the initial list load. Re-run on retry / "Replay load".
  useEffect(() => {
    if (phase !== "loading") return;
    const t = setTimeout(() => setPhase("ready"), 1000);
    return () => clearTimeout(t);
  }, [phase]);

  const items: LearningItem[] = phase === "empty" ? [] : catalogue;

  const counts = useMemo<Record<KindFilter, number>>(
    () => ({
      all: items.length,
      "short-course": items.filter((i) => i.kind === "short-course").length,
      "in-depth-course": items.filter((i) => i.kind === "in-depth-course").length,
      "case-study": items.filter((i) => i.kind === "case-study").length,
    }),
    [items]
  );

  const visible = useMemo(() => {
    let list = items;
    if (filter !== "all") list = list.filter((i) => i.kind === filter);
    if (sortBy === "title") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "status") {
      list = [...list].sort(
        (a, b) => statusOrder[a.status] - statusOrder[b.status]
      );
    }
    return list;
  }, [items, filter, sortBy]);

  const resetFilters = () => {
    setFilter("all");
    setSortBy("default");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header studentName={STUDENT_NAME} />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-semibold text-primary">
              Welcome back, {STUDENT_NAME}
            </p>
            <h1 className="mt-1 font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
              Library
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Browse your courses and case studies, each one led by an AI mentor.
            </p>
          </div>

          {phase === "ready" && items.length > 0 && (
            <FilterBar
              active={filter}
              onChange={setFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              counts={counts}
            />
          )}

          {phase === "loading" && <ListSkeleton count={6} />}

          {phase === "error" && (
            <ErrorState onRetry={() => setPhase("loading")} />
          )}

          {phase === "empty" && <EmptyState />}

          {phase === "ready" &&
            (visible.length === 0 ? (
              <EmptyState onReset={resetFilters} />
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((item) =>
                  isCaseStudy(item) ? (
                    <div key={item.id} className="animate-fade-in">
                      <CaseStudyCard caseStudy={item} onView={handleViewCase} />
                    </div>
                  ) : (
                    <div key={item.id} className="animate-fade-in">
                      <CourseCard course={item} onOpen={handleOpenCourse} />
                    </div>
                  )
                )}
              </div>
            ))}
        </section>
      </main>

      <PreviewSwitcher phase={phase} onChange={setPhase} />
    </div>
  );
}
