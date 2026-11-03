import type { ComponentPropsWithoutRef } from "react";
import clsx from "@/lib/clsx";

const ICONS = {
  back: "/figma/icon-arrow-left.svg",
  refresh: "/figma/icon-refresh.svg",
} as const;

export type IconName = keyof typeof ICONS;

type IconButtonProps = Omit<ComponentPropsWithoutRef<"button">, "children"> & {
  icon: IconName;
  /** Required: the button has no visible text. */
  label: string;
};

/** 46px frosted circular button used in the header. */
export function IconButton({ icon, label, className, type = "button", ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={clsx(
        "grid size-icon-button flex-none place-items-center rounded-pill bg-bg-surface shadow-icon-button backdrop-blur-icon-button",
        "transition-[background-color,scale] duration-[250ms,150ms] ease-out [-webkit-tap-highlight-color:transparent]",
        "hover:bg-white/10 active:scale-94",
        className,
      )}
      {...rest}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ICONS[icon]} alt="" width={20} height={20} className="size-icon" />
    </button>
  );
}
