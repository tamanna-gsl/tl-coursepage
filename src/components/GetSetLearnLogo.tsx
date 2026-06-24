// Get Set Learn wordmark placeholder for the session shell. In the real repo
// this is replaced by the licensed logo asset.
export function GetSetLearnLogo() {
  return (
    <div className="flex items-center gap-2">
      <span className="grid grid-cols-2 gap-0.5" aria-hidden>
        <span className="h-2 w-2 rounded-full bg-primary" />
        <span className="h-2 w-2 rounded-full bg-primary" />
        <span className="h-2 w-2 rounded-full bg-secondary" />
        <span className="h-2 w-2 rounded-full bg-primary" />
      </span>
      <span className="hidden text-[11px] font-extrabold uppercase leading-[1.05] tracking-wide text-secondary sm:block">
        Get
        <br />
        Set
        <br />
        Learn
      </span>
      <span className="sr-only">Get Set Learn</span>
    </div>
  );
}
