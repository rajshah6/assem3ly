"use client";

import { useEffect, useMemo, useState } from "react";
import { Input, Button, Card, Badge, Spinner } from "@components/ui/primitives";
import { Manual, searchManuals } from "@lib/api-client";
import { SearchResults } from "./SearchResults";

export function SearchSection() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Manual[]>([]);

  useEffect(() => {
    const handle = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        setError(null);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data = await searchManuals(query);
        setResults(data);
      } catch (e) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [query]);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium">Search IKEA manuals</label>
          <Input
            placeholder="e.g. BILLY Bookcase"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button className="mt-7" onClick={() => setQuery(query)} disabled={loading}>
          {loading ? (
            <span className="inline-flex items-center gap-2"><Spinner size={14} /> Searching</span>
          ) : (
            "Search"
          )}
        </Button>
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-black/70 dark:text-white/70">
            <Spinner /> <span>Searching manuals…</span>
          </div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : query && results.length === 0 ? (
          <div className="text-sm text-black/60 dark:text-white/60">No manuals found.</div>
        ) : (
          <SearchResults results={results} />
        )}
      </div>
    </Card>
  );
}


