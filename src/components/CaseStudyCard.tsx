import type { CaseStudyItem } from "../types";
import { formatDuration } from "../lib/labels";
import { StatusBadge } from "./StatusBadge";
import { Button } from "./Button";
import { Chip } from "./Chip";
import {
  ArrowRightIcon,
  ClockIcon,
  SignalIcon,
  SparklesIcon,
  TagIcon,
} from "./icons";

export function CaseStudyCard({
  caseStudy,
  onView,
}: {
  caseStudy: CaseStudyItem;
  onView: (caseStudy: CaseStudyItem) => void;
}) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border-2 border-tertiary-purple/40 bg-card shadow-card transition-[transform,box-shadow] duration-300 ease-smooth hover:-translate-y-1 hover:shadow-module">
      {/* Distinct case study identity strip (tertiary gradient) */}
      <div className="relative flex items-center justify-between gap-2 bg-gradient-tertiary px-5 py-3 text-foreground">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
          <SparklesIcon className="h-4 w-4" />
          Case Study
        </span>
        {caseStudy.isPlaceholder && (
          <span className="rounded-full bg-white/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
            Placeholder
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-lg font-bold leading-snug text-foreground">
            {caseStudy.title}
          </h3>
          <StatusBadge status={caseStudy.status} />
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {caseStudy.description}
        </p>

        {/* Case study metadata: subject, difficulty, duration */}
        <div className="mt-auto flex flex-wrap gap-2">
          <Chip icon={<TagIcon className="h-3.5 w-3.5" />} tone="subject">
            {caseStudy.subject}
          </Chip>
          <Chip icon={<SignalIcon className="h-3.5 w-3.5" />} tone="accent">
            {caseStudy.difficulty}
          </Chip>
          <Chip icon={<ClockIcon className="h-3.5 w-3.5" />}>
            {formatDuration(caseStudy.durationMinutes)}
          </Chip>
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={() => onView(caseStudy)}
        >
          View Case
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </article>
  );
}
