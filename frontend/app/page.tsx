import { BackgroundLines } from "@components/ui/background-lines";
import { LandingSwitcher } from "@components/landing/landing-switcher";

export default function Home() {
  return (
    <div className="relative isolate">
      {/* Hero: full viewport minus header height */}
      <section className="relative flex min-h-[calc(100vh-56px)] items-center justify-center overflow-hidden bg-white px-4 py-16">
        <BackgroundLines density={14} speed={0.12} lineColor="rgba(0,0,0,0.06)" />

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <LandingSwitcher />
        </div>
      </section>

      {/* Tabs removed from body; moved to header */}
    </div>
  );
}
