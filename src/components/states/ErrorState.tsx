import { Button } from "../Button";
import { AlertIcon, RefreshIcon } from "../icons";

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-16 text-center shadow-card">
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertIcon className="h-8 w-8" />
      </span>
      <h3 className="font-heading text-xl font-bold text-foreground">
        We could not load your library
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        Something went wrong while fetching your courses and case studies. Please
        check your connection and try again.
      </p>
      <Button className="mt-6" onClick={onRetry}>
        <RefreshIcon className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}
