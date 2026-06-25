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
import { ReadingScreen } from "./screens/ReadingScreen";
import { DiscussionScreen } from "./screens/DiscussionScreen";
import { EvaluationScreen } from "./screens/EvaluationScreen";
import { reports, type ReportData } from "./data/reportData";
import { courses } from "./data/courseContent";
import { CourseLanding } from "./components/course/CourseLanding";
import { ChapterView } from "./components/course/ChapterView";

const STUDENT_NAME = "Student1";

const statusOrder: Record<LearningStatus, number> = {
  "in-progress": 0,
  "not-started": 1,
  completed: 2,
};

type View =
  | "list"
  | "reading"
  | "discussion"
  | "evaluation"
  | "course-landing"
  | "course-chapter";

export default function App() {
  // Catalogue is held in state so a session can mark a case In Progress.
  const [items, setItems] = useState<LearningItem[]>(catalogue);

  const [view, setView] = useState<View>("list");
  const [sessionCase, setSessionCase] = useState<CaseStudyItem | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [chapterIndex, setChapterIndex] = useState(0);

  // Completed reports, keyed by case id. In-memory placeholder; the real
  // product persists these to the backend. Screen 7 (dashboard) will read these;
  // held in a ref for now and promoted to state when the dashboard needs it.
  const reportStore = useRef<Record<string, ReportData>>({});

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

  const listItems: LearningItem[] = phase === "empty" ? [] : items;

  const counts = useMemo<Record<KindFilter, number>>(
    () => ({
      all: listItems.length,
      "short-course": listItems.filter((i) => i.kind === "short-course").length,
      "in-depth-course": listItems.filter((i) => i.kind === "in-depth-course")
        .length,
      "case-study": listItems.filter((i) => i.kind === "case-study").length,
    }),
    [listItems]
  );

  const visible = useMemo(() => {
    let list = listItems;
    if (filter !== "all") list = list.filter((i) => i.kind === filter);
    if (sortBy === "title") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "status") {
      list = [...list].sort(
        (a, b) => statusOrder[a.status] - statusOrder[b.status]
      );
    }
    return list;
  }, [listItems, filter, sortBy]);

  const resetFilters = () => {
    setFilter("all");
    setSortBy("default");
  };

  // Open the pre-session modal carrying the tapped case.
  const openCase = (caseStudy: CaseStudyItem) => {
    setActiveCase(caseStudy);
    setCaseModal("ready");
  };
  const closeCase = () => setCaseModal(null);

  // Start Session: enter the reading screen with the chosen case.
  const startSession = (caseStudy: CaseStudyItem) => {
    setCaseModal(null);
    setSessionCase(caseStudy);
    setView("reading");
  };

  const markInProgress = (id: string) =>
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.status !== "completed"
          ? ({ ...i, status: "in-progress" } as LearningItem)
          : i
      )
    );

  // Save & Exit: mark the case In Progress and return to the list with state
  // intact. Re-entry resume-vs-restart is unresolved in the PRD, so for the
  // prototype re-entering an In Progress case restarts at the reading screen.
  // Placeholder pending the platform's real behaviour for other courses.
  const saveAndExit = (caseStudy: CaseStudyItem) => {
    markInProgress(caseStudy.id);
    setView("list");
    setSessionCase(null);
  };

  // Plain return to the list (e.g. from the unavailable-case error).
  const backToList = () => {
    setView("list");
    setSessionCase(null);
  };

  // Enter the discussion screen (microphone already granted on the reading
  // screen).
  const startDiscussion = (caseStudy: CaseStudyItem) => {
    setSessionCase(caseStudy);
    setView("discussion");
  };

  // Discussion ends: route to the performance evaluation with the same case.
  const endDiscussion = (caseStudy: CaseStudyItem) => {
    setSessionCase(caseStudy);
    setView("evaluation");
  };

  const markCompleted = (id: string) =>
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? ({ ...i, status: "completed" } as LearningItem) : i
      )
    );

  // Report generated: mark the case Completed and save the report so the
  // dashboard (Screen 7) can open it later.
  const completeReport = (caseStudy: CaseStudyItem) => {
    markCompleted(caseStudy.id);
    const report = reports[caseStudy.id];
    if (report) reportStore.current[caseStudy.id] = report;
  };

  const viewDiscussion = (caseStudy: CaseStudyItem) => {
    setSessionCase(caseStudy);
    setView("discussion");
  };

  // Open the course shell (in-depth course landing). Only courses with shell
  // content open here; others log for now.
  const openCourse = (course: CourseItem) => {
    if (courses[course.id]) {
      setCourseId(course.id);
      setView("course-landing");
    } else {
      // eslint-disable-next-line no-console
      console.log("[Talk & Learn] open course:", course.id, course.title);
    }
  };
  const activeCourse = courseId ? courses[courseId] : undefined;

  // Embedded case study report ready: persist to the same store the dashboard
  // reads (in-memory placeholder; real product persists to the backend).
  const saveCaseReport = (caseStudy: CaseStudyItem) => {
    const report = reports[caseStudy.id];
    if (report) reportStore.current[caseStudy.id] = report;
  };

  // Prototype-only: open the modal in a given state from the Preview control.
  const previewCase = (state: "ready" | "error") => {
    const sample = items.find(isCaseStudy) ?? null;
    setActiveCase(sample);
    setCaseModal(state);
  };

  if (view === "reading" && sessionCase) {
    return (
      <ReadingScreen
        caseStudy={sessionCase}
        onStartDiscussion={startDiscussion}
        onSaveExit={saveAndExit}
        onBack={backToList}
      />
    );
  }

  if (view === "discussion" && sessionCase) {
    return (
      <DiscussionScreen
        caseStudy={sessionCase}
        onEndDiscussion={endDiscussion}
        onSaveExit={saveAndExit}
      />
    );
  }

  if (view === "evaluation" && sessionCase) {
    return (
      <EvaluationScreen
        caseStudy={sessionCase}
        report={reports[sessionCase.id]}
        onBackToCourses={backToList}
        onViewDiscussion={viewDiscussion}
        onReportReady={completeReport}
      />
    );
  }

  if (view === "course-landing" && activeCourse) {
    return (
      <CourseLanding
        course={activeCourse}
        onBack={backToList}
        onOpenChapter={(chapter) => {
          setChapterIndex(activeCourse.chapters.indexOf(chapter));
          setView("course-chapter");
        }}
      />
    );
  }

  if (view === "course-chapter" && activeCourse) {
    return (
      <ChapterView
        course={activeCourse}
        chapterIndex={chapterIndex}
        onExit={() => setView("course-landing")}
        onCaseReportReady={saveCaseReport}
      />
    );
  }

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

            {phase === "ready" && listItems.length > 0 && (
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
                        <CourseCard course={item} onOpen={openCourse} />
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
