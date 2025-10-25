"use client";

import React, { useEffect, useRef } from "react";
import clsx from "clsx";

export const CanvasRevealEffect = ({
  animationSpeed = 0.4,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let dots: Dot[] = [];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initDots();
    };

    class Dot {
      x: number;
      y: number;
      targetOpacity: number;
      currentOpacity: number;
      color: number[];

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.targetOpacity = 0;
        this.currentOpacity = 0;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      draw() {
        if (!ctx) return;
        this.currentOpacity += (this.targetOpacity - this.currentOpacity) * animationSpeed;
        ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.currentOpacity})`;
        ctx.fillRect(this.x, this.y, dotSize || 2, dotSize || 2);
      }
    }

    const initDots = () => {
      dots = [];
      const spacing = dotSize || 4;
      for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
          dots.push(new Dot(x, y));
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((dot) => {
        dot.targetOpacity = opacities[Math.floor(Math.random() * opacities.length)];
        dot.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [animationSpeed, opacities, colors, dotSize]);

  return (
    <div className={clsx("h-full w-full", containerClassName)}>
      <canvas ref={canvasRef} className="h-full w-full" />
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent dark:from-black/90" />
      )}
    </div>
  );
};

