import type { Metadata } from "next";
import localFont from "next/font/local";
import Portfolio from "@/components/portfolio/Portfolio";

const barlow = localFont({
  src: [
    { path: "./fonts/barlow-condensed-400.woff2", weight: "400" },
    { path: "./fonts/barlow-condensed-500.woff2", weight: "500" },
  ],
  variable: "--font-barlow",
  display: "swap",
});
const dm = localFont({
  src: "./fonts/dm-sans.woff2",
  weight: "400 500",
  variable: "--font-dm-sans",
  display: "swap",
});
export const metadata: Metadata = {
  title: { absolute: "Jack Lesser | Vibes Architecture" },
  description: "I design experiences that bring people together and create media that helps ideas travel.",
  alternates: { canonical: "https://jacklesser.me" },
  openGraph: { title: "Jack Lesser | Vibes Architecture", description: "I design experiences that bring people together and create media that helps ideas travel.", url: "https://jacklesser.me", siteName: "Jack Lesser", images: [{ url: "/portfolio/photos/peru-2026-02-IMG_1019.webp", width: 1800, height: 1200 }] },
  twitter: { card: "summary_large_image", title: "Jack Lesser | Vibes Architecture", description: "I design experiences that bring people together and create media that helps ideas travel.", images: ["/portfolio/photos/peru-2026-02-IMG_1019.webp"] },
};
export default function Home() { return <div className={`${barlow.variable} ${dm.variable}`}><Portfolio /></div>; }
