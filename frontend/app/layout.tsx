import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "assem3ly",
  description: "Interactive IKEA assembly guides",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-40 border-b border-black/5 bg-white/60 backdrop-blur dark:border-white/10 dark:bg-black/50">
            <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-black text-white dark:bg-white dark:text-black">A</span>
                <span className="text-sm font-semibold tracking-tight">assem3ly</span>
              </div>
              <nav className="flex items-center gap-2 text-sm">
                <a href="/" className="rounded px-2 py-1.5 hover:bg-black/5 dark:hover:bg-white/10">Home</a>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-black/5 py-6 text-center text-xs text-black/60 dark:border-white/10 dark:text-white/60">
            Built at CalHacks — Inspired by Aeternity UI
          </footer>
        </div>
      </body>
    </html>
  );
}
