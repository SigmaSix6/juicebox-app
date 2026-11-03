"use client";

import { useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Screen } from "@/components/layout/Screen";
import { OrbSlot } from "@/components/orb/OrbSlot";
import { Button } from "@/components/ui/Button";
import { gsap, intro, motion, REDUCED_MOTION, useGSAP } from "@/lib/motion";

/**
 * Opinions floating over the orb. Positions are the Figma coordinates,
 * relative to the hero (frame y − 132px).
 */
const OPINIONS = [
  {
    text: "WA businesses feel confident about future growth",
    className: "top-[45px] left-[20px] w-[292px]",
  },
  {
    text: "AI can't replace creativity",
    className: "top-[86px] left-[292px] -translate-x-1/2 whitespace-nowrap",
  },
  {
    text: "Sales measure true success",
    className: "top-[147px] left-[20px] whitespace-nowrap",
  },
  {
    text: "Human connection drives WA business",
    className: "top-[211px] left-[250.5px] -translate-x-1/2 whitespace-nowrap",
  },
  {
    text: "The primary barrier to digital transformation is financial investment",
    className: "top-[274px] left-[21px] w-[236px]",
  },
];

export function HomeScreen() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`not ${REDUCED_MOTION}`, () => {
        // Wait for the orb to bloom on first load; be quick on return visits.
        const delay = intro.pending ? intro.duration - 0.6 : 0.15;
        const opinions = gsap.utils.toArray<HTMLElement>("[data-opinion]");

        gsap
          .timeline({
            delay,
            defaults: { ease: motion.ease, duration: motion.enter },
          })
          .fromTo(
            opinions,
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, stagger: 0.12 },
          )
          .fromTo(
            "[data-headline]",
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0 },
            0.2,
          )
          .fromTo(
            "[data-cta]",
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0 },
            0.35,
          );

        // Each opinion then drifts on its own, so the cluster feels alive.
        opinions.forEach((el, i) => {
          gsap.to(el, {
            x: gsap.utils.random(-6, 6),
            y: gsap.utils.random(-5, 5),
            duration: gsap.utils.random(3, 4.5),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: delay + 1 + i * 0.2,
          });
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope}>
      <Screen
        header={<Header />}
        footer={
          <Button href="/walkthrough" variant="primary" data-cta data-animate>
            Get a reality check
          </Button>
        }
      >
        {/* Orb + opinions: 86px → 411px of the 390×665 design viewport */}
        <section
          className="relative h-81.25 pt-7"
          aria-label="What professionals are saying"
        >
          <OrbSlot variant="lg" />
          <ul className="list-none">
            {OPINIONS.map(({ text, className }) => (
              <li
                key={text}
                className={`absolute font-body text-caption text-text-light ${className}`}
                data-opinion
                data-animate
              >
                {text}
              </li>
            ))}
          </ul>
        </section>

        {/* Headline block: 411px → 557px */}
        <div className="px-5.5 pt-module-y-sm pb-[20px]">
          <h1
            className="mx-auto max-w-86.5 text-center font-heading text-h2 font-normal text-text-light"
            data-headline
            data-animate
          >
            Compare your thoughts on{" "}
            <span className="bg-linear-90/srgb from-[#edb0ff] via-[#b179ff] via-70% to-[#a092ff] bg-clip-text text-transparent">
              technology
            </span>{" "}
            with current industry opinions.
          </h1>
        </div>
      </Screen>
    </div>
  );
}
