"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { AnimationItem } from "lottie-web";

const cache = new Map<string, Promise<unknown>>();

/** Fetches (once per path) the Lottie JSON served from /public. */
function loadAnimationData(path: string) {
  if (!cache.has(path)) {
    cache.set(
      path,
      fetch(path).then((res) => {
        if (!res.ok) throw new Error(`Failed to load Lottie: ${path}`);
        return res.json();
      }),
    );
  }
  return cache.get(path)!;
}

/**
 * Mounts a Lottie animation into `container` without autoplay. Playback is
 * left to the caller so it can be driven by a GSAP timeline (see
 * `tweenLottie`).
 */
export function useLottie(container: RefObject<HTMLElement | null>, path: string) {
  const animRef = useRef<AnimationItem | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let anim: AnimationItem | null = null;

    Promise.all([
      // The "light" build only ships the SVG renderer — ~60% smaller.
      import("lottie-web/build/player/lottie_light"),
      loadAnimationData(path),
    ])
      .then(([mod, animationData]) => {
        if (cancelled || !container.current) return;
        anim = mod.default.loadAnimation({
          container: container.current,
          renderer: "svg",
          loop: false,
          autoplay: false,
          animationData,
          rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
        });
        anim.addEventListener("DOMLoaded", () => {
          if (cancelled) return;
          animRef.current = anim;
          setReady(true);
        });
      })
      .catch((err) => console.error(err));

    return () => {
      cancelled = true;
      anim?.destroy();
      animRef.current = null;
      setReady(false);
    };
  }, [container, path]);

  return { animRef, ready };
}
