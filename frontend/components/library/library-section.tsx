"use client";

import { useEffect, useState } from "react";
import { fetchTopManuals, Manual } from "@lib/api-client";
import { Card, Spinner } from "@components/ui/primitives";
import { LibraryCard } from "./library-card";

export function LibrarySection() {
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchTopManuals();
        setManuals(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Top 50 manuals</h2>
          <p className="text-sm text-black/60 dark:text-white/60">Most commonly searched IKEA manuals</p>
        </div>
      </div>
      {loading ? (
        <Card className="flex items-center gap-2 p-4 text-sm"><Spinner /> Loading…</Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {manuals.map((m) => (
            <LibraryCard key={m.id} manual={m} />
          ))}
        </div>
      )}
    </div>
  );
}


