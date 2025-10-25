"use client";

import { Spinner, Card } from "@components/ui/primitives";

export function SearchProgress({ stage = "Finding manuals" }: { stage?: string }) {
  return (
    <Card className="flex items-center gap-3 p-4 text-sm text-black/70 dark:text-white/70">
      <Spinner />
      <div>
        <div className="font-medium">Searching</div>
        <div className="text-xs opacity-70">{stage}…</div>
      </div>
    </Card>
  );
}


