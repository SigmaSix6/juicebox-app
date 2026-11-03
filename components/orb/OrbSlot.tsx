"use client";

import { useLayoutEffect, useRef } from "react";
import clsx from "@/lib/clsx";
import { useOrb, type OrbVariant } from "./OrbContext";

/** The orb's footprint in each page layout. */
const SIZES: Record<OrbVariant, string> = {
  lg: "w-[274px] h-[290px]",
  md: "w-[146px] h-[155px]",
  sm: "w-[29px] h-[31px]",
};

type OrbSlotProps = {
  variant: OrbVariant;
  playKey?: string | number;
  loop?: boolean;
  className?: string;
};

/**
 * Reserves the orb's space in a page's layout and tells the shared
 * <OrbStage> to move there. Purely decorative, so hidden from assistive tech.
 */
export function OrbSlot({ variant, playKey, loop, className }: OrbSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { setTarget } = useOrb();

  useLayoutEffect(() => {
    if (!ref.current) return;
    setTarget({ el: ref.current, variant, playKey, loop });
  }, [setTarget, variant, playKey, loop]);

  useLayoutEffect(() => () => setTarget(null), [setTarget]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-orb-slot={variant}
      className={clsx("mx-auto flex-none", SIZES[variant], className)}
    />
  );
}
