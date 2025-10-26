"use client";

import { Tabs } from "@components/ui/tabs";
import { SearchSection } from "@components/search/search-section";
import { LibrarySection } from "@components/library/library-section";
import { TiltCard } from "@components/ui/tilt-card";
import { WireframePreview } from "@components/landing/wireframe-preview";

export function MainTabs() {
  const tabs = [
    {
      title: "Landing",
      value: "landing",
      content: (
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-black p-6 text-white">
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="text-2xl font-semibold tracking-tight">assembl3D</h2>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/70">interactive assembly manuals</p>
            <div className="mt-6">
              <TiltCard>
                <WireframePreview />
              </TiltCard>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Search",
      value: "search",
      content: (
        <div className="relative h-full w-full overflow-auto rounded-2xl bg-black p-6 text-white no-visible-scrollbar">
          <div className="mx-auto w-full max-w-6xl rounded-xl border border-white/10 bg-white p-4 text-black">
            <SearchSection />
          </div>
        </div>
      ),
    },
    {
      title: "Library",
      value: "library",
      content: (
        <div className="relative h-full w-full overflow-auto rounded-2xl bg-black p-6 text-white no-visible-scrollbar">
          <div className="mx-auto w-full max-w-6xl rounded-xl border border-white/10 bg-white p-4 text-black">
            <LibrarySection />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative mx-auto my-12 flex w-full max-w-6xl flex-col items-start justify-start perspective-[1000px]">
      <Tabs tabs={tabs as any} />
    </div>
  );
}


