"use client";

import { useMemo } from "react";
import clsx from "clsx";

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 disabled:opacity-50 disabled:pointer-events-none h-10 px-4";
  const styles = useMemo(() => {
    switch (variant) {
      case "secondary":
        return "bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15";
      case "ghost":
        return "hover:bg-black/5 dark:hover:bg-white/10";
      default:
        return "bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90";
    }
  }, [variant]);
  return (
    <button className={clsx(base, styles, className)} {...props}>
      {children}
    </button>
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-sm placeholder-black/40 outline-none transition focus:border-black/30 dark:border-white/15 dark:bg-black dark:placeholder-white/30 dark:focus:border-white/30",
        className
      )}
      {...props}
    />
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-black/10 bg-white p-4 shadow-[0_1px_0_0_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-black",
        className
      )}
      {...props}
    />
  );
}

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full bg-black/5 px-2 py-1 text-xs font-medium text-black/70 dark:bg-white/10 dark:text-white/70",
        className
      )}
      {...props}
    />
  );
}

export function Spinner({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={clsx("animate-spin text-black dark:text-white", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}


