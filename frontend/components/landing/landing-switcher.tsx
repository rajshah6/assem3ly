"use client";

import { useHeaderTabs } from "@components/navigation/tabs-context";
import { TiltCard } from "@components/ui/tilt-card";
import { WireframePreview } from "@components/landing/wireframe-preview";
import { SearchSection } from "@components/search/search-section";
import { LibrarySection } from "@components/library/library-section";
import { LinkPreview } from "@components/ui/link-preview";

export function LandingSwitcher() {
  const { active } = useHeaderTabs();
  if (active === "home") {
    return (
      <div className="flex flex-col items-center text-center">
        <h1 className="text-6xl font-extrabold tracking-tight text-black md:text-7xl">assem3ly</h1>
        <p className="mt-3 text-sm uppercase tracking-[0.18em] text-black/50">interactive assembly manuals</p>
        <div className="mt-12 w-full">
          <TiltCard>
            <WireframePreview className="mx-auto w-full max-w-5xl" />
          </TiltCard>
        </div>

        {/* Minimalist hype with link previews */}
        <div className="mx-auto mt-12 max-w-3xl px-4 text-left">
          <p className="text-base leading-relaxed text-black/70">
            Reinventing how we build. Use us to view your hardest manuals like
            {" "}
            <LinkPreview url="https://www.ikea.com/us/en/assembly_instructions/billy-bookcase-white__AA-2289108-3-100.pdf" className="font-semibold text-black">
              BILLY Bookcase
            </LinkPreview>
            {" "}or{ " "}
            <LinkPreview url="https://www.ikea.com/us/en/assembly_instructions/kallax-shelf-unit-white__AA-1055145-11-100.pdf" className="font-semibold text-black">
              KALLAX shelves 
            </LinkPreview>
            { " "} and get clean, step by step, interactive guidance.
          </p>
        </div>
      </div>
    );
  }

  if (active === "search") {
    return (
      <div className="mx-auto w-full max-w-6xl rounded-xl border border-black/10 bg-white p-4">
        <SearchSection />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl rounded-xl border border-black/10 bg-white p-4">
      <LibrarySection />
    </div>
  );
}


