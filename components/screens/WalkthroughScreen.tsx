"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { Header } from "@/components/layout/Header";
import { Screen } from "@/components/layout/Screen";
import { RevealText } from "@/components/motion/RevealText";
import { OrbSlot } from "@/components/orb/OrbSlot";
import { Button } from "@/components/ui/Button";
import { PaginationDots } from "@/components/ui/PaginationDots";
import { gsap, motion, REDUCED_MOTION, useGSAP } from "@/lib/motion";

// Fixed height so the dots don't jump between slides.
const slide = "h-[150px] px-module-x";

const SLIDES = [
  "Professionals around the world shared how they feel about technology and I’ve listened. Now it’s your turn.",
  "I’ll ask you a handful of meaningful questions and compare your responses with people in your industry.",
  "You’ll get insights into current industry sentiments and a reality check about technology in a few minutes. Deal? Great!",
];

export function WalkthroughScreen() {
  const router = useRouter();
  const scope = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [index, setIndex] = useState(0);
  // Swiper reads the clock while rendering, which can't be prerendered, so it
  // mounts after hydration. Until then the first slide is rendered statically
  // with an identical layout.
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  const isLast = index === SLIDES.length - 1;

  const back = () => {
    if (index > 0) swiperRef.current?.slidePrev();
    else router.push("/");
  };

  const next = () => {
    if (isLast) router.push("/form");
    else swiperRef.current?.slideNext();
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`not ${REDUCED_MOTION}`, () => {
        gsap.fromTo(
          "[data-animate]",
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: motion.enter,
            ease: motion.ease,
            stagger: motion.stagger,
            delay: 0.35,
          },
        );
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope}>
      <Screen
        header={<Header onBack={back} backLabel={index > 0 ? "Previous slide" : "Back to home"} />}
        footer={
          <div data-animate>
            <Button variant={isLast ? "light" : "outline"} onClick={next}>
              {isLast ? "Get started" : "Continue"}
            </Button>
          </div>
        }
      >
        <h1 className="sr-only">How Juicebox works</h1>
        {/* Orb + copy: 86px → 535px of the design viewport */}
        <section className="flex flex-col items-center gap-2xl py-module-y">
          <OrbSlot variant="md" />
          <div className="w-full" data-animate>
            {mounted ? (
              <Swiper
                modules={[A11y, Keyboard]}
                onSwiper={(s) => (swiperRef.current = s)}
                onSlideChange={(s) => setIndex(s.activeIndex)}
                slidesPerView={1}
                speed={600}
                keyboard={{ enabled: true }}
                a11y={{
                  enabled: true,
                  containerMessage: "How Juicebox works",
                  containerRoleDescriptionMessage: "carousel",
                  itemRoleDescriptionMessage: "slide",
                  slideLabelMessage: "{{index}} of {{slidesLength}}",
                }}
              >
                {SLIDES.map((text, i) => (
                  <SwiperSlide key={i} className={slide}>
                    <RevealText text={text} active={i === index} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className={slide}>
                <RevealText text={SLIDES[0]} active={false} />
              </div>
            )}
          </div>
        </section>
        <PaginationDots count={SLIDES.length} active={index} className="h-2" />
      </Screen>
    </div>
  );
}
