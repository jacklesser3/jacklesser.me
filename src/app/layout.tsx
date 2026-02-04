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
    default: "Jack Lesser | Where Discipline Meets Depth",
    template: "%s | Jack Lesser",
  },
  description:
    "Personal website of Jack Lesser. Exploring the intersection of discipline and depth through integrated wellness—body, mind, and spirit.",
  keywords: [
    "Jack Lesser",
    "wellness",
    "discipline",
    "philosophy",
    "practice",
    "personal development",
  ],
  authors: [{ name: "Jack Lesser" }],
  creator: "Jack Lesser",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jacklesser.me",
    siteName: "Jack Lesser",
    title: "Jack Lesser | Where Discipline Meets Depth",
    description:
      "Exploring the intersection of discipline and depth through integrated wellness—body, mind, and spirit.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jack Lesser | Where Discipline Meets Depth",
    description:
      "Exploring the intersection of discipline and depth through integrated wellness—body, mind, and spirit.",
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
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
