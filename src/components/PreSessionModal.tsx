import type { CaseStudyItem } from "../types";
import { Dialog } from "./Dialog";
import {
  PreSessionContent,
  PRESESSION_TITLE_ID,
  type CaseModalState,
} from "./PreSessionContent";
import { XIcon } from "./icons";

export type { CaseModalState };

export function PreSessionModal({
  open,
  state,
  caseStudy,
  onClose,
  onStart,
}: {
  open: boolean;
  state: CaseModalState;
  caseStudy: CaseStudyItem | null;
  onClose: () => void;
  onStart: (caseStudy: CaseStudyItem) => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} labelledBy={PRESESSION_TITLE_ID}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <XIcon className="h-5 w-5" />
      </button>
      <PreSessionContent
        state={state}
        caseStudy={caseStudy}
        onClose={onClose}
        onStart={onStart}
      />
    </Dialog>
  );
}
