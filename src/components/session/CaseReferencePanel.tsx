import { readingContent } from "../../data/readingContent";
import { BookIcon } from "../icons";
import { cn } from "../../lib/cn";

// Persistent, scrollable case text shown alongside the conversation so the
// student can refer back while discussing. Reuses the reading content.
export function CaseReferencePanel({
  caseId,
  className,
}: {
  caseId: string;
  className?: string;
}) {
  const content = readingContent[caseId];

  return (
    <div className={cn("flex flex-col bg-card", className)}>
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
        <BookIcon className="h-5 w-5 text-secondary" aria-hidden />
        <h2 className="font-heading text-base font-bold text-secondary">
          Case Reference
        </h2>
      </div>

      <div
        role="region"
        aria-label="Case reference"
        tabIndex={0}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        {content ? (
          <div className="space-y-5">
            <h3 className="font-heading text-base font-bold text-foreground">
              {content.title}
            </h3>
            {content.sections.map((section) => (
              <section key={section.heading}>
                <h4 className="font-heading text-sm font-bold text-foreground">
                  {section.heading}
                </h4>
                <div className="mt-1.5 space-y-2.5">
                  {section.paragraphs.map((para, i) => (
                    <p
                      key={i}
                      className="text-sm leading-relaxed text-foreground/80"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            The case text is unavailable right now.
          </p>
        )}
      </div>
    </div>
  );
}
