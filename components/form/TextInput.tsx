"use client";

import { forwardRef, useId, type ComponentPropsWithoutRef } from "react";
import clsx from "@/lib/clsx";

type TextInputProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "id" | "children"
> & {
  /** Accessible label (visually hidden — the chat prompt is the visible cue). */
  label: string;
  /** Validation message; marks the field invalid and is announced. */
  error?: string | null;
  /** Ids of extra elements that describe the field (e.g. the chat prompt). */
  describedBy?: string;
  /** Accessible name of the round submit button. */
  submitLabel?: string;
};

/**
 * Chat-style text field with an inline round "send" button — the input used on
 * every form step. Works for any `type` (text, email, …) and must be placed
 * inside a <form>; the button submits it.
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    {
      label,
      error,
      describedBy,
      submitLabel = "Submit",
      className,
      value,
      ...inputProps
    },
    ref,
  ) {
    const id = useId();
    const errorId = `${id}-error`;
    const hasValue =
      typeof value === "string" ? value.trim().length > 0 : Boolean(value);
    const describedByIds = [describedBy, error ? errorId : null]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={clsx("relative w-full", className)}>
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <div
          className={clsx(
            "flex h-control items-center gap-3xs rounded-input border px-2xs transition-colors duration-250 ease-out",
            error
              ? "border-text-error"
              : "border-line-medium focus-within:border-text-light",
          )}
        >
          <input
            ref={ref}
            id={id}
            value={value}
            className={clsx(
              "h-full min-w-0 flex-1 border-0 bg-transparent font-body text-body text-text-light caret-caret",
              // Focus is shown on the whole control (white border), not the bare input.
              "outline-none placeholder:text-text-caption",
              // Keep autofill from painting a light box on the dark field
              "autofill:[-webkit-text-fill-color:var(--color-text-light)] autofill:[transition:background-color_9999s]",
            )}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedByIds || undefined}
            {...inputProps}
          />
          <button
            type="submit"
            className={clsx(
              "grid size-7.75 flex-none place-items-center rounded-[27px] transition-[opacity,background-color,scale] duration-[250ms,250ms,150ms] ease-out active:scale-92 focus-visible:outline-offset-2",
              hasValue
                ? "bg-brand-primary opacity-100"
                : "bg-bg-medium opacity-50",
            )}
            aria-label={submitLabel}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/icon-arrow-up.svg"
              alt=""
              width={18}
              height={18}
              // Dark arrow on the lavender fill
              className={clsx("size-4.5", hasValue && "brightness-0")}
            />
          </button>
        </div>
        {/* Sits under the field without pushing the layout around */}
        <p
          id={errorId}
          className="absolute top-[calc(100%+6px)] right-2xs left-2xs text-caption text-text-error empty:hidden"
          role="alert"
        >
          {error ?? ""}
        </p>
      </div>
    );
  },
);
