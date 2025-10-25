"use client";

export function ToolsList({ tools }: { tools: string[] }) {
  return (
    <div className="divide-y divide-black/5 overflow-hidden rounded-xl dark:divide-white/10">
      <div className="bg-black/5 px-4 py-3 text-sm font-medium dark:bg-white/10">Tools</div>
      <ul className="max-h-48 overflow-auto px-4 py-2 text-sm">
        {tools.length === 0 ? (
          <li className="text-black/60 dark:text-white/60">No tools for this step</li>
        ) : (
          tools.map((t, i) => <li key={i} className="py-1">• {t}</li>)
        )}
      </ul>
    </div>
  );
}


