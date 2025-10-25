"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";

export function BackgroundLines({
  className,
  lineColor = "rgba(0,0,0,0.08)",
  density = 12,
  speed = 0.15,
}: {
  className?: string;
  lineColor?: string;
  density?: number; // lines per 100px
  speed?: number; // px per frame
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;

    const onResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;

      const spacing = Math.max(8, 100 / density);
      const offset = offsetRef.current;

      // vertical lines
      for (let x = -spacing + (offset % spacing); x < width + spacing; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // horizontal lines
      for (let y = -spacing + (offset % spacing); y < height + spacing; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      offsetRef.current = (offset + speed) % spacing;
      raf = requestAnimationFrame(draw);
    };

    onResize();
    draw();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [density, speed, lineColor]);

  return (
    <div className={clsx("pointer-events-none absolute inset-0", className)} aria-hidden>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}


