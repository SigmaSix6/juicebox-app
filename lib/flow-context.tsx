"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type FlowData = {
  firstName: string;
  email: string;
};

type FlowContextValue = {
  data: FlowData;
  /** False until sessionStorage has been read on the client. */
  hydrated: boolean;
  setField: <K extends keyof FlowData>(key: K, value: FlowData[K]) => void;
  reset: () => void;
};

const STORAGE_KEY = "juicebox:flow";
const EMPTY: FlowData = { firstName: "", email: "" };

const FlowContext = createContext<FlowContextValue | null>(null);

function readStorage(): FlowData {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<FlowData>;
    return {
      firstName: typeof parsed.firstName === "string" ? parsed.firstName : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
    };
  } catch {
    return EMPTY;
  }
}

function writeStorage(data: FlowData) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage can be unavailable (private mode, blocked cookies) — the flow
    // still works in memory, it just won't survive a reload.
  }
}

/**
 * Holds the answers collected by the multistep form so they survive route
 * changes (form → result) and page reloads within the same tab.
 */
export function FlowProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FlowData>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Reading sessionStorage must wait until after hydration so the server
    // and first client render agree.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(readStorage());
    setHydrated(true);
  }, []);

  const setField = useCallback<FlowContextValue["setField"]>((key, value) => {
    setData((prev) => {
      const next = { ...prev, [key]: value };
      writeStorage(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setData(EMPTY);
    writeStorage(EMPTY);
  }, []);

  const value = useMemo(
    () => ({ data, hydrated, setField, reset }),
    [data, hydrated, setField, reset],
  );

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}

export function useFlow() {
  const ctx = useContext(FlowContext);
  if (!ctx) throw new Error("useFlow must be used inside <FlowProvider>");
  return ctx;
}
