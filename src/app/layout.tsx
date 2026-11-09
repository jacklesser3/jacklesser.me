import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "@/styles/globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Timeless Practice | Jack Lesser",
    template: "%s | Timeless Practice",
  },
  description:
    "My notes on what I’m reading, listening to, and learning about work, technology, and attention.",
  keywords: [
    "Jack Lesser",
    "Timeless Practice",
    "podcast reviews",
    "Bitcoin",
    "yoga",
    "wellness",
    "leverage",
    "personal development",
    "Naval Ravikant",
    "David Goggins",
  ],
  authors: [{ name: "Jack Lesser" }],
  creator: "Jack Lesser",
  metadataBase: new URL("https://jacklesser.me"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jacklesser.me",
    siteName: "Timeless Practice",
    title: "Timeless Practice | Jack Lesser",
    description:
      "My notes on what I’m reading, listening to, and learning about work, technology, and attention.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Timeless Practice | Jack Lesser",
    description:
      "My notes on what I’m reading, listening to, and learning about work, technology, and attention.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
