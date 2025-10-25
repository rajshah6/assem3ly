"use client";

import { useEffect, useRef } from "react";
import { AssemblyStep } from "@lib/api-client";
import { ViewerControls } from "./ViewerControls";

export default function AssemblyViewer({
  steps,
  currentStep,
  onStepChange,
}: {
  steps: AssemblyStep[];
  currentStep: number;
  onStepChange: (i: number) => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Placeholder for Three.js integration; for now, just render a mock canvas area
  }, [currentStep]);

  return (
    <div className="flex flex-col">
      <div ref={canvasRef} className="h-[420px] w-full rounded-xl bg-black/5 dark:bg-white/10" />
      <div className="border-t border-black/5 p-3 text-xs text-black/60 dark:border-white/10 dark:text-white/60">
        Showing: {steps[currentStep]?.title}
      </div>
      <ViewerControls onResetCamera={() => {}} />
    </div>
  );
}


