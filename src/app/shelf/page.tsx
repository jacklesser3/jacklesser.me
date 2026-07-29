import type { Metadata } from "next";
import ShelfExperience from "@/components/shelf/ShelfExperience";

export const metadata: Metadata = {
  title: "The Shelf",
  description:
    "A 3D library of Timeless Practice — clothbound volumes of podcast reflections and essays. Browse the shelf, pull a book forward, and read the piece behind it.",
  openGraph: {
    title: "The Shelf | Timeless Practice",
    description:
      "Browse the clothbound volumes of Timeless Practice reflections in a warm editorial 3D library.",
    url: "https://jacklesser.me/shelf",
  },
};

export default function ShelfPage() {
  return <ShelfExperience />;
}
