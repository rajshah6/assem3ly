"use client";

import { useRef } from "react";
import clsx from "clsx";

export function TiltCard({
  children,
  className,
  maxTiltDeg = 10,
  perspective = 900,
}: {
  children: React.ReactNode;
  className?: string;
  maxTiltDeg?: number;
  perspective?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const rx = (0.5 - py) * 2 * maxTiltDeg; // tilt X
    const ry = (px - 0.5) * 2 * maxTiltDeg; // tilt Y
    el.style.transform = `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg)`;
  };

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={clsx("transition-transform duration-75 ease-linear", className)}
    >
      <div ref={ref} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}


