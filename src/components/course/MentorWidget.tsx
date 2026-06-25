import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { Mentor } from "../../data/courseContent";
import { Button } from "../Button";
import { SwitchIcon, XIcon } from "../icons";
import { cn } from "../../lib/cn";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface ChatMessage {
  from: "mentor" | "you";
  text: string;
}

function Avatar({ mentor, className }: { mentor: Mentor; className?: string }) {
  return mentor.imageUrl ? (
    <img
      src={mentor.imageUrl}
      alt=""
      className={cn("rounded-full object-cover", className)}
    />
  ) : (
    <span
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-tertiary text-xs font-bold text-foreground",
        className
      )}
    >
      {initials(mentor.name)}
    </span>
  );
}

// Floating mentor presence, like an assistant / messaging widget. The avatar
// sits bottom-right; clicking opens a chat panel with a scripted stand-in
// conversation (no real AI in the prototype) and a way to switch mentor.
export function MentorWidget({
  mentors,
  activeIndex,
  onSwitch,
}: {
  mentors: Mentor[];
  activeIndex: number;
  onSwitch: (index: number) => void;
}) {
  const mentor = mentors[activeIndex % mentors.length];
  const [open, setOpen] = useState(false);
  const [picking, setPicking] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Draggable position. null = default corner (clear of the footer); once
  // dragged, becomes an explicit top-left in pixels.
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const drag = useRef<{
    sx: number;
    sy: number;
    bx: number;
    by: number;
    moved: boolean;
  } | null>(null);

  const onPointerDown = (e: ReactPointerEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    drag.current = {
      sx: e.clientX,
      sy: e.clientY,
      bx: rect.left,
      by: rect.top,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) d.moved = true;
    const size = 56;
    setPos({
      x: Math.min(Math.max(8, d.bx + dx), window.innerWidth - size - 8),
      y: Math.min(Math.max(8, d.by + dy), window.innerHeight - size - 8),
    });
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (d && !d.moved) setOpen((o) => !o);
  };


  // Seed / reset the greeting when the panel opens or the mentor changes.
  useEffect(() => {
    if (!open) return;
    setMessages([
      {
        from: "mentor",
        text: `Hi, I'm ${mentor.name}. Ask me anything about this chapter and I'll help you think it through.`,
      },
    ]);
    setPicking(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeIndex]);

  useEffect(() => {
    if (open && !picking) inputRef.current?.focus();
  }, [open, picking]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (picking) setPicking(false);
        else setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, picking]);

  const send = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { from: "you", text }]);
    // Scripted stand-in reply; the real mentor chat is a backend service.
    window.setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          from: "mentor",
          text: "Good question. Try breaking it into smaller steps, and tell me what you come up with.",
        },
      ]);
    }, 700);
  };

  return (
    <div
      ref={containerRef}
      className={cn("fixed z-50", pos ? "" : "bottom-24 right-6")}
      style={pos ? { left: pos.x, top: pos.y } : undefined}
    >
      {open && (
        <div
          role="dialog"
          aria-label={`Chat with ${mentor.name}`}
          className="fixed inset-x-4 bottom-24 flex h-[28rem] max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-module sm:absolute sm:inset-x-auto sm:bottom-16 sm:right-0 sm:w-96"
        >
          <div className="flex items-center gap-3 border-b border-border bg-secondary px-4 py-3 text-secondary-foreground">
            <Avatar mentor={mentor} className="h-9 w-9 ring-2 ring-white/40" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{mentor.name}</p>
              <p className="truncate text-xs text-secondary-foreground/80">
                {mentor.role}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPicking((p) => !p)}
              aria-label="Switch mentor"
              aria-pressed={picking}
              className="flex h-8 w-8 items-center justify-center rounded-full text-secondary-foreground/90 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <SwitchIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-8 w-8 items-center justify-center rounded-full text-secondary-foreground/90 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>

          {picking ? (
            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Switch mentor
              </p>
              <ul className="space-y-1">
                {mentors.map((m, i) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSwitch(i);
                        setPicking(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        i === activeIndex && "bg-primary/10"
                      )}
                    >
                      <Avatar mentor={m} className="h-9 w-9" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-foreground">
                          {m.name}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {m.role}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <div
                ref={scrollRef}
                role="log"
                aria-live="polite"
                className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3"
              >
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex",
                      m.from === "you" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                        m.from === "you"
                          ? "rounded-br-md bg-primary text-primary-foreground"
                          : "rounded-bl-md bg-muted text-foreground"
                      )}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <form
                onSubmit={send}
                className="flex items-center gap-2 border-t border-border p-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message your mentor"
                  aria-label="Message your mentor"
                  className="min-w-0 flex-1 rounded-full border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="!rounded-full"
                >
                  Send
                </Button>
              </form>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        aria-expanded={open}
        aria-label={
          open
            ? "Close mentor chat"
            : `Chat with your mentor, ${mentor.name}. Drag to move.`
        }
        className="relative h-14 w-14 cursor-grab touch-none rounded-full shadow-module ring-2 ring-card transition-transform hover:scale-105 active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar mentor={mentor} className="h-full w-full" />
        <span
          className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-[hsl(142_71%_45%)]"
          aria-hidden
        />
      </button>
    </div>
  );
}
