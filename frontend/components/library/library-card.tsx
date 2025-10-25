"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Manual } from "@lib/api-client";
import { Badge } from "@components/ui/primitives";
import { CanvasRevealEffect } from "@components/ui/canvas-reveal-effect";

const Icon = ({ className, ...rest }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};

export function LibraryCard({ manual }: { manual: Manual }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Link href={`/assembly/${manual.id}`}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group/canvas-card relative mx-auto flex h-[20rem] w-full max-w-sm items-center justify-center border border-black/[0.2] p-4 dark:border-white/[0.2]"
      >
        {/* Corner icons */}
        <Icon className="absolute -left-3 -top-3 h-6 w-6 text-black dark:text-white" />
        <Icon className="absolute -bottom-3 -left-3 h-6 w-6 text-black dark:text-white" />
        <Icon className="absolute -right-3 -top-3 h-6 w-6 text-black dark:text-white" />
        <Icon className="absolute -bottom-3 -right-3 h-6 w-6 text-black dark:text-white" />

        {/* Product image on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 h-full w-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 dark:from-blue-400/30 dark:to-purple-500/30"
            >
              {/* Product image that fills the card on hover */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="relative h-full w-full">
                  <Image 
                    src={manual.imageUrl} 
                    alt={manual.name} 
                    fill 
                    className="object-contain"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product name (visible by default, hidden on hover) */}
        <div className="relative z-20 text-center transition duration-200 group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0">
          <h2 className="px-4 text-xl font-bold text-black dark:text-white">
            {manual.name}
          </h2>
        </div>

        {/* Badge at bottom */}
        <div className="absolute bottom-4 right-4 z-30">
          <Badge className="opacity-70 group-hover/canvas-card:opacity-100">{manual.category}</Badge>
        </div>
      </div>
    </Link>
  );
}


