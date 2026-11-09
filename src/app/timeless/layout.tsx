import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Timeless Practice | Jack Lesser" },
  alternates: { canonical: "https://jacklesser.me/timeless" },
  openGraph: { title: "Timeless Practice | Jack Lesser", url: "https://jacklesser.me/timeless", description: "My notes on what I’m reading, listening to, and learning about work, technology, and attention." },
};
export default function TimelessLayout({ children }: { children: React.ReactNode }) { return children; }
