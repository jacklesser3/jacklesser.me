import type { Metadata } from "next";
import ShelfExperience from "@/components/shelf/ShelfExperience";

export const metadata: Metadata = {
  title: "The Shelf",
  description:
    "Browse my podcast reflections and essays. Choose a book from the shelf to read.",
  openGraph: {
    title: "The Shelf | Timeless Practice",
    description:
      "Browse my podcast reflections and essays. Choose a book from the shelf to read.",
    url: "https://jacklesser.me/shelf",
  },
};

export default function ShelfPage() {
  return <ShelfExperience />;
}
