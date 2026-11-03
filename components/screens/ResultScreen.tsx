"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Screen } from "@/components/layout/Screen";
import { OrbSlot } from "@/components/orb/OrbSlot";
import { Button } from "@/components/ui/Button";
import { useFlow } from "@/lib/flow-context";
import { gsap, motion, REDUCED_MOTION, useGSAP } from "@/lib/motion";

const message = "font-heading text-xsmall font-normal text-text-light wrap-anywhere";

/**
 * Submission confirmation: greets the user by name, summarises what they
 * entered and plays the hexagon Lottie on a loop.
 */
export function ResultScreen() {
  const router = useRouter();
  const scope = useRef<HTMLDivElement>(null);
  const { data, hydrated, reset } = useFlow();
  const complete = Boolean(data.firstName && data.email);
  const leaving = useRef(false);

  // Nothing to show without answers (e.g. a direct visit) — back to the form.
  useEffect(() => {
    if (hydrated && !complete && !leaving.current) router.replace("/form");
  }, [hydrated, complete, router]);

  useGSAP(
    () => {
      if (!complete) return;
      const mm = gsap.matchMedia();
      mm.add(`not ${REDUCED_MOTION}`, () => {
        gsap.fromTo(
          "[data-animate]",
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: motion.enter,
            ease: motion.ease,
            stagger: 0.15,
            delay: 0.45,
          },
        );
      });
      return () => mm.revert();
    },
    { scope, dependencies: [complete] },
  );

  const startOver = () => {
    leaving.current = true;
    reset();
    router.push("/");
  };

  return (
    <div ref={scope}>
      <Screen
        header={
          <Header
            onBack={() => router.push("/form")}
            backLabel="Edit your answers"
          />
        }
        footer={
          complete && (
            <div data-animate>
              <Button variant="light" onClick={startOver}>
                Continue
              </Button>
            </div>
          )
        }
      >
        <section
          className="flex flex-col items-center gap-lg px-module-x py-module-y-sm"
          aria-live="polite"
        >
          <OrbSlot variant="sm" loop />
          {complete && (
            <div className="flex w-full flex-col gap-md text-center">
              <h1 className={message} data-animate>
                Thanks, {data.firstName}! Now, it’s time to get a reality check.
              </h1>
              <p className={message} data-animate>
                This will take 2-3 minutes.
              </p>
              {/* <p className="text-caption text-text-caption" data-animate>
                We’ll be in touch at{" "}
                <span className="text-text-light wrap-anywhere">{data.email}</span>.
              </p> */}
            </div>
          )}
        </section>
      </Screen>
    </div>
  );
}
