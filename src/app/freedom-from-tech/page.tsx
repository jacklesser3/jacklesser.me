import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { H1, H3, Text, SectionTitle } from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Freedom from Tech",
  description:
    "The competitive advantage of the future is the ability to disconnect. Yoga, breathwork, nervous system regulation, and the reclamation of presence.",
  openGraph: {
    title: "Freedom from Tech | Timeless Practice",
    description:
      "The competitive advantage of the future is the ability to disconnect. Yoga, breathwork, nervous system regulation, and the reclamation of presence.",
  },
};

const workAreas = [
  {
    title: "Yoga & Movement",
    description:
      "Teaching and practicing on rooftops, in studios, and wherever the cathedral effect opens minds. The body is the first teacher. The hardest moment for most people isn't the hardest posture — it's stillness.",
  },
  {
    title: "Breathwork",
    description:
      "You're not breathing correctly. That sounds crazy, but it's true. Intentional breathing is the most accessible tool for clarity, resilience, and nervous system regulation. Proof of work that happens in the body, breath by breath.",
  },
  {
    title: "Slowmaxxing",
    description:
      "Purposeful deceleration. Not laziness — discipline. Slow is smooth, smooth is fast. Brushing your teeth, showering, typing — transform mundane activities through deliberate slowness and watch your attention expand.",
  },
  {
    title: "Nervous System Regulation",
    description:
      "We're in an era of numbness — dependency on quick dopamine hits from fake news and AI-generated slop. The antidote is learning to balance sympathetic and parasympathetic activation. The morning walk before the screen. The breath before the reaction.",
  },
];

export default function FreedomFromTechPage() {
  return (
    <>
      <section className="py-12 md:py-24">
        <Container size="narrow">
          <H1 className="mb-6">Freedom from Tech</H1>
          <Text variant="lead">
            The reclamation of our attention is essentially the reclamation of
            our life. Technology is leverage for sovereignty — but the
            competitive advantage is the ability to disconnect.
          </Text>
        </Container>
      </section>

      <section className="py-12 md:py-24 bg-[var(--color-bg-secondary)]">
        <Container>
          <SectionTitle subtitle="Where I show up. Proof of work in the human system.">
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
              href="/freedom-tech"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-primary)] transition hover:border-white/20 hover:bg-white/[0.06] sm:w-auto"
            >
              &larr; Freedom Tech
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
