"use client";

export function PartHighlighter({ partName }: { partName: string }) {
  return (
    <div className="pointer-events-none rounded bg-yellow-300/30 p-1 text-[10px] text-black">
      {partName}
    </div>
  );
}


