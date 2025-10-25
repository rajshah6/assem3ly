"use client";

import { Button } from "@components/ui/primitives";

export function ViewerControls({ onResetCamera }: { onResetCamera: () => void }) {
  return (
    <div className="flex items-center justify-end gap-2 p-3">
      <Button variant="secondary" onClick={onResetCamera}>Reset Camera</Button>
    </div>
  );
}


