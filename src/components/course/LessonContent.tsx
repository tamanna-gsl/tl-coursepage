import type { CourseModule } from "../../data/courseContent";
import { Button } from "../Button";
import { AlertIcon, ChatIcon, ClipboardCheckIcon, PlayIcon } from "../icons";

export type ContentState = "loading" | "ready" | "error";

// Central content area. Renders the current module. For this brief the Read
// type is built out; Chat and Assessment show a simple placeholder (their full
// behaviour is out of scope here). Screen 9 renders the case study here.
export function LessonContent({
  module,
  state,
  onBack,
}: {
  module: CourseModule;
  state: ContentState;
  onBack: () => void;
}) {
  if (state === "loading") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6" aria-hidden>
        <div className="skeleton h-8 w-2/3 rounded-md" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={i % 3 === 2 ? "skeleton h-4 w-1/2 rounded" : "skeleton h-4 w-full rounded"}
            />
          ))}
        </div>
        <div className="skeleton mt-6 aspect-video w-full rounded-xl" />
      </div>
    );
  }

  if (state === "error") {
    return (
      <div
        role="alert"
        className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6"
      >
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertIcon className="h-8 w-8" />
        </span>
        <h1 className="font-heading text-xl font-bold text-foreground">
          We could not load this module
        </h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Something went wrong while loading the lesson. Please go back and try
          again in a little while.
        </p>
        <Button className="mt-6 !rounded-full" onClick={onBack}>
          Back to course
        </Button>
      </div>
    );
  }

  if (module.type === "read" && module.read) {
    return (
      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="font-heading text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
          {module.read.heading}
        </h1>
        <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br from-secondary/10 to-primary/10">
          <div className="flex h-full w-full items-center justify-center text-secondary/40">
            <PlayIcon className="h-12 w-12" aria-hidden />
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {module.read.paragraphs.map((para, i) => (
            <p
              key={i}
              className="text-[15px] leading-relaxed text-foreground/80"
            >
              {para}
            </p>
          ))}
        </div>
      </article>
    );
  }

  // Chat / Assessment placeholder (full behaviour out of scope for this brief).
  const placeholderIcon =
    module.type === "assessment" ? (
      <ClipboardCheckIcon className="h-8 w-8" aria-hidden />
    ) : (
      <ChatIcon className="h-8 w-8" aria-hidden />
    );
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          {placeholderIcon}
        </span>
        <h1 className="font-heading text-xl font-bold text-foreground">
          {module.title}
        </h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          This is a {module.typeLabel} module. Its full experience is built
          elsewhere in the platform; here it stands in as part of the course
          frame.
        </p>
      </div>
    </div>
  );
}
