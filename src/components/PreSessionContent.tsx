import type { CaseStudyItem } from "../types";
import { formatDuration } from "../lib/labels";
import { JourneyStepper } from "./JourneyStepper";
import { Button } from "./Button";
import { Chip } from "./Chip";
import { AlertIcon } from "./icons";

export type CaseModalState = "loading" | "ready" | "error";

export const PRESESSION_TITLE_ID = "presession-title";

// The pre-session body, shared by the standalone modal (Screen 3, wrapped in a
// Dialog) and the in-chapter embed (Screen 9, rendered inline in the content
// area). Kept as one component so the two surfaces can never drift apart.
export function PreSessionContent({
  state,
  caseStudy,
  onClose,
  onStart,
  errorBackLabel = "Back to library",
}: {
  state: CaseModalState;
  caseStudy: CaseStudyItem | null;
  onClose: () => void;
  onStart: (caseStudy: CaseStudyItem) => void;
  errorBackLabel?: string;
}) {
  if (state === "loading") {
    return (
      <div className="p-6 sm:p-8">
        <h2 id={PRESESSION_TITLE_ID} className="sr-only">
          Loading case study
        </h2>
        <div className="flex gap-2">
          <div className="skeleton h-6 w-28 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
        <div className="skeleton mt-4 h-8 w-3/4 rounded-md" />
        <div className="skeleton mt-6 h-40 w-full rounded-xl" />
        <div className="mt-6 flex justify-end gap-3">
          <div className="skeleton h-11 w-28 rounded-full" />
          <div className="skeleton h-11 w-36 rounded-full" />
        </div>
      </div>
    );
  }

  if (state === "error" || !caseStudy) {
    return (
      <div className="p-8 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertIcon className="h-7 w-7" />
        </span>
        <h2
          id={PRESESSION_TITLE_ID}
          className="font-heading text-xl font-bold text-foreground"
        >
          We could not open this case
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          This case study is unavailable right now. Please go back and try again
          in a little while.
        </p>
        <Button className="mt-6 !rounded-full" onClick={onClose}>
          {errorBackLabel}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-7">
      <div className="flex flex-wrap gap-2 pr-10">
        <Chip kind="case-study">{caseStudy.subject}</Chip>
        <Chip kind="case-study">{caseStudy.difficulty}</Chip>
        <Chip kind="case-study">{formatDuration(caseStudy.durationMinutes)}</Chip>
      </div>

      <h2
        id={PRESESSION_TITLE_ID}
        className="mt-3 font-heading text-2xl font-bold leading-snug text-foreground"
      >
        {caseStudy.title} - {caseStudy.subject}
      </h2>

      <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
        <p className="text-center text-sm leading-relaxed text-primary-dark sm:text-base">
          Note: case study sessions are designed to be completed in one sitting.
          Please set aside 15 to 20 minutes before you begin.
        </p>
        <div className="mt-5">
          <JourneyStepper />
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          className="w-full !rounded-full sm:w-auto"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="w-full !rounded-full sm:w-auto"
          onClick={() => onStart(caseStudy)}
        >
          Start Session
        </Button>
      </div>
    </div>
  );
}
