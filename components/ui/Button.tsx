import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "@/lib/clsx";

export type ButtonVariant = "primary" | "outline" | "light";

type BaseProps = {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
};

type AsButton = BaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof BaseProps> & { href?: undefined };

type AsLink = BaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof BaseProps> & { href: string };

export type ButtonProps = AsButton | AsLink;

const BASE = clsx(
  "flex h-control w-full cursor-pointer items-center justify-center gap-2xs rounded-button border px-md",
  "text-center font-body text-body [-webkit-tap-highlight-color:transparent]",
  "transition-[background-color,border-color,box-shadow,scale] duration-[250ms,250ms,250ms,150ms] ease-out",
  "active:scale-98 disabled:cursor-not-allowed disabled:opacity-50",
);

const VARIANTS: Record<ButtonVariant, string> = {
  // Lavender — homepage CTA
  primary:
    "border-transparent bg-brand-primary text-text-dark hover:bg-[color-mix(in_srgb,var(--color-brand-primary),white_15%)]",
  // Hairline — walkthrough "Continue"
  outline:
    "border-line-medium text-text-light hover:border-text-light hover:bg-bg-surface",
  // White with outer ring — "Get started" / result "Continue".
  // The focus outline clears the 8px ring.
  light:
    "border-transparent bg-brand-action text-text-dark shadow-ring-light hover:shadow-ring-light-hover focus-visible:outline-offset-11",
};

/**
 * Full-width 60px call-to-action, in the three styles used by the design:
 * - `primary`  lavender fill (homepage)
 * - `outline`  hairline border (walkthrough "Continue")
 * - `light`    white fill with a soft outer ring ("Get started", result)
 *
 * Renders a Next.js <Link> when given an `href`, otherwise a <button>.
 */
export function Button({ variant = "primary", className, children, ...rest }: ButtonProps) {
  const classes = clsx(BASE, VARIANTS[variant], className);
  const label = <span className="whitespace-nowrap">{children}</span>;

  if (rest.href !== undefined) {
    return (
      <Link className={classes} {...(rest as AsLink)}>
        {label}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = rest as AsButton;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {label}
    </button>
  );
}
