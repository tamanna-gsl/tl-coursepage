import { Button } from "../Button";
import { EmptyIcon } from "../icons";

export function EmptyState({ onReset }: { onReset?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center shadow-card">
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <EmptyIcon className="h-8 w-8" />
      </span>
      <h3 className="font-heading text-xl font-bold text-foreground">
        No learning available yet
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        There is nothing here for now. New courses and case studies will appear
        on this page as soon as your school adds them.
      </p>
      {onReset && (
        <Button variant="outline" className="mt-6" onClick={onReset}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
