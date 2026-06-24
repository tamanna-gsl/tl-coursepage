import type { LearningItem } from "../types";

// Real GSL catalogue sample. Used as in-memory data for the prototype.
// Order mirrors the landing page: a short course, an in-depth course, and a
// case study, one of each kind.
export const catalogue: LearningItem[] = [
  {
    id: "empathy",
    kind: "short-course",
    title: "Empathy",
    description:
      "A short course built around an interactive film about bullying. Watch the story unfold, then talk it through with your AI mentor.",
    status: "completed",
    audience: "Ages 9 to 14",
    subject: "Social and Emotional Learning",
    totalChapters: 3,
    completedChapters: 3,
    // imageUrl: set once the landing page photo is available.
  },
  {
    id: "entrepreneurship-101",
    kind: "in-depth-course",
    title: "Entrepreneurship 101",
    description:
      "Learn how to spot opportunities, solve problems, and make smart decisions, then build a business plan from just an idea.",
    status: "in-progress",
    audience: "Ages 12 to 17",
    subject: "Entrepreneurship",
    totalChapters: 6,
    completedChapters: 2,
    // imageUrl: set once the landing page photo is available.
  },
  {
    id: "nykaa-story",
    kind: "case-study",
    title: "The Nykaa Story",
    description:
      "Trace how Falguni Nayar built Nykaa into one of India's biggest beauty brands, and what her journey teaches about entrepreneurship.",
    status: "not-started",
    audience: "Ages 12 to 17",
    subject: "Entrepreneurship",
    difficulty: "Easy",
    durationMinutes: 15,
    // imageUrl: set once the landing page photo is available.
  },
];
