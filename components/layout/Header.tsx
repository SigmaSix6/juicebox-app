"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconButton } from "@/components/ui/IconButton";
import { Logo } from "@/components/ui/Logo";
import { useFlow } from "@/lib/flow-context";

const side = "flex size-icon-button";

type HeaderProps = {
  /** Shows the back button and runs this when pressed. */
  onBack?: () => void;
  backLabel?: string;
};

/**
 * Top bar: optional back button, centred wordmark, and a "start over" button
 * that clears any answers and returns to the homepage.
 */
export function Header({ onBack, backLabel = "Go back" }: HeaderProps) {
  const router = useRouter();
  const { reset } = useFlow();

  const startOver = () => {
    reset();
    router.push("/");
  };

  return (
    <header className="flex h-header items-center justify-between p-module-x">
      <div className={side}>
        {onBack && <IconButton icon="back" label={backLabel} onClick={onBack} />}
      </div>
      <Link href="/" className="rounded-[6px]" aria-label="Juicebox home">
        <Logo />
      </Link>
      <div className={side}>
        <IconButton icon="refresh" label="Start over" onClick={startOver} />
      </div>
    </header>
  );
}
