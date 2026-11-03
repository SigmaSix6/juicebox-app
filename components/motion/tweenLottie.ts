import type { AnimationItem } from "lottie-web";
import { gsap } from "gsap";

type Options = {
  from?: number;
  to?: number;
  duration?: number;
  ease?: string;
  repeat?: number;
  repeatDelay?: number;
};

/**
 * Drives a Lottie animation's playhead with a GSAP tween instead of Lottie's
 * own ticker. This lets the animation share GSAP's timing, easing, timelines
 * and global ticker (which Lenis also runs on).
 */
export function tweenLottie(anim: AnimationItem, opts: Options = {}) {
  const total = anim.totalFrames - 1;
  const from = opts.from ?? 0;
  const to = opts.to ?? total;
  const playhead = { frame: from };
  anim.goToAndStop(from, true);

  return gsap.to(playhead, {
    frame: to,
    duration: opts.duration ?? Math.abs(to - from) / anim.frameRate,
    ease: opts.ease ?? "none",
    repeat: opts.repeat ?? 0,
    repeatDelay: opts.repeatDelay ?? 0,
    onUpdate: () => anim.goToAndStop(playhead.frame, true),
  });
}
