import type { LearningItem } from "../types";
import entrepreneurshipImg from "./../assets/entrepreneurship.png";
import empathyImg from "./../assets/empathy-movie.png";
import nykaaImg from "./../assets/nykaa-cover.png";

// Real GSL catalogue sample. Used as in-memory data for the prototype.
// Order mirrors the landing page: a short course, an in-depth course, and a
// case study, one of each kind.
export const catalogue: LearningItem[] = [
  {
    id: "empathy",
    kind: "short-course",
    title: "Empathy",
    description:
      "Social-emotional learning through an interactive movie & dialogue.",
    status: "completed",
    audience: "Ages 9 to 14",
    subject: "Social and Emotional Learning",
    totalChapters: 3,
    completedChapters: 3,
    tags: ["Interactive characters", "Social Emotional Learning", "20 mins"],
    imageUrl: empathyImg,
  },
  {
    id: "entrepreneurship-101",
    kind: "in-depth-course",
    title: "Entrepreneurship 101",
    description:
      "Explore how ideas turn into ventures and learn to think like an entrepreneur.",
    status: "in-progress",
    audience: "Ages 12 to 17",
    subject: "Entrepreneurship",
    totalChapters: 8,
    completedChapters: 2,
    tags: ["8 chapters", "Mentors", "Grade 7"],
    imageUrl: entrepreneurshipImg,
  },
  {
    id: "nykaa-story",
    kind: "case-study",
    title: "The Nykaa Story",
    description:
      "Debate how Falguni Nayar spotted a market gap and built Nykaa into a national brand.",
    status: "not-started",
    audience: "Ages 12 to 17",
    subject: "Entrepreneurship",
    difficulty: "Easy",
    durationMinutes: 15,
    imageUrl: nykaaImg,
  },
];
