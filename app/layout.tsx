import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { BackToTop } from "@/components/layout/BackToTop";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/providers";

import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Gambleme — Demo Casino",
    template: "%s | Gambleme",
  },
  description:
    "Educational demo casino with slots, 3D dice, and crash. Play with virtual credits only.",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Providers>
          <Navbar />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
