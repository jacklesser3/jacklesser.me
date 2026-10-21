import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Timeless Practice | Jack Lesser" },
  alternates: { canonical: "https://jacklesser.me/timeless" },
  openGraph: { title: "Timeless Practice | Jack Lesser", url: "https://jacklesser.me/timeless", description: "Ideas, thinkers, and technologies that hold up across time. Reviews, reflections, and The Shelf." },
};
export default function TimelessLayout({ children }: { children: React.ReactNode }) { return children; }
