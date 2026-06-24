import { useEffect, useMemo, useRef, useState } from "react";
import { catalogue } from "./data/catalogue";
import {
  isCaseStudy,
  type CaseStudyItem,
  type CourseItem,
  type LearningItem,
  type LearningStatus,
} from "./types";
import { Header } from "./components/Header";
import { FilterBar, type KindFilter, type SortBy } from "./components/FilterBar";
import { CourseCard } from "./components/CourseCard";
import { CaseStudyCard } from "./components/CaseStudyCard";
import { ListSkeleton } from "./components/states/CardSkeleton";
import { EmptyState } from "./components/states/EmptyState";
import { ErrorState } from "./components/states/ErrorState";
import { PreviewSwitcher, type Phase } from "./components/PreviewSwitcher";
import {
  PreSessionModal,
  type CaseModalState,
} from "./components/PreSessionModal";

const STUDENT_NAME = "Student1";

// Course open is a separate brief and not built yet, so it only logs for now.
function handleOpenCourse(item: CourseItem) {
  // eslint-disable-next-line no-console
  console.log("[Talk & Learn] open course:", item.id, item.title);
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

  // Pre-session modal state. `caseModal` is null when the modal is closed.
  const [caseModal, setCaseModal] = useState<CaseModalState | null>(null);
  const [activeCase, setActiveCase] = useState<CaseStudyItem | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  // Simulate the initial list load. Re-run on retry / "Replay load".
  useEffect(() => {
    if (phase !== "loading") return;
    const t = setTimeout(() => setPhase("ready"), 1000);
    return () => clearTimeout(t);
  }, [phase]);

  // Make the page behind the modal inert (not focusable, hidden from AT).
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (caseModal) el.setAttribute("inert", "");
    else el.removeAttribute("inert");
  }, [caseModal]);

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

  // Open the pre-session modal carrying the tapped case. In the real app a
  // fetch could run here (modal would show its loading state first); with
  // in-memory data it opens straight to ready.
  const openCase = (caseStudy: CaseStudyItem) => {
    setActiveCase(caseStudy);
    setCaseModal("ready");
  };

  const closeCase = () => setCaseModal(null);

  const startSession = (caseStudy: CaseStudyItem) => {
    // The reading screen is the next brief and not built yet.
    // eslint-disable-next-line no-console
    console.log("[Talk & Learn] start session:", caseStudy.id, caseStudy.title);
    closeCase();
  };

  // Prototype-only: open the modal in a given state from the Preview control.
  const previewCase = (state: "ready" | "error") => {
    const sample = catalogue.find(isCaseStudy) ?? null;
    setActiveCase(sample);
    setCaseModal(state);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div ref={contentRef}>
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
                Build skills with short courses, in-depth ones, or put them to
                the test with a case study. All led by an AI mentor!
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
                        <CaseStudyCard caseStudy={item} onView={openCase} />
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
      </div>

      <PreSessionModal
        open={caseModal !== null}
        state={caseModal ?? "ready"}
        caseStudy={activeCase}
        onClose={closeCase}
        onStart={startSession}
      />

      <PreviewSwitcher
        phase={phase}
        onChange={setPhase}
        onOpenCase={previewCase}
      />
    </div>
  );
}
