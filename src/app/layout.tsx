import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "@/styles/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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
    default: "Jack Lesser | Podcast Reviews",
    template: "%s | Jack Lesser",
  },
  description:
    "Jack Lesser's podcast reviews and notes on discipline, leverage, psychology, and the ideas worth revisiting.",
  keywords: [
    "Jack Lesser",
    "podcast reviews",
    "discipline",
    "psychology",
    "philosophy",
    "personal development",
  ],
  authors: [{ name: "Jack Lesser" }],
  creator: "Jack Lesser",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jacklesser.me",
    siteName: "Jack Lesser",
    title: "Jack Lesser | Podcast Reviews",
    description:
      "Podcast reviews and personal notes on the conversations that shape how Jack Lesser thinks and lives.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jack Lesser | Podcast Reviews",
    description:
      "Podcast reviews and personal notes on discipline, leverage, psychology, and inner work.",
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
