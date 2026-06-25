import type { CourseModule } from "../../data/courseContent";

export type ModuleStatus = "completed" | "current" | "available" | "locked";

// Small, clear gating model. Modules unlock in sequence: a module is unlocked
// once the previous one is completed. Screen 9 plugs a Case Study module into
// this same model without rework.
export function statusOf(
  modules: CourseModule[],
  index: number,
  completed: Set<string>,
  currentId: string
): ModuleStatus {
  const id = modules[index].id;
  if (completed.has(id)) return "completed";
  const unlocked = index === 0 || completed.has(modules[index - 1].id);
  if (!unlocked) return "locked";
  if (id === currentId) return "current";
  return "available";
}

export function completionPercent(
  modules: CourseModule[],
  completed: Set<string>
): number {
  if (modules.length === 0) return 0;
  const done = modules.filter((m) => completed.has(m.id)).length;
  return Math.round((done / modules.length) * 100);
}

export function completedCount(
  modules: CourseModule[],
  completed: Set<string>
): number {
  return modules.filter((m) => completed.has(m.id)).length;
}
