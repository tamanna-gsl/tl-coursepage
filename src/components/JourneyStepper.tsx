import type { ComponentType, SVGProps } from "react";
import { BookIcon, ClipboardCheckIcon, MicIcon } from "./icons";

// The three-stage case study model: Reading, Discussion, Evaluation.
// Shared so the pre-session modal and the later session stepper stay
// consistent. Icons are decorative; the stage names are real text.
export const STAGES: {
  key: string;
  label: string;
  sub: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { key: "reading", label: "Reading", sub: "Case context", Icon: BookIcon },
  { key: "discussion", label: "Discussion", sub: "AI moderator", Icon: MicIcon },
  {
    key: "evaluation",
    label: "Evaluation",
    sub: "Performance",
    Icon: ClipboardCheckIcon,
  },
];

export function JourneyStepper() {
  return (
    <div>
      <p className="text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">
        Your learning journey
      </p>

      {/* Icon row with a connector line behind the icons */}
      <div className="relative mt-4">
        <div
          className="absolute left-[16.6%] right-[16.6%] top-6 h-px bg-border"
          aria-hidden
        />
        <ol className="relative flex justify-between">
          {STAGES.map((stage) => (
            <li
              key={stage.key}
              className="z-10 flex w-1/3 flex-col items-center text-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
                <stage.Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="mt-2 text-sm font-semibold text-foreground">
                {stage.label}
              </span>
              <span className="text-xs text-muted-foreground">{stage.sub}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
