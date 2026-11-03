"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Screen } from "@/components/layout/Screen";
import { OrbSlot } from "@/components/orb/OrbSlot";
import { useFlow, type FlowData } from "@/lib/flow-context";
import { gsap, motion, REDUCED_MOTION, useGSAP } from "@/lib/motion";
import { TextInput } from "./TextInput";
import type { FormStepConfig } from "./steps";

type MultiStepFormProps = {
  steps: FormStepConfig[];
  /** Where to go once the last step is valid. */
  completeHref: string;
  /** Where the back button goes from the first step. */
  exitHref: string;
};

/**
 * Asks one question per step, chat style. Each answer is validated before the
 * next step; answers are saved to the shared flow state as they're given, so
 * going back keeps what the user typed.
 */
export function MultiStepForm({ steps, completeHref, exitHref }: MultiStepFormProps) {
  const router = useRouter();
  const { data, hydrated, setField } = useFlow();
  const scope = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const promptId = useId();

  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<FlowData>(data);
  const [error, setError] = useState<string | null>(null);

  const step = steps[stepIndex];
  const value = values[step.name];

  // Prefill with saved answers once sessionStorage has been read.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (hydrated) setValues(data);
    // Only on hydration — later edits live in local state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // Every new question takes focus, like a chat waiting for a reply.
  // Deferred a tick so it lands after the router's own post-navigation focus.
  useEffect(() => {
    const id = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50);
    return () => window.clearTimeout(id);
  }, [stepIndex]);

  // Animate each new prompt in.
  useGSAP(
    () => {
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
            stagger: motion.stagger,
            delay: stepIndex === 0 ? 0.45 : 0.1,
          },
        );
      });
      return () => mm.revert();
    },
    { scope, dependencies: [stepIndex], revertOnUpdate: true },
  );

  const goTo = (index: number) => {
    setError(null);
    setStepIndex(index);
  };

  const back = () => {
    if (stepIndex > 0) goTo(stepIndex - 1);
    else router.push(exitHref);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = step.validate(value);
    if (message) {
      setError(message);
      inputRef.current?.focus();
      return;
    }
    setField(step.name, value.trim());
    if (stepIndex < steps.length - 1) goTo(stepIndex + 1);
    else router.push(completeHref);
  };

  return (
    <div ref={scope}>
      <form onSubmit={submit} noValidate aria-labelledby={promptId}>
        <Screen
          header={
            <Header
              onBack={back}
              backLabel={stepIndex > 0 ? "Previous question" : "Back to walkthrough"}
            />
          }
          footer={
            // Not animated: the field must be visible to take focus.
            <div>
              <TextInput
                key={step.name}
                ref={inputRef}
                name={step.name}
                type={step.type}
                label={step.label}
                placeholder={step.placeholder}
                autoComplete={step.autoComplete}
                inputMode={step.inputMode}
                autoCapitalize={step.type === "email" ? "none" : "words"}
                spellCheck={false}
                enterKeyHint={stepIndex < steps.length - 1 ? "next" : "send"}
                submitLabel={step.submitLabel}
                describedBy={promptId}
                value={value}
                error={error}
                onChange={(e) => {
                  setValues((prev) => ({ ...prev, [step.name]: e.target.value }));
                  if (error) setError(null);
                }}
              />
            </div>
          }
        >
          {/* Hexagon + prompt: 86px → ~245px of the design viewport */}
          <section className="flex flex-col items-center gap-lg px-module-x py-module-y-sm">
            <OrbSlot variant="sm" playKey={stepIndex} />
            <h1
              id={promptId}
              key={step.name}
              className="w-full text-center font-heading text-xsmall font-normal text-text-light"
              data-animate
            >
              {step.prompt}
            </h1>
            <p className="sr-only" aria-live="polite">
              Question {stepIndex + 1} of {steps.length}
            </p>
          </section>
        </Screen>
      </form>
    </div>
  );
}
