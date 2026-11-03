import type { FlowData } from "@/lib/flow-context";
import { validateEmail, validateFirstName, type Validator } from "@/lib/validation";
import type { HTMLInputTypeAttribute } from "react";

export type FormStepConfig = {
  name: keyof FlowData;
  prompt: string;
  label: string;
  placeholder: string;
  type: HTMLInputTypeAttribute;
  autoComplete: string;
  inputMode?: "text" | "email";
  submitLabel: string;
  validate: Validator;
};

/** The questions asked by the multistep form, in order. */
export const FORM_STEPS: FormStepConfig[] = [
  {
    name: "firstName",
    prompt: "Let’s start with the basics. Type in your first name.",
    label: "First name",
    placeholder: "First name",
    type: "text",
    autoComplete: "given-name",
    inputMode: "text",
    submitLabel: "Submit first name",
    validate: validateFirstName,
  },
  {
    name: "email",
    prompt: "How should we contact you? Type in your email address.",
    label: "Email address",
    placeholder: "Email address",
    type: "email",
    autoComplete: "email",
    inputMode: "email",
    submitLabel: "Submit email address",
    validate: validateEmail,
  },
];
