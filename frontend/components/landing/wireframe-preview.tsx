"use client";

import React from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";
import { TOP_50_PRODUCTS } from "@/lib/top-50-data";

export function WireframePreview({ className }: { className?: string }) {
  const items = [
    {
      title: TOP_50_PRODUCTS[1].name,
      image: TOP_50_PRODUCTS[1].imageUrl,
      className: "absolute top-10 left-[20%] rotate-[-5deg]",
    },
    {
      title: TOP_50_PRODUCTS[2].name,
      image: TOP_50_PRODUCTS[2].imageUrl,
      className: "absolute top-40 left-[25%] rotate-[-7deg]",
    },
    {
      title: TOP_50_PRODUCTS[3].name,
      image: TOP_50_PRODUCTS[3].imageUrl,
      className: "absolute top-5 left-[40%] rotate-[8deg]",
    },
    {
      title: TOP_50_PRODUCTS[4].name,
      image: TOP_50_PRODUCTS[4].imageUrl,
      className: "absolute top-32 left-[55%] rotate-[10deg]",
    },
    {
      title: TOP_50_PRODUCTS[5].name,
      image: TOP_50_PRODUCTS[5].imageUrl,
      className: "absolute top-20 right-[35%] rotate-[2deg]",
    },
    {
      title: TOP_50_PRODUCTS[6].name,
      image: TOP_50_PRODUCTS[6].imageUrl,
      className: "absolute top-24 left-[45%] rotate-[-7deg]",
    },
    {
      title: TOP_50_PRODUCTS[7].name,
      image: TOP_50_PRODUCTS[7].imageUrl,
      className: "absolute top-8 left-[30%] rotate-[4deg]",
    },
    {
      title: TOP_50_PRODUCTS[8].name,
      image: TOP_50_PRODUCTS[8].imageUrl,
      className: "absolute top-16 right-[25%] rotate-[-3deg]",
    },
  ];

  return (
    <DraggableCardContainer className="relative flex min-h-[400px] w-full items-center justify-center overflow-clip">
      <p className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-xl font-black text-neutral-400 md:text-3xl dark:text-neutral-800">
        Interactive IKEA Assembly Manuals
      </p>
      {items.map((item, index) => (
        <DraggableCardBody key={index} className={item.className}>
          <img
            src={item.image}
            alt={item.title}
            className="pointer-events-none relative z-10 h-48 w-48 object-cover rounded-lg"
          />
          <h3 className="mt-2 text-center text-xs font-bold text-neutral-700 dark:text-neutral-300">
            {item.title}
          </h3>
        </DraggableCardBody>
      ))}
    </DraggableCardContainer>
  );
}


