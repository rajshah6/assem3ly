"use client";

import { Tabs } from "@components/ui/tabs";
import { useHeaderTabs } from "@components/navigation/tabs-context";

export function HeaderTabs() {
  const { setActive, active } = useHeaderTabs();
  const tabs = [
    { title: "Home", value: "home", content: <div /> },
    { title: "Search", value: "search", content: <div /> },
    { title: "Library", value: "library", content: <div /> },
  ];

  return (
    <Tabs
      tabs={tabs as any}
      containerClassName="flex items-center gap-1"
      tabClassName="text-sm"
      activeTabClassName="bg-white border border-black/15"
      contentClassName="hidden"
      onTabChange={(v) => setActive(v as any)}
    />
  );
}


