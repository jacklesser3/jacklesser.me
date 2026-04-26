import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { H1, H3, Text, SectionTitle } from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Freedom Tech",
  description:
    "Freedom tech will be the underpinning thesis for all human-centered innovation. Bitcoin, sovereign systems, and the builders who make it real.",
  openGraph: {
    title: "Freedom Tech | Timeless Practice",
    description:
      "Freedom tech will be the underpinning thesis for all human-centered innovation. Bitcoin, sovereign systems, and the builders who make it real.",
  },
};

const workAreas = [
  {
    title: "Bitcoin Park",
    description:
      "Building the physical hub for Bitcoin and freedom technology. A space where builders, thinkers, and adopters converge in Nashville and Austin. The community is the product.",
  },
  {
    title: "Summits & Events",
    description:
      "ImagineIF, NEMS, TEMS, and more. High-signal gatherings where the most curious and capable minds in Bitcoin, AI, energy, and freedom tech come together. Every talk should entertain, inform, and inspire.",
  },
  {
    title: "Vibe Coding",
    description:
      "Building real tools with AI. Organization matters most. Hallucination control is learnable. Breathing helps. Making is momentum — learn by shipping, breaking, fixing, and repeating.",
  },
  {
    title: "Bitcoin as Proof of Work",
    description:
      "Sound money that escapes inflationary systems. Not just a financial tool but an energy optimization protocol and a buyer of last resort for energy producers. The walls are cracking — it's not fringe anymore.",
  },
];

export default function FreedomTechPage() {
  return (
    <>
      <section className="py-12 md:py-24">
        <Container size="narrow">
          <H1 className="mb-6">Freedom Tech</H1>
          <Text variant="lead">
            Freedom tech will be the underpinning thesis for all human-centered
            innovation and abundance. AI will shape our future — and we&apos;re
            building the one we want to see.
          </Text>
        </Container>
      </section>

      <section className="py-12 md:py-24 bg-[var(--color-bg-secondary)]">
        <Container>
          <SectionTitle subtitle="Where I show up. Proof of work in the freedom tech ecosystem.">
            Work &amp; Presence
          </SectionTitle>

          <div className="grid gap-6 max-w-3xl">
            {workAreas.map((area) => (
              <Card key={area.title} variant="elevated">
                <CardContent>
                  <H3 className="mb-3">{area.title}</H3>
                  <Text variant="muted">{area.description}</Text>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <a
              href="/freedom-from-tech"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-primary)] transition hover:border-white/20 hover:bg-white/[0.06] sm:w-auto"
            >
              Freedom from Tech &rarr;
            </a>
            <a
              href="mailto:jack@bitcoinpark.com"
              className="inline-flex w-full items-center justify-center rounded-xl border border-[var(--color-accent-ember)]/30 bg-[var(--color-accent-ember)]/10 px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-accent-ember)] transition hover:bg-[var(--color-accent-ember)]/20 sm:w-auto"
            >
              Get in Touch
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
