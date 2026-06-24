import type { CourseItem } from "../types";
import { kindLabel } from "../lib/labels";
import { StatusBadge } from "./StatusBadge";
import { ProgressBar } from "./ProgressBar";
import { Button } from "./Button";
import { Chip } from "./Chip";
import {
  ArrowRightIcon,
  BookIcon,
  CheckIcon,
  PlayIcon,
  TagIcon,
} from "./icons";

function actionFor(status: CourseItem["status"]) {
  switch (status) {
    case "completed":
      return { label: "Review course", icon: <CheckIcon className="h-4 w-4" /> };
    case "in-progress":
      return { label: "Continue", icon: <PlayIcon className="h-3.5 w-3.5" /> };
    default:
      return { label: "Start course", icon: <ArrowRightIcon className="h-4 w-4" /> };
  }
}

export function CourseCard({
  course,
  onOpen,
}: {
  course: CourseItem;
  onOpen: (course: CourseItem) => void;
}) {
  const action = actionFor(course.status);
  const isShort = course.kind === "short-course";

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-[transform,box-shadow] duration-300 ease-smooth hover:-translate-y-1 hover:shadow-module"
    >
      {/* Course identity strip */}
      <div className="relative flex items-center justify-between gap-2 bg-gradient-hero px-5 py-3 text-primary-foreground">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
          <BookIcon className="h-4 w-4" />
          {kindLabel[course.kind]}
        </span>
        {course.isPlaceholder && (
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
            Placeholder
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-lg font-bold leading-snug text-foreground">
            {course.title}
          </h3>
          <StatusBadge status={course.status} />
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {course.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <Chip icon={<TagIcon className="h-3.5 w-3.5" />} tone="subject">
            {course.subject}
          </Chip>
          <Chip>{course.audience}</Chip>
          {isShort && <Chip tone="accent">Interactive film</Chip>}
        </div>

        {/* Course metadata: chapter progress */}
        <div className="mt-auto">
          <ProgressBar
            value={course.completedChapters}
            max={course.totalChapters}
          />
        </div>

        <Button
          variant={course.status === "completed" ? "outline" : "primary"}
          className="w-full"
          onClick={() => onOpen(course)}
        >
          {action.icon}
          {action.label}
        </Button>
      </div>
    </article>
  );
}
