import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import Portfolio from "@/components/portfolio/Portfolio";

const barlow = Barlow_Condensed({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-barlow", display: "swap" });
const dm = DM_Sans({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-sans", display: "swap" });
export const metadata: Metadata = {
  title: { absolute: "Jack Lesser | Experiential Architecture & Design" },
  description: "Experiences, gatherings, and media that bring people together and help good ideas travel. Strategy, design, and production by Jack Lesser.",
  alternates: { canonical: "https://jacklesser.me" },
  openGraph: { title: "Jack Lesser | Experiential Architecture & Design", description: "Experiences, gatherings, and media that bring people together and help good ideas travel. Strategy, design, and production by Jack Lesser.", url: "https://jacklesser.me", siteName: "Jack Lesser", images: [{ url: "/portfolio/photos/peru-2026-02-IMG_1019.webp", width: 1800, height: 1200 }] },
  twitter: { card: "summary_large_image", title: "Jack Lesser | Experiential Architecture & Design", description: "Experiences, gatherings, and media that bring people together and help good ideas travel. Strategy, design, and production by Jack Lesser.", images: ["/portfolio/photos/peru-2026-02-IMG_1019.webp"] },
};
export default function Home() { return <div className={`${barlow.variable} ${dm.variable}`}><Portfolio /></div>; }
