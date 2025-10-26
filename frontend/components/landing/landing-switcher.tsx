"use client";

import { useHeaderTabs } from "@components/navigation/tabs-context";
import { TiltCard } from "@components/ui/tilt-card";
import { WireframePreview } from "@components/landing/wireframe-preview";
import { SearchSection } from "@components/search/search-section";
import { PlaceholdersAndVanishInput } from "@components/ui/placeholders-and-vanish-input";
import { useState } from "react";
import { LibrarySection } from "@components/library/library-section";
import { LinkPreview } from "@components/ui/link-preview";
import { HoverBorderGradient } from "@components/ui/hover-border-gradient";

export function LandingSwitcher() {
  const { active, setActive } = useHeaderTabs();
  const [searchQ, setSearchQ] = useState("");
  if (active === "home") {
    return (
      <div className="flex flex-col items-center text-center">
        <h1 className="text-6xl font-extrabold tracking-tight text-black md:text-7xl">assembl3D</h1>
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

        {/* Action Buttons */}
        <div className="mt-10 flex justify-center gap-6">
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
            onClick={() => setActive("search")}
          >
            <SearchIcon />
            <span>Search</span>
          </HoverBorderGradient>
          
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
            onClick={() => setActive("library")}
          >
            <BrowseIcon />
            <span>Browse</span>
          </HoverBorderGradient>
        </div>
      </div>
    );
  }

  if (active === "search") {
    return (
      <div className="flex flex-col items-center">
        {/* Header - only show when search is empty */}
        {!searchQ.trim() && (
          <div className="mb-8 text-center">
            <h1 className="text-6xl font-extrabold tracking-tight text-black md:text-7xl">assembl3D</h1>
            <p className="mt-3 text-sm uppercase tracking-[0.18em] text-black/50">interactive assembly manuals</p>
          </div>
        )}
        
        <div className="mx-auto w-full max-w-6xl rounded-xl border border-black/10 bg-white p-4">
          <div className="mb-6">
            <PlaceholdersAndVanishInput
              placeholders={[
                "Search BILLY Bookcase",
                "MALM dresser manual",
                "KALLAX shelf instructions",
                "POÄNG chair",
                "LACK table assembly",
              ]}
              onChange={(e: any) => setSearchQ(e.target.value)}
              onSubmit={(e: any) => e.preventDefault()}
            />
          </div>
          <SearchSection externalQuery={searchQ} hideInput />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl rounded-xl border border-black/10 bg-white p-4">
      <LibrarySection />
    </div>
  );
}

const SearchIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-black dark:text-white"
    >
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

const BrowseIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-black dark:text-white"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};

