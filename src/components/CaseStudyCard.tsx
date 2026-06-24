import type { CaseStudyItem } from "../types";
import { formatDuration } from "../lib/labels";
import { Thumbnail } from "./Thumbnail";
import { KindLabel } from "./KindLabel";
import { Button } from "./Button";
import { Chip } from "./Chip";
import { ArrowRightIcon } from "./icons";

export function CaseStudyCard({
  caseStudy,
  onView,
}: {
  caseStudy: CaseStudyItem;
  onView: (caseStudy: CaseStudyItem) => void;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-[transform,box-shadow] duration-300 ease-smooth hover:-translate-y-0.5 hover:shadow-module">
      <Thumbnail item={caseStudy} />

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Magenta "Case Study" label marks this card as distinct. */}
        <KindLabel kind="case-study" />

        <h3 className="font-heading text-xl font-bold leading-snug text-foreground">
          {caseStudy.title}
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {caseStudy.description}
        </p>

        {/* Case study metadata: subject, difficulty, duration. */}
        <div className="flex flex-wrap gap-2">
          <Chip kind="case-study">{caseStudy.subject}</Chip>
          <Chip kind="case-study">{caseStudy.difficulty}</Chip>
          <Chip kind="case-study">{formatDuration(caseStudy.durationMinutes)}</Chip>
        </div>

        <div className="mt-auto pt-2">
          <Button
            variant="gradient"
            className="w-full !rounded-full"
            onClick={() => onView(caseStudy)}
          >
            View Case
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
