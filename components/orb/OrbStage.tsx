"use client";

import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { usePathname } from "next/navigation";
import { gsap, intro, prefersReducedMotion } from "@/lib/motion";
import { useLottie } from "@/components/motion/useLottie";
import { tweenLottie } from "@/components/motion/tweenLottie";
import { useOrb } from "./OrbContext";

const LOTTIE_PATH = "/lottie/hexagon.json";

type Props = {
  /** The positioned ancestor the orb is laid out against. */
  shellRef: RefObject<HTMLElement | null>;
};

/**
 * One orb for the whole app. It follows whichever <OrbSlot> the current page
 * renders — gliding from the large homepage orb, to the walkthrough orb, down
 * to the small hexagon on the form and result screens, where it hands over to
 * the brand's hexagon Lottie.
 */
export function OrbStage({ shellRef }: Props) {
  const { target } = useOrb();
  const pathname = usePathname();
  const boxRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const lottieRef = useRef<HTMLDivElement>(null);
  const placed = useRef(false);
  const lottieTween = useRef<gsap.core.Tween | null>(null);
  const { animRef, ready } = useLottie(lottieRef, LOTTIE_PATH);

  // ── Measure the slot and move the orb there ───────────────────────────
  useLayoutEffect(() => {
    const box = boxRef.current;
    const shell = shellRef.current;
    if (!box || !shell) return;

    if (!target) return; // keep the orb where it is between pages

    const reduce = prefersReducedMotion();
    const measure = () => {
      const s = shell.getBoundingClientRect();
      const r = target.el.getBoundingClientRect();
      return {
        x: r.left - s.left,
        y: r.top - s.top,
        width: r.width,
        height: r.height,
      };
    };

    const small = target.variant === "sm";
    const firstPlacement = !placed.current;
    placed.current = true;

    const ctx = gsap.context(() => {
      if (firstPlacement || reduce) {
        gsap.set(box, { ...measure(), autoAlpha: 1 });
        gsap.set(imageRef.current, { autoAlpha: small ? 0 : 1 });
        gsap.set(lottieRef.current, { autoAlpha: small ? 1 : 0 });
      } else {
        gsap.to(box, {
          ...measure(),
          duration: 0.9,
          ease: "expo.inOut",
          overwrite: true,
        });
        gsap.to(imageRef.current, {
          autoAlpha: small ? 0 : 1,
          duration: 0.5,
          delay: small ? 0.2 : 0,
          ease: "power2.out",
        });
        gsap.to(lottieRef.current, {
          autoAlpha: small ? 1 : 0,
          duration: 0.5,
          delay: small ? 0.4 : 0,
          ease: "power2.out",
        });
      }
    });

    // Keep the orb glued to its slot when the layout changes size.
    const ro = new ResizeObserver(() => gsap.set(box, measure()));
    ro.observe(target.el);
    ro.observe(shell);
    return () => {
      ro.disconnect();
      ctx.kill();
    };
  }, [target, shellRef, pathname]);

  // ── Homepage intro: the hexagon Lottie morphs, then blooms into the orb ─
  useEffect(() => {
    if (!ready || !animRef.current || !target) return;
    if (!intro.pending || target.variant !== "lg") {
      intro.pending = false;
      return;
    }
    intro.pending = false;
    if (prefersReducedMotion()) return;

    const anim = animRef.current;
    const image = imageRef.current;
    const lottie = lottieRef.current;
    const tl = gsap.timeline();
    tl.set(lottie, { autoAlpha: 1, scale: 0.55 })
      .set(image, { autoAlpha: 0, scale: 0.6, rotate: 120 })
      .add(tweenLottie(anim, { duration: 1.1, ease: "power1.inOut" }), 0)
      .to(lottie, { scale: 0.9, duration: 1.1, ease: "power2.inOut" }, 0)
      .to(
        image,
        {
          autoAlpha: 1,
          scale: 1,
          rotate: 180,
          duration: 0.9,
          ease: "power3.out",
        },
        0.75,
      )
      .to(
        lottie,
        { autoAlpha: 0, scale: 1.05, duration: 0.5, ease: "power2.in" },
        0.8,
      );
    return () => {
      tl.kill();
      gsap.set(image, { autoAlpha: 1, scale: 1, rotate: 180 });
      gsap.set(lottie, { autoAlpha: 0, scale: 1 });
    };
    // Only ever runs for the first slot the app sees.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // ── Small hexagon: replay (or loop) the Lottie on each step ──────────────
  useEffect(() => {
    const anim = animRef.current;
    if (!ready || !anim || target?.variant !== "sm") return;
    lottieTween.current?.kill();
    if (prefersReducedMotion()) {
      anim.goToAndStop(0, true);
      return;
    }
    lottieTween.current = tweenLottie(anim, {
      duration: 1.6,
      ease: "power1.inOut",
      repeat: target.loop ? -1 : 0,
      repeatDelay: 1.4,
    });
    return () => {
      lottieTween.current?.kill();
    };
  }, [ready, animRef, target?.variant, target?.playKey, target?.loop]);

  // ── Idle float for the large/medium orb (the small hexagon stays put) ────
  const floats = target ? target.variant !== "sm" : true;
  useEffect(() => {
    const el = floatRef.current;
    if (!el) return;
    if (!floats || prefersReducedMotion()) {
      gsap.to(el, { y: 0, duration: 0.4, ease: "power2.out", overwrite: true });
      return;
    }
    const tween = gsap.to(el, {
      y: -6,
      duration: 2.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      overwrite: true,
    });
    return () => {
      tween.kill();
    };
  }, [floats]);

  return (
    // Revealed by GSAP once measured.
    <div
      ref={boxRef}
      className="pointer-events-none invisible absolute top-0 left-0 z-0"
      aria-hidden="true"
    >
      <div ref={floatRef} className="relative size-full">
        {/* The Figma orb is exported upside-down and rotated 180° in the design.
            A plain transform (not Tailwind's `rotate`) so GSAP picks it up. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imageRef}
          className="absolute inset-0 size-full object-contain transform-[rotate(180deg)]"
          src="/figma/orb.png"
          alt=""
          width={274}
          height={290}
          decoding="async"
          fetchPriority="high"
        />
        {/* The hexagon Lottie (650×650 canvas) — sized so its hexagon matches the
            29×31 design hexagon when the orb sits in a small slot. The negative
            margin is half its own height (percent margins use the width). */}
        <div
          ref={lottieRef}
          className="invisible absolute top-1/2 left-[-4%] mt-[-54%] aspect-square w-[108%] [&_svg]:block"
        />
      </div>
    </div>
  );
}
