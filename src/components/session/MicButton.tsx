import { MicIcon } from "../icons";
import { cn } from "../../lib/cn";

export type VoicePhase =
  | "idle"
  | "listening"
  | "mod-speaking"
  | "processing"
  | "ended";

// Turquoise circular speak / push-to-talk control. Reflects the voice state and,
// while listening, scales a ring with the live audio level from the real mic.
export function MicButton({
  phase,
  level,
  onToggle,
  disabled,
}: {
  phase: VoicePhase;
  level: number;
  onToggle: () => void;
  disabled?: boolean;
}) {
  const listening = phase === "listening";
  const isDisabled = disabled || phase === "mod-speaking" || phase === "processing" || phase === "ended";

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isDisabled}
      aria-pressed={listening}
      aria-label={listening ? "Stop speaking" : "Start speaking"}
      className={cn(
        "relative flex h-16 w-16 items-center justify-center rounded-full text-primary-foreground shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        listening ? "bg-primary" : "bg-primary hover:bg-primary-dark"
      )}
    >
      {listening && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-primary/30"
          style={{ transform: `scale(${1 + Math.min(level, 1) * 0.6})` }}
        />
      )}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 rounded-full ring-2 ring-primary/40",
          listening && "animate-ping"
        )}
      />
      <MicIcon className="relative z-10 h-6 w-6" aria-hidden />
    </button>
  );
}
