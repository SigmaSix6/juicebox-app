import clsx from "@/lib/clsx";

type PaginationDotsProps = {
  count: number;
  active: number;
  className?: string;
};

/**
 * 8px progress dots. Decorative: slide position is announced by the
 * carousel itself ("Slide 2 of 3"), so the dots are hidden from assistive tech.
 */
export function PaginationDots({ count, active, className }: PaginationDotsProps) {
  return (
    <div className={clsx("flex justify-center gap-3xs", className)} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={clsx(
            "size-2 rounded-full transition-colors duration-250 ease-out",
            i === active ? "bg-brand-accent" : "bg-dot",
          )}
        />
      ))}
    </div>
  );
}
