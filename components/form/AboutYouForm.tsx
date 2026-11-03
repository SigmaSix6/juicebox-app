"use client";

import { MultiStepForm } from "./MultiStepForm";
import { FORM_STEPS } from "./steps";

/** The "about you" questionnaire: first name, then email. */
export function AboutYouForm() {
  return <MultiStepForm steps={FORM_STEPS} completeHref="/result" exitHref="/walkthrough" />;
}
