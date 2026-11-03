"use client";

import type { MouseEvent } from "react";

/**
 * "Skip to content" link. Next.js keeps recently visited pages mounted but
 * hidden, so several <main id="main"> can exist at once; this focuses the one
 * that is actually visible instead of relying on the first matching id.
 */
export function SkipLink() {
  const skip = (event: MouseEvent<HTMLAnchorElement>) => {
    const main = Array.from(
      document.querySelectorAll<HTMLElement>("main"),
    ).find((el) => el.getClientRects().length > 0);
    if (!main) return;
    event.preventDefault();
    main.focus();
    main.scrollIntoView({ block: "start" });
  };

  return (
    <a
      className="absolute top-2 left-2 z-100 translate-y-[-200%] rounded-pill bg-brand-action px-4 py-2 text-text-dark focus-visible:translate-none"
      href="#main"
      onClick={skip}
    >
      Skip to content
    </a>
  );
}
