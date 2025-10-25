import clsx from "clsx";

export function WireframePreview({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-black/10 bg-white p-4 text-black shadow-[0_1px_0_0_rgba(0,0,0,0.04)]",
        className
      )}
    >
      <div className="flex gap-4">
        {/* Left: sidebar bars to hint StepList */}
        <div className="w-48 shrink-0">
          <div className="mb-3 h-6 rounded bg-black/10" />
          <div className="mb-2 h-4 rounded bg-black/10" />
          <div className="mb-2 h-4 rounded bg-black/10" />
          <div className="mb-2 h-4 rounded bg-black/10" />
          <div className="mb-2 h-4 rounded bg-black/10" />
          <div className="mb-2 h-4 rounded bg-black/10" />
          <div className="mb-2 h-4 rounded bg-black/10" />
        </div>

        {/* Right: viewer area with outline cube */}
        <div className="relative grid flex-1 place-items-center rounded-lg border border-black/10 bg-white">
          {/* Cube outline */}
          <div className="relative h-40 w-40">
            {/* square */}
            <div className="absolute inset-0 rounded border border-black/30" />
            {/* top-right shifted square */}
            <div className="absolute left-4 top-4 h-full w-full rounded border border-black/30" />
            {/* connecting edges */}
            <div className="absolute left-0 top-0 h-4 w-px bg-black/30" />
            <div className="absolute right-0 top-0 h-4 w-px bg-black/30" />
            <div className="absolute left-0 bottom-0 h-4 w-px bg-black/30" />
            <div className="absolute right-0 bottom-0 h-4 w-px bg-black/30" />
            <div className="absolute left-4 top-4 h-4 w-px bg-black/30" />
            <div className="absolute right-4 top-4 h-4 w-px bg-black/30" />
            <div className="absolute left-4 bottom-4 h-4 w-px bg-black/30" />
            <div className="absolute right-4 bottom-4 h-4 w-px bg-black/30" />
          </div>
        </div>
      </div>

      {/* Bottom: prev/next pills */}
      <div className="mt-4 flex items-center justify-end gap-2">
        <div className="h-6 w-14 rounded-full border border-black/10" />
        <div className="h-6 w-14 rounded-full border border-black/10" />
      </div>
    </div>
  );
}


