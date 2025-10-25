"use client";

import { Button } from "@components/ui/primitives";

export function StepNavigation({
  canPrev,
  canNext,
  onPrev,
  onNext,
}: {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Button variant="secondary" onClick={onPrev} disabled={!canPrev}>
        Previous
      </Button>
      <Button onClick={onNext} disabled={!canNext}>
        Next
      </Button>
    </div>
  );
}


