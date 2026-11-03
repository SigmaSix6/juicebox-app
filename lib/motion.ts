"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION).matches;
}

/** Shared easing/duration vocabulary so every screen moves the same way. */
export const motion = {
  ease: "power3.out",
  easeInOut: "expo.inOut",
  enter: 0.7,
  stagger: 0.08,
};

/**
 * The homepage plays a longer intro (hexagon Lottie blooming into the orb)
 * only on the very first page view of a session. <OrbStage> flips `pending`
 * once it has run; pages read it to time their own entrance.
 */
export const intro = {
  pending: true,
  /** Seconds until the orb has finished blooming. */
  duration: 1.5,
};

export { gsap, useGSAP };
