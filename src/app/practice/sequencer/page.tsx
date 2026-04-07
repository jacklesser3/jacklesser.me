import type { Metadata } from "next";
import { SequencerStudio } from "./sequencer-studio";

export const metadata: Metadata = {
  title: "FlowState",
  description:
    "FlowState helps build yoga class flows with animated stick-figure sequencing, pranayama cues, and teaching threads from yoga philosophy and modern science.",
};

export default function SequencerPage() {
  return <SequencerStudio />;
}
