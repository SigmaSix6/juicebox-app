"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type OrbVariant = "lg" | "md" | "sm";

export type OrbTarget = {
  el: HTMLElement;
  variant: OrbVariant;
  /** Changing this replays the hexagon Lottie (e.g. on every form step). */
  playKey?: string | number;
  /** Loop the hexagon Lottie while this slot is mounted. */
  loop?: boolean;
};

type OrbContextValue = {
  target: OrbTarget | null;
  setTarget: (target: OrbTarget | null) => void;
};

const OrbContext = createContext<OrbContextValue | null>(null);

/**
 * The orb is rendered once, by <OrbStage> in the root layout, so it can glide
 * between screens. Pages declare where it should sit by rendering an
 * <OrbSlot>, which registers itself here.
 */
export function OrbProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<OrbTarget | null>(null);
  const value = useMemo(() => ({ target, setTarget }), [target]);
  return <OrbContext.Provider value={value}>{children}</OrbContext.Provider>;
}

export function useOrb() {
  const ctx = useContext(OrbContext);
  if (!ctx) throw new Error("useOrb must be used inside <OrbProvider>");
  return ctx;
}
