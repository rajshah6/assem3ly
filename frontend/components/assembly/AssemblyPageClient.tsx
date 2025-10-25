"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getAssemblyScene, AssemblyScene } from "@lib/api-client";
import { Card, Spinner, Button } from "@components/ui/primitives";
import { StepList } from "./StepList";
import { PartsList } from "./PartsList";
import { ToolsList } from "./ToolsList";
import { StepNavigation } from "./StepNavigation";

const AssemblyViewer = dynamic(() => import("@components/viewer/AssemblyViewer"), {
  ssr: false,
});

export function AssemblyPageClient({ manualId }: { manualId: string }) {
  const [scene, setScene] = useState<AssemblyScene | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const s = await getAssemblyScene(manualId);
        setScene(s);
      } finally {
        setLoading(false);
      }
    })();
  }, [manualId]);

  if (loading || !scene) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <Card className="flex items-center gap-2 p-6 text-sm"><Spinner /> Loading 3D instructions…</Card>
      </div>
    );
  }

  const step = scene.steps[currentStep];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Interactive Instructions</h1>
          <p className="text-sm text-black/60 dark:text-white/60">{step.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <Card className="mb-4 p-0">
            <StepList
              steps={scene.steps}
              currentStepIndex={currentStep}
              onSelectStep={setCurrentStep}
            />
          </Card>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
            <Card className="p-0">
              <PartsList parts={step.parts ?? []} />
            </Card>
            <Card className="p-0">
              <ToolsList tools={step.tools ?? []} />
            </Card>
          </div>
        </aside>
        <section className="lg:col-span-8">
          <Card className="p-0">
            <AssemblyViewer steps={scene.steps} currentStep={currentStep} onStepChange={setCurrentStep} />
          </Card>
          <div className="mt-4">
            <StepNavigation
              canPrev={currentStep > 0}
              canNext={currentStep < scene.steps.length - 1}
              onPrev={() => setCurrentStep((s) => Math.max(0, s - 1))}
              onNext={() => setCurrentStep((s) => Math.min(scene.steps.length - 1, s + 1))}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default AssemblyPageClient;


