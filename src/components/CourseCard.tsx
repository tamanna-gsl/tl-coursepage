import type { CourseItem } from "../types";
import { Thumbnail } from "./Thumbnail";
import { KindLabel } from "./KindLabel";
import { ProgressBar } from "./ProgressBar";
import { Button } from "./Button";
import { Chip } from "./Chip";
import { ArrowRightIcon, CheckIcon, PlayIcon } from "./icons";

export function CourseCard({
  course,
  onOpen,
}: {
  course: CourseItem;
  onOpen: (course: CourseItem) => void;
}) {
  const inProgress = course.status === "in-progress";
  const completed = course.status === "completed";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-[transform,box-shadow] duration-300 ease-smooth hover:-translate-y-0.5 hover:shadow-module">
      <Thumbnail item={course} />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <KindLabel kind={course.kind} />

        <h3 className="font-heading text-xl font-bold leading-snug text-foreground">
          {course.title}
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {course.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <Chip kind={course.kind}>{course.audience}</Chip>
          <Chip kind={course.kind}>{course.totalChapters} chapters</Chip>
          {course.kind === "short-course" && (
            <Chip kind={course.kind}>Interactive film</Chip>
          )}
        </div>

        {inProgress && (
          <ProgressBar
            value={course.completedChapters}
            max={course.totalChapters}
          />
        )}

        <div className="mt-auto pt-2">
          <Button
            variant={completed ? "outline" : "gradient"}
            className="w-full !rounded-full"
            onClick={() => onOpen(course)}
          >
            {completed ? (
              <>
                <CheckIcon className="h-4 w-4" />
                Review course
              </>
            ) : inProgress ? (
              <>
                <PlayIcon className="h-3.5 w-3.5" />
                Continue
              </>
            ) : (
              <>
                Start the course
                <ArrowRightIcon className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
