import { useEffect, useRef, useState } from "react";
import type { CaseStudyItem } from "../types";
import type { ReportData } from "../data/reportData";
import { SessionShell } from "../components/session/SessionShell";
import { ProgressStepper } from "../components/session/ProgressStepper";
import { ReportBody } from "../components/report/ReportBody";
import { Button } from "../components/Button";
import { AlertIcon, ArrowRightIcon, ChatIcon } from "../components/icons";
import { cn } from "../lib/cn";

type ReportState = "generating" | "ready" | "error";

export function EvaluationScreen({
  caseStudy,
  report,
  onBackToCourses,
  onViewDiscussion,
  onReportReady,
}: {
  caseStudy: CaseStudyItem;
  report: ReportData | undefined;
  onBackToCourses: () => void;
  onViewDiscussion: (caseStudy: CaseStudyItem) => void;
  onReportReady: (caseStudy: CaseStudyItem) => void;
}) {
  const title = `${caseStudy.title} - ${caseStudy.subject}`;
  const [state, setState] = useState<ReportState>(
    report ? "generating" : "error"
  );
  const notified = useRef(false);

  // Brief generating delay, as the real product computes the report on entry.
  useEffect(() => {
    if (!report) return;
    const t = setTimeout(() => setState("ready"), 1500);
    return () => clearTimeout(t);
  }, [report]);

  // Once ready, mark the case Completed and persist the report (in-memory
  // placeholder; real product persists to the backend). Fire once.
  useEffect(() => {
    if (state === "ready" && !notified.current) {
      notified.current = true;
      onReportReady(caseStudy);
    }
  }, [state, caseStudy, onReportReady]);

  const backAction = (
    <Button variant="primary" size="sm" onClick={onBackToCourses}>
      Back to Courses
    </Button>
  );

  return (
    <SessionShell title={title} action={backAction}>
      <div className="sticky top-16 z-20 border-b border-border bg-background/90 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto max-w-3xl">
          <ProgressStepper active="evaluation" />
        </div>
      </div>

      {state === "generating" && (
        <div
          role="status"
          aria-live="polite"
          className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center"
        >
          <span
            className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"
            aria-hidden
          />
          <p className="mt-4 font-heading text-lg font-bold text-foreground">
            Generating your report
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            This will only take a moment.
          </p>
        </div>
      )}

      {state === "error" && (
        <div
          role="alert"
          className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center"
        >
          <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertIcon className="h-8 w-8" />
          </span>
          <h1 className="font-heading text-xl font-bold text-foreground">
            We could not produce your report
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Something went wrong while preparing your performance evaluation.
            Your discussion is safe. Please head back to your courses and try
            again shortly.
          </p>
          <Button className="mt-6 !rounded-full" onClick={onBackToCourses}>
            Back to Courses
          </Button>
        </div>
      )}

      {state === "ready" && report && (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-heading text-3xl font-extrabold text-secondary sm:text-4xl">
                Performance Evaluation
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Here is your detailed feedback and score for this case study
                session.
              </p>
            </div>
            <Button
              variant="primary"
              className="shrink-0 !rounded-full"
              onClick={() => onViewDiscussion(caseStudy)}
            >
              <ChatIcon className="h-4 w-4" />
              View Discussion
            </Button>
          </header>

          <div className="mt-8">
            <ReportBody report={report} />
          </div>

          <div className="mt-10 flex justify-center border-t border-border pt-8">
            <Button
              variant="primary"
              className="!rounded-full"
              onClick={onBackToCourses}
            >
              Back to Courses
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <EvaluationDevControls state={state} onState={setState} />
    </SessionShell>
  );
}

// Prototype-only control to preview generating / default / error.
function EvaluationDevControls({
  state,
  onState,
}: {
  state: ReportState;
  onState: (s: ReportState) => void;
}) {
  const options: { value: ReportState; label: string }[] = [
    { value: "ready", label: "Default" },
    { value: "generating", label: "Generating" },
    { value: "error", label: "Error" },
  ];
  return (
    <div className="fixed bottom-3 left-3 z-40 flex items-center gap-1 rounded-full border border-border bg-card/95 p-1 shadow-module backdrop-blur">
      <span className="px-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
        Report
      </span>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onState(o.value)}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
            state === o.value
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
