import { Metadata } from "next";
import { DraftWarRoom } from "./draft-war-room";

export const metadata: Metadata = {
  title: "Draft War Room | Jack Lesser",
  description: "Fantasy baseball draft assistant with AI-powered recommendations",
};

export default function DraftPage() {
  return <DraftWarRoom />;
}
