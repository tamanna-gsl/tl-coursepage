import type { ReactNode } from "react";
import type { SkillScore } from "../../data/reportData";
import { SKILL_MAX } from "../../data/reportData";
import { PenIcon } from "../icons";
import { cn } from "../../lib/cn";

// Badge / bar colour reflects the score, but the "x / 4" number is always
// present so meaning is never carried by colour alone.
function tierStyles(score: number) {
  if (score <= 1)
    return { badge: "bg-destructive/10 text-destructive", bar: "bg-destructive" };
  if (score === 2)
    return {
      badge: "bg-[hsl(38_92%_50%/0.15)] text-[hsl(32_85%_36%)]",
      bar: "bg-[hsl(38_92%_50%)]",
    };
  return { badge: "bg-primary/15 text-primary-dark", bar: "bg-primary" };
}

function SkillCard({ skill }: { skill: SkillScore }) {
  const tier = tierStyles(skill.score);
  return (
    <li className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <h4 className="flex items-center gap-2 font-heading text-base font-bold text-secondary">
          <PenIcon className="h-4 w-4 shrink-0 text-secondary/70" aria-hidden />
          {skill.title}
        </h4>
        <span
          className={cn(
            "shrink-0 rounded-md px-2 py-0.5 text-sm font-bold",
            tier.badge
          )}
        >
          {skill.score} / {SKILL_MAX}
        </span>
      </div>
      <div
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted"
        role="presentation"
      >
        <div
          className={cn("h-full rounded-full", tier.bar)}
          style={{ width: `${(skill.score / SKILL_MAX) * 100}%` }}
        />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {skill.feedback}
      </p>
    </li>
  );
}

export function SkillSection({
  heading,
  icon,
  skills,
}: {
  heading: string;
  icon: ReactNode;
  skills: SkillScore[];
}) {
  return (
    <section>
      <h3 className="flex items-center gap-2 font-heading text-xl font-extrabold text-secondary">
        <span className="text-secondary" aria-hidden>
          {icon}
        </span>
        {heading}
      </h3>
      <ul className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {skills.map((s) => (
          <SkillCard key={s.title} skill={s} />
        ))}
      </ul>
    </section>
  );
}
