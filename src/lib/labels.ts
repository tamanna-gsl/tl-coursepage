import type { LearningKind, LearningStatus } from "../types";

export const statusLabel: Record<LearningStatus, string> = {
  "not-started": "Not Started",
  "in-progress": "In Progress",
  completed: "Completed",
};

export const kindLabel: Record<LearningKind, string> = {
  "short-course": "Short Course",
  "in-depth-course": "In-Depth Course",
  "case-study": "Case Study",
};

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} mins`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} hr ${rest} mins` : `${hours} hr`;
}
