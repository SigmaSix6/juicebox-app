"use client";

import { useRef } from "react";
import clsx from "@/lib/clsx";
import { gsap, REDUCED_MOTION, useGSAP } from "@/lib/motion";

type RevealTextProps = {
  text: string;
  /** Plays the word-by-word reveal when true; resets to dimmed when false. */
  active: boolean;
  className?: string;
};

/**
 * Text that brightens word by word, from 50% to full white — the
 * half-revealed paragraphs in the walkthrough design. The words stay real
 * text, so screen readers read the sentence normally.
 */
export function RevealText({ text, active, className }: RevealTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`not ${REDUCED_MOTION}`, () => {
        const els = gsap.utils.toArray<HTMLElement>("[data-word]");
        if (active) {
          gsap.fromTo(
            els,
            { opacity: 0.5 },
            { opacity: 1, duration: 0.4, ease: "power1.out", stagger: 0.06, delay: 0.25 },
          );
        } else {
          gsap.set(els, { opacity: 0.5 });
        }
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [active], revertOnUpdate: true },
  );

  return (
    <p
      ref={ref}
      className={clsx("text-center font-heading text-h4 text-text-light", className)}
    >
      {/* Without JS or with reduced motion the copy is simply fully visible. */}
      {words.map((word, i) => (
        <span key={i} data-word className="whitespace-pre-wrap">
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
