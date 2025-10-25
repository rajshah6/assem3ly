"use client";

export function PartsList({ parts }: { parts: string[] }) {
  return (
    <div className="divide-y divide-black/5 overflow-hidden rounded-xl dark:divide-white/10">
      <div className="bg-black/5 px-4 py-3 text-sm font-medium dark:bg-white/10">Parts</div>
      <ul className="max-h-48 overflow-auto px-4 py-2 text-sm">
        {parts.length === 0 ? (
          <li className="text-black/60 dark:text-white/60">No parts for this step</li>
        ) : (
          parts.map((p, i) => <li key={i} className="py-1">• {p}</li>)
        )}
      </ul>
    </div>
  );
}


