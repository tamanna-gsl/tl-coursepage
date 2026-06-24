import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { CaseStudyItem } from "../types";
import {
  discussionScripts,
  moderatorFallback,
  type DiscussionTurn,
} from "../data/discussionScript";
import { SessionShell } from "../components/session/SessionShell";
import { ProgressStepper } from "../components/session/ProgressStepper";
import { CaseReferencePanel } from "../components/session/CaseReferencePanel";
import { MicButton, type VoicePhase } from "../components/session/MicButton";
import { Button } from "../components/Button";
import {
  AlertIcon,
  ClockIcon,
  MicIcon,
  MicOffIcon,
  RefreshIcon,
} from "../components/icons";
import { cn } from "../lib/cn";

type ErrorKind = null | "service" | "mic";
type MobilePanel = "conversation" | "reference";

const speakMs = (text: string) => Math.min(3500, 900 + text.length * 22);
const PROCESSING_MS = 1300;

function formatTime(total: number) {
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function DiscussionScreen({
  caseStudy,
  onEndDiscussion,
  onSaveExit,
}: {
  caseStudy: CaseStudyItem;
  onEndDiscussion: (caseStudy: CaseStudyItem) => void;
  onSaveExit: (caseStudy: CaseStudyItem) => void;
}) {
  const script = discussionScripts[caseStudy.id] ?? [];
  const title = `${caseStudy.title} - ${caseStudy.subject}`;

  const [transcript, setTranscript] = useState<DiscussionTurn[]>([]);
  const [phase, setPhase] = useState<VoicePhase>("mod-speaking");
  const [level, setLevel] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<ErrorKind>(script.length ? null : "service");
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("conversation");

  // Resizable split between Case Reference (left) and conversation (right).
  const [leftPct, setLeftPct] = useState(40);
  const splitContainerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const idxRef = useRef(0);
  const timers = useRef<number[]>([]);
  const startedRef = useRef(false);
  const endedRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const after = (ms: number, fn: () => void) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  };
  const clearTimers = () => {
    timers.current.forEach((id) => clearTimeout(id));
    timers.current = [];
  };
  const pushTurn = (turn: DiscussionTurn) =>
    setTranscript((t) => [...t, turn]);

  // --- Audio level from the real (already granted) mic stream ---
  const stopAudio = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setLevel(0);
  };

  const handleMicLost = () => {
    stopAudio();
    setError("mic");
    setPhase("idle");
  };

  const startAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new Ctx();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (const v of data) {
          const x = (v - 128) / 128;
          sum += x * x;
        }
        setLevel(Math.min(1, Math.sqrt(sum / data.length) * 3));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
      stream.getAudioTracks()[0]?.addEventListener("ended", handleMicLost);
    } catch {
      // Permission revoked or device removed.
      handleMicLost();
    }
  };

  // --- Conversation flow ---
  const endNow = () => {
    if (endedRef.current) return;
    endedRef.current = true;
    clearTimers();
    stopAudio();
    setPhase("ended");
    after(900, () => onEndDiscussion(caseStudy));
  };

  const afterModeratorSpoke = () => {
    if (idxRef.current >= script.length) endNow();
    else setPhase("idle");
  };

  const startConversation = () => {
    if (!script.length) return;
    pushTurn(script[0]);
    idxRef.current = 1;
    setPhase("mod-speaking");
    after(speakMs(script[0].text), afterModeratorSpoke);
  };

  // Student finished their turn: reveal their line, think, then moderator replies.
  const commitStudentTurn = () => {
    const studentTurn = script[idxRef.current];
    if (!studentTurn) return;
    pushTurn(studentTurn);
    idxRef.current += 1;
    setPhase("processing");
    after(PROCESSING_MS, () => {
      const modTurn = script[idxRef.current];
      if (!modTurn) {
        endNow();
        return;
      }
      pushTurn(modTurn);
      idxRef.current += 1;
      setPhase("mod-speaking");
      after(speakMs(modTurn.text), afterModeratorSpoke);
    });
  };

  const onMicToggle = () => {
    if (error || phase === "ended") return;
    if (phase === "idle") {
      setPhase("listening");
      void startAudio();
    } else if (phase === "listening") {
      stopAudio();
      commitStudentTurn();
    }
  };

  // Init once (guarded against StrictMode double-invoke).
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startConversation();
    return () => {
      clearTimers();
      stopAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Elapsed timer: counts up while live (not ended, no blocking error).
  useEffect(() => {
    if (phase === "ended" || error === "service") return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [phase, error]);

  // Keep the latest turn in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [transcript, phase]);

  // Panel resize: drag the divider to repartition the two panels (22%-60%).
  const clampPct = (p: number) => Math.min(60, Math.max(22, p));
  const onSplitterDown = () => {
    draggingRef.current = true;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  };
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current || !splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      setLeftPct(clampPct(((e.clientX - rect.left) / rect.width) * 100));
    };
    const onUp = () => {
      draggingRef.current = false;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);
  const onSplitterKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") setLeftPct((p) => clampPct(p - 3));
    if (e.key === "ArrowRight") setLeftPct((p) => clampPct(p + 3));
  };

  const statusText =
    error === "mic"
      ? "Microphone disconnected"
      : phase === "mod-speaking"
        ? "Moderator is speaking"
        : phase === "listening"
          ? "Listening"
          : phase === "processing"
            ? "Thinking"
            : phase === "ended"
              ? "Discussion complete"
              : "Your turn. Tap the microphone to speak.";

  // --- Dev-only triggers for the reviewable states ---
  const devFallback = () => {
    if (phase !== "idle") return;
    pushTurn({ role: "moderator", text: moderatorFallback });
  };
  const restart = () => {
    clearTimers();
    stopAudio();
    endedRef.current = false;
    startedRef.current = true;
    idxRef.current = 0;
    setTranscript([]);
    setError(null);
    setSeconds(0);
    startConversation();
  };

  return (
    <SessionShell title={title} onSaveExit={() => onSaveExit(caseStudy)}>
      <div className="flex h-[calc(100dvh-4rem)] flex-col">
        {/* Stepper kept at the same width as the reading screen (max-w-3xl)
            so it does not change size on the transition between screens. */}
        <div className="shrink-0 border-b border-border bg-background/90 px-4 py-3 backdrop-blur sm:px-6">
          <div className="mx-auto max-w-3xl">
            <ProgressStepper active="discussion" />
          </div>
        </div>

        {/* Mobile panel toggle */}
        <div className="flex shrink-0 gap-1 border-b border-border bg-card p-1.5 md:hidden">
          {(["conversation", "reference"] as MobilePanel[]).map((p) => (
            <button
              key={p}
              onClick={() => setMobilePanel(p)}
              className={cn(
                "flex-1 rounded-lg px-3 py-2 text-sm font-semibold capitalize transition-colors",
                mobilePanel === p
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {p === "reference" ? "Case Reference" : "Conversation"}
            </button>
          ))}
        </div>

        <div
          ref={splitContainerRef}
          className="flex min-h-0 flex-1"
          style={{ ["--left" as string]: `${leftPct}%` }}
        >
          {/* Left: Case Reference */}
          <CaseReferencePanel
            caseId={caseStudy.id}
            className={cn(
              "min-h-0 w-full border-border md:w-[var(--left)] md:shrink-0 md:border-r",
              mobilePanel === "reference" ? "flex" : "hidden md:flex"
            )}
          />

          {/* Draggable divider (desktop only) */}
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize panels"
            aria-valuenow={Math.round(leftPct)}
            aria-valuemin={22}
            aria-valuemax={60}
            tabIndex={0}
            onPointerDown={onSplitterDown}
            onKeyDown={onSplitterKey}
            className="hidden w-1.5 shrink-0 cursor-col-resize bg-border/60 transition-colors hover:bg-primary/40 focus-visible:bg-primary/40 focus-visible:outline-none md:block"
          />

          {/* Right: conversation */}
          <section
            className={cn(
              "relative min-h-0 flex-1 flex-col bg-background",
              mobilePanel === "conversation" ? "flex" : "hidden md:flex"
            )}
          >
            {/* Status bar */}
            <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-bold text-destructive">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full bg-destructive",
                    phase !== "ended" && "animate-pulse"
                  )}
                  aria-hidden
                />
                {phase === "ended" ? "Ended" : "Live"}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <ClockIcon className="h-4 w-4" aria-hidden />
                <span aria-label={`Elapsed time ${formatTime(seconds)}`}>
                  {formatTime(seconds)}
                </span>
              </span>
            </div>

            {/* Transcript */}
            <div className="relative min-h-0 flex-1">
              <div
                ref={scrollRef}
                role="log"
                aria-live="polite"
                aria-relevant="additions"
                aria-label="Discussion transcript"
                className="h-full overflow-y-auto px-4 py-5 sm:px-6"
              >
                <ul className="mx-auto flex max-w-2xl flex-col gap-4">
                  {transcript.map((turn, i) => (
                    <li
                      key={i}
                      className={cn(
                        "flex",
                        turn.role === "student"
                          ? "justify-end"
                          : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm",
                          turn.role === "student"
                            ? "rounded-br-md bg-primary text-primary-foreground"
                            : "rounded-bl-md border border-border bg-card text-foreground"
                        )}
                      >
                        <span className="sr-only">
                          {turn.role === "student"
                            ? "You said: "
                            : "Moderator said: "}
                        </span>
                        {turn.text}
                      </div>
                    </li>
                  ))}

                  {phase === "processing" && (
                    <li className="flex justify-start">
                      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3.5">
                        <span className="sr-only">Moderator is thinking</span>
                        {[0, 1, 2].map((d) => (
                          <span
                            key={d}
                            className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60"
                            style={{ animationDelay: `${d * 0.15}s` }}
                            aria-hidden
                          />
                        ))}
                      </div>
                    </li>
                  )}
                </ul>
              </div>

              {/* Service-unavailable overlay (rest of app stays usable) */}
              {error === "service" && (
                <div
                  role="alert"
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/95 px-6 text-center backdrop-blur"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <AlertIcon className="h-7 w-7" />
                  </span>
                  <div>
                    <p className="font-heading text-lg font-bold text-foreground">
                      Case studies are temporarily unavailable
                    </p>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                      Please try again shortly. Your progress has been kept.
                    </p>
                  </div>
                  <Button
                    className="!rounded-full"
                    onClick={() => setError(null)}
                  >
                    <RefreshIcon className="h-4 w-4" />
                    Try again
                  </Button>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="shrink-0 border-t border-border px-4 py-4 sm:px-6">
              {error === "mic" && (
                <div
                  role="alert"
                  className="mx-auto mb-3 flex max-w-2xl items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3"
                >
                  <span className="mt-0.5 shrink-0 text-destructive">
                    <MicOffIcon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      The discussion is paused: microphone disconnected
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Please reconnect your microphone or allow access in your
                      browser's site settings, then resume.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="!rounded-full"
                    onClick={() => {
                      setError(null);
                      setPhase("idle");
                    }}
                  >
                    Resume
                  </Button>
                </div>
              )}

              <p
                role="status"
                aria-live="polite"
                className="mb-3 flex items-center justify-center gap-2 text-center text-sm font-medium text-muted-foreground"
              >
                {phase === "mod-speaking" && (
                  <span className="flex items-end gap-0.5" aria-hidden>
                    {[0, 1, 2].map((b) => (
                      <span
                        key={b}
                        className="w-1 animate-pulse rounded-full bg-primary"
                        style={{
                          height: `${6 + b * 4}px`,
                          animationDelay: `${b * 0.15}s`,
                        }}
                      />
                    ))}
                  </span>
                )}
                {phase === "listening" && (
                  <MicIcon className="h-4 w-4 text-primary" aria-hidden />
                )}
                {statusText}
              </p>

              <div className="mx-auto grid max-w-2xl grid-cols-[1fr_auto_1fr] items-center">
                <span aria-hidden />
                <MicButton
                  phase={phase}
                  level={level}
                  onToggle={onMicToggle}
                  disabled={error !== null}
                />
                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    className="!rounded-full"
                    onClick={endNow}
                    disabled={phase === "ended"}
                  >
                    End Discussion
                  </Button>
                </div>
              </div>
            </div>

            {/* Ending transition */}
            {phase === "ended" && (
              <div
                role="alert"
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-background/95 px-6 text-center backdrop-blur"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ClockIcon className="h-7 w-7" />
                </span>
                <div>
                  <p className="font-heading text-lg font-bold text-foreground">
                    Discussion complete
                  </p>
                  <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                    Taking you to your performance report...
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <DiscussionDevControls
        onFallback={devFallback}
        onService={() => setError("service")}
        onMicLost={handleMicLost}
        onRestart={restart}
      />
    </SessionShell>
  );
}

// Prototype-only control to preview the reviewable states.
function DiscussionDevControls({
  onFallback,
  onService,
  onMicLost,
  onRestart,
}: {
  onFallback: () => void;
  onService: () => void;
  onMicLost: () => void;
  onRestart: () => void;
}) {
  const btn =
    "rounded-full px-2.5 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted";
  return (
    <div className="fixed bottom-3 left-3 z-40 flex items-center gap-1 rounded-full border border-border bg-card/95 p-1 shadow-module backdrop-blur">
      <span className="px-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
        Dev
      </span>
      <button className={btn} onClick={onFallback}>
        Fallback
      </button>
      <button className={btn} onClick={onService}>
        Service error
      </button>
      <button className={btn} onClick={onMicLost}>
        Mic lost
      </button>
      <button className={btn} onClick={onRestart}>
        Restart
      </button>
    </div>
  );
}
