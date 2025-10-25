"use client";

import { createContext, useContext, useState } from "react";

type TabValue = "home" | "search" | "library";

const TabsCtx = createContext<{
  active: TabValue;
  setActive: (v: TabValue) => void;
} | null>(null);

export function HeaderTabsProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<TabValue>("home");
  return <TabsCtx.Provider value={{ active, setActive }}>{children}</TabsCtx.Provider>;
}

export function useHeaderTabs() {
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error("useHeaderTabs must be used within HeaderTabsProvider");
  return ctx;
}


