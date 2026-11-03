"use client";

import { useRef, type ReactNode } from "react";
import { FlowProvider } from "@/lib/flow-context";
import { OrbProvider } from "@/components/orb/OrbContext";
import { OrbStage } from "@/components/orb/OrbStage";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

/**
 * Client-side app frame: smooth scrolling, the persisted form state and the
 * shared orb layer that sits behind every page.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const shellRef = useRef<HTMLDivElement>(null);

  return (
    <FlowProvider>
      <SmoothScroll>
        <OrbProvider>
          <div ref={shellRef} className="relative mx-auto min-h-dvh w-full max-w-page">
            <OrbStage shellRef={shellRef} />
            <div className="relative z-1">{children}</div>
          </div>
        </OrbProvider>
      </SmoothScroll>
    </FlowProvider>
  );
}
