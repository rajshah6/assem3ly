"use client";

import { Manual } from "@lib/api-client";
import { LibraryCard } from "@components/library/library-card";

export function SearchResults({ results }: { results: Manual[] }) {
  if (!results.length) return null;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {results.map((manual) => (
        <LibraryCard key={manual.id} manual={manual} />
      ))}
    </div>
  );
}


