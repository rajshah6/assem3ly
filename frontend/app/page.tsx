import { LibrarySection } from "@components/library/library-section";
import { SearchSection } from "@components/search/search-section";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Find your IKEA manual</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">Browse popular manuals or search by product name. Click to view interactive 3D instructions.</p>
      </div>
      <SearchSection />
      <div className="mt-12">
        <LibrarySection />
      </div>
    </div>
  );
}
