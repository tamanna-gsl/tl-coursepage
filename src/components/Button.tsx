import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

type Variant =
  | "primary"
  | "gradient"
  | "inverse"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  // Solid deep teal: used for session buttons (after a case starts).
  primary:
    "bg-primary-dark text-primary-foreground hover:bg-[hsl(171_100%_22%)] shadow-sm",
  // Gradient: used for the landing page / library card CTAs.
  gradient:
    "bg-gradient-hero text-primary-foreground hover:opacity-95 shadow-sm",
  // White CTA for use on a coloured/dark surface.
  inverse: "bg-white text-secondary hover:bg-white/90 shadow-sm",
  destructive:
    "bg-destructive text-destructive-foreground hover:opacity-90 shadow-sm",
  secondary:
    "bg-secondary text-secondary-foreground hover:opacity-90 shadow-sm",
  outline:
    "border border-border bg-card text-foreground hover:bg-muted",
  ghost: "text-foreground hover:bg-muted",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-200 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
