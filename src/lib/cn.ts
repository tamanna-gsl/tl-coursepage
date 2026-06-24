// Tiny classnames helper (no external deps for the prototype).
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
