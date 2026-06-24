import { useState } from "react";
import type { CaseStudyItem } from "../types";
import { formatDuration } from "../lib/labels";
import { readingContent } from "../data/readingContent";
import { SessionShell } from "../components/session/SessionShell";
import { ProgressStepper } from "../components/session/ProgressStepper";
import { Button } from "../components/Button";
import { Chip } from "../components/Chip";
import { AlertIcon, ArrowRightIcon, MicOffIcon } from "../components/icons";
import { cn } from "../lib/cn";

type ContentState = "loading" | "ready" | "error";
type MicState = "idle" | "pending" | "denied";

export function ReadingScreen({
  caseStudy,
  onStartDiscussion,
  onSaveExit,
  onBack,
}: {
  caseStudy: CaseStudyItem;
  onStartDiscussion: (caseStudy: CaseStudyItem) => void;
  onSaveExit: (caseStudy: CaseStudyItem) => void;
  onBack: () => void;
}) {
  const content = readingContent[caseStudy.id];
  // With in-memory data this is always "ready"; "loading"/"error" are wired so
  // the real app (which fetches case content) does not flash empty or break.
  const [contentState, setContentState] = useState<ContentState>(
    content ? "ready" : "error"
  );
  const [mic, setMic] = useState<MicState>("idle");

  const title = `${caseStudy.title} - ${caseStudy.subject}`;

  // Just-in-time microphone gate. The student reads the case with no prompt;
  // access is requested only when they choose to start the discussion.
  const startDiscussion = async () => {
    if (mic === "pending") return;
    setMic("pending");
    try {
      const media = navigator.mediaDevices;
      if (!media?.getUserMedia) throw new Error("unsupported");
      const stream = await media.getUserMedia({ audio: true });
      // Release the mic immediately; the discussion screen will reacquire it.
      stream.getTracks().forEach((t) => t.stop());
      setMic("idle");
      onStartDiscussion(caseStudy);
    } catch {
      // Denied or blocked: stay on the reading screen and guide the student.
      setMic("denied");
    }
  };

  const buttonLabel =
    mic === "pending"
      ? "Requesting microphone..."
      : mic === "denied"
        ? "Try again"
        : "I've read the case. Start Discussion";

  return (
    <SessionShell title={title} onSaveExit={() => onSaveExit(caseStudy)}>
      <div className="sticky top-16 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
          <ProgressStepper active="reading" />
        </div>
      </div>

      {contentState === "error" || !content ? (
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6">
          <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertIcon className="h-8 w-8" />
          </span>
          <h1 className="font-heading text-xl font-bold text-foreground">
            We could not open this case
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            This case study is unavailable right now. Please head back to your
            library and try again in a little while.
          </p>
          <Button className="mt-6 !rounded-full" onClick={onBack}>
            Back to library
          </Button>
        </div>
      ) : contentState === "loading" ? (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6" aria-hidden>
          <div className="skeleton h-9 w-3/4 rounded-md" />
          <div className="mt-4 flex gap-2">
            <div className="skeleton h-6 w-28 rounded-full" />
            <div className="skeleton h-6 w-16 rounded-full" />
          </div>
          <div className="mt-8 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={cn("skeleton h-4 rounded", i % 4 === 3 ? "w-2/3" : "w-full")}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <article className="mx-auto max-w-3xl px-4 pb-44 pt-6 sm:px-6 sm:pb-40">
            <h1 className="font-heading text-3xl font-extrabold leading-tight text-secondary sm:text-4xl">
              {caseStudy.title} - {caseStudy.subject}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <Chip kind="case-study">{caseStudy.subject}</Chip>
              <span className="text-muted-foreground" aria-hidden>
                &middot;
              </span>
              <span className="text-muted-foreground">
                {formatDuration(caseStudy.durationMinutes)}
              </span>
            </div>

            <div className="mt-8">
              <h2 className="font-heading text-xl font-bold text-secondary">
                {content.title}
              </h2>
              <div className="mt-5 space-y-6">
                {content.sections.map((section) => (
                  <section key={section.heading}>
                    <h3 className="font-heading text-base font-bold text-foreground">
                      {section.heading}
                    </h3>
                    <div className="mt-2 space-y-3">
                      {section.paragraphs.map((para, i) => (
                        <p
                          key={i}
                          className="text-[15px] leading-relaxed text-foreground/80"
                        >
                          {para}
                        </p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </article>

          <div className="sticky bottom-0 z-20 border-t border-border bg-background/92 backdrop-blur">
            <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
              {mic === "denied" && (
                <div
                  role="alert"
                  className="mb-3 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-left"
                >
                  <span className="mt-0.5 shrink-0 text-destructive">
                    <MicOffIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      The discussion needs microphone access
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Please allow the microphone in your browser's site
                      settings, then try again.
                    </p>
                  </div>
                </div>
              )}
              <div className="flex justify-center">
                <Button
                  variant="primary"
                  className="w-full !rounded-full sm:w-auto sm:min-w-[20rem]"
                  onClick={startDiscussion}
                  disabled={mic === "pending"}
                  aria-busy={mic === "pending"}
                >
                  {buttonLabel}
                  {mic !== "pending" && <ArrowRightIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      <ReadingDevControls
        contentState={contentState}
        onContentState={setContentState}
        mic={mic}
        onMic={setMic}
      />
    </SessionShell>
  );
}

// Prototype-only control so reviewers can preview the reading screen's states
// (default, loading, error, microphone denied) without changing code.
function ReadingDevControls({
  contentState,
  onContentState,
  mic,
  onMic,
}: {
  contentState: ContentState;
  onContentState: (s: ContentState) => void;
  mic: MicState;
  onMic: (m: MicState) => void;
}) {
  const states: ContentState[] = ["ready", "loading", "error"];
  return (
    <div className="fixed bottom-4 left-4 z-40 flex flex-col gap-2">
      <div className="flex items-center gap-1 rounded-full border border-border bg-card/95 p-1 shadow-module backdrop-blur">
        <span className="px-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          Reading
        </span>
        {states.map((s) => (
          <button
            key={s}
            onClick={() => onContentState(s)}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold capitalize transition-colors",
              contentState === s
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {s === "ready" ? "Default" : s}
          </button>
        ))}
        <span className="ml-1 border-l border-border pl-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          Mic
        </span>
        <button
          onClick={() => onMic(mic === "denied" ? "idle" : "denied")}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
            mic === "denied"
              ? "bg-destructive text-destructive-foreground"
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          Denied
        </button>
      </div>
    </div>
  );
}
