"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

export const DraggableCardContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("relative h-full w-full", className)}>{children}</div>
  );
};

export const DraggableCardBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  return (
    <div
      ref={cardRef}
      onMouseDown={handleMouseDown}
      className={cn(
        "cursor-grab active:cursor-grabbing rounded-xl border border-neutral-200 bg-white p-4 shadow-xl transition-shadow hover:shadow-2xl dark:border-neutral-700 dark:bg-neutral-900",
        isDragging && "cursor-grabbing shadow-2xl",
        className
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? "none" : "transform 0.1s ease-out",
      }}
    >
      {children}
    </div>
  );
};

