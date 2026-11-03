import type { ReactNode } from "react";
import clsx from "@/lib/clsx";

type ScreenProps = {
  header: ReactNode;
  children: ReactNode;
  /** Bottom action area (button or chat input). */
  footer?: ReactNode;
  className?: string;
};

/**
 * Full-height mobile screen: header, flexible content, bottom action area.
 * At the design's 390×665 viewport each region lands at its Figma position.
 * On taller phones the gap above the footer absorbs the extra height; on
 * desktop the footer follows straight after the content.
 */
export function Screen({ header, children, footer, className }: ScreenProps) {
  return (
    <div className={clsx("flex min-h-dvh flex-col", className)}>
      {header}
      <main
        id="main"
        tabIndex={-1}
        className="flex flex-[1_0_auto] flex-col outline-none"
      >
        {/* Desktop: let the action follow the content instead of pinning it to
            the bottom of a tall window. Phones keep the bottom-anchored layout. */}
        <div className="flex flex-[1_0_auto] flex-col desktop:mb-[10dvh] desktop:grow-0">
          {children}
        </div>
        {footer && <div className="px-module-x py-module-y-sm">{footer}</div>}
      </main>
    </div>
  );
}
