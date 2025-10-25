import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HeaderTabsProvider } from "@components/navigation/tabs-context";
import { HeaderTabs } from "@components/navigation/header-tabs";

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
        <HeaderTabsProvider>
          <div className="flex min-h-screen flex-col">
            <header className="border-b border-black/10 bg-white">
              <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-black text-white">A</span>
                  <span className="text-sm font-semibold tracking-tight text-black">assem3ly</span>
                </div>
                <nav className="flex items-center gap-2 text-sm text-black">
                  <HeaderTabs />
                </nav>
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </HeaderTabsProvider>
      </body>
    </html>
  );
}
