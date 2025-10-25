"use client";

import { AssemblyStep } from "@lib/api-client";

export function StepList({
  steps,
  currentStepIndex,
  onSelectStep,
}: {
  steps: AssemblyStep[];
  currentStepIndex: number;
  onSelectStep: (index: number) => void;
}) {
  return (
    <div className="divide-y divide-black/5 overflow-hidden rounded-xl dark:divide-white/10">
      <div className="bg-black/5 px-4 py-3 text-sm font-medium dark:bg-white/10">Steps</div>
      <ul className="max-h-[420px] overflow-auto">
        {steps.map((s, i) => (
          <li key={s.id}>
            <button
              className={
                "flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:bg-black/5 dark:hover:bg-white/10 " +
                (i === currentStepIndex ? "bg-black/10 dark:bg-white/15" : "")
              }
              onClick={() => onSelectStep(i)}
            >
              <span className="line-clamp-1">{s.title}</span>
              <span className="text-xs opacity-60">{i + 1}/{steps.length}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}


