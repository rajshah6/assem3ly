import { AssemblyPageClient } from "@components/assembly/AssemblyPageClient";

export default function AssemblyPage({ params }: { params: { id: string } }) {
  return <AssemblyPageClient manualId={params.id} />;
}


