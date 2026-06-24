// Shared learning-item model for the Talk & Learn course list.
// Short courses, in-depth courses, and case studies are all first-class
// learning items that share one status model.

export type LearningStatus = "not-started" | "in-progress" | "completed";

export type LearningKind = "short-course" | "in-depth-course" | "case-study";

export type Difficulty = "Easy" | "Medium" | "Hard";

interface BaseLearningItem {
  id: string;
  kind: LearningKind;
  title: string;
  description: string;
  status: LearningStatus;
  /** Audience, e.g. "Ages 9 to 14" or "Grades 7 to 12". */
  audience: string;
  subject: string;
  /** Optional thumbnail. When absent, a clean placeholder is shown. */
  imageUrl?: string;
  /** Clearly flags filler items added only to populate the grid. */
  isPlaceholder?: boolean;
}

export interface CourseItem extends BaseLearningItem {
  kind: "short-course" | "in-depth-course";
  /** Total chapters in the course. */
  totalChapters: number;
  /** Chapters the student has completed so far. */
  completedChapters: number;
  /** Metadata chips shown on the card. */
  tags: string[];
}

export interface CaseStudyItem extends BaseLearningItem {
  kind: "case-study";
  difficulty: Difficulty;
  /** Approximate time to complete, in minutes. */
  durationMinutes: number;
}

export type LearningItem = CourseItem | CaseStudyItem;

export function isCaseStudy(item: LearningItem): item is CaseStudyItem {
  return item.kind === "case-study";
}

export function isCourse(item: LearningItem): item is CourseItem {
  return item.kind === "short-course" || item.kind === "in-depth-course";
}
