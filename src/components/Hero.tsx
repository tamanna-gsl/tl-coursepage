export function Hero({ count }: { count: number }) {
  return (
    <section className="overflow-hidden rounded-lg bg-gradient-hero p-6 text-primary-foreground shadow-module sm:p-8">
      <p className="text-xs font-bold uppercase tracking-widest text-primary-foreground/80">
        Your learning
      </p>
      <h1 className="mt-2 font-heading text-2xl font-extrabold leading-tight sm:text-3xl">
        Pick up where you left off
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-primary-foreground/90 sm:text-base">
        Short courses, in-depth courses, and case studies, all in one place. Each
        one is led by an AI mentor who untangles your doubts. {count} learning
        {count === 1 ? " item" : " items"} ready for you.
      </p>
    </section>
  );
}
