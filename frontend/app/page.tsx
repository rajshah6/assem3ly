import { BackgroundLines } from "@components/ui/background-lines";
import { TiltCard } from "@components/ui/tilt-card";
import { WireframePreview } from "@components/landing/wireframe-preview";

export default function Home() {
  return (
    <div className="relative isolate">
      {/* Hero: full viewport minus header height */}
      <section className="relative flex min-h-[calc(100vh-56px)] items-center justify-center overflow-hidden bg-white px-4 py-16">
        <BackgroundLines density={14} speed={0.12} lineColor="rgba(0,0,0,0.06)" />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center">
          <h1 className="text-6xl font-extrabold tracking-tight text-black md:text-7xl">assem3ly</h1>
          <p className="mt-3 text-sm uppercase tracking-[0.18em] text-black/50">interactive assembly manuals</p>

          <div className="mt-12 w-full">
            <TiltCard>
              <WireframePreview className="mx-auto w-full max-w-5xl" />
            </TiltCard>
          </div>
        </div>
      </section>
    </div>
  );
}
