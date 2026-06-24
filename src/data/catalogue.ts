import type { LearningItem } from "../types";

// Real GSL catalogue sample. Used as in-memory data for the prototype.
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
  },
  {
    id: "hbi-innovation-creativity",
    kind: "in-depth-course",
    title: "HBI Innovation and Creativity",
    description:
      "Build an innovative thinking process, understand how creativity drives change, and learn to turn fresh ideas into action.",
    status: "not-started",
    audience: "Grades 7 to 12",
    subject: "Innovation",
    totalChapters: 5,
    completedChapters: 0,
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
  },
  {
    id: "tata-power-energy",
    kind: "case-study",
    title: "Tata Power: Renewable & Nuclear Energy",
    description:
      "Explore how Tata Power balances renewable and nuclear energy, and the trade-offs behind powering a growing India.",
    status: "not-started",
    audience: "Grades 7 to 12",
    subject: "Energy & Sustainability",
    difficulty: "Easy",
    durationMinutes: 15,
  },
  // Placeholder items to round out the grid. Clearly flagged as placeholders.
  {
    id: "placeholder-money-matters",
    kind: "in-depth-course",
    title: "Money Matters (placeholder)",
    description:
      "Placeholder item. Understand how money works in a business: costs, revenue, and profit, and how to make informed decisions.",
    status: "not-started",
    audience: "Ages 12 to 17",
    subject: "Financial Literacy",
    totalChapters: 4,
    completedChapters: 0,
    isPlaceholder: true,
  },
  {
    id: "placeholder-amul-story",
    kind: "case-study",
    title: "The Amul Story (placeholder)",
    description:
      "Placeholder item. How a cooperative in Gujarat became a household name and reshaped India's dairy industry.",
    status: "not-started",
    audience: "Grades 7 to 12",
    subject: "Business & Cooperatives",
    difficulty: "Medium",
    durationMinutes: 20,
    isPlaceholder: true,
  },
];
