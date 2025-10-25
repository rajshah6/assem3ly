"use client";

import Image from "next/image";
import Link from "next/link";
import { Manual } from "@lib/api-client";
import { Card, Badge } from "@components/ui/primitives";

export function ProductCard({ manual }: { manual: Manual }) {
  return (
    <Link href={`/assembly/${manual.id}`}>
      <Card className="group cursor-pointer p-4 transition hover:shadow-md">
        <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-lg bg-black/5 dark:bg-white/10">
          <Image src={manual.imageUrl} alt={manual.name} fill className="object-contain p-6 opacity-80 group-hover:opacity-100" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-medium">{manual.name}</h3>
          <Badge>{manual.category}</Badge>
        </div>
      </Card>
    </Link>
  );
}


