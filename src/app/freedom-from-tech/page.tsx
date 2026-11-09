import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { H1, H3, Text, SectionTitle } from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Freedom from Tech",
  description:
    "I teach yoga and breathwork and make time to move, slow down, and step away from screens.",
  openGraph: {
    title: "Freedom from Tech | Timeless Practice",
    description:
      "I teach yoga and breathwork and make time to move, slow down, and step away from screens.",
  },
};

const workAreas = [
  {
    title: "Yoga & Movement",
    description:
      "I teach and practice yoga in studios, on rooftops, and wherever we have room to move. The practice makes space for both movement and stillness.",
  },
  {
    title: "Breathwork",
    description:
      "I guide breathwork sessions that invite people to slow down and notice their breathing and how they feel.",
  },
  {
    title: "Slowing Down",
    description:
      "I practice doing ordinary things without rushing. A walk, a meal, or a few minutes between tasks can be a chance to pay attention.",
  },
  {
    title: "Nervous System Regulation",
    description:
      "I make room to notice stress and pause before reacting. For me, that can mean a morning walk before opening my laptop or a few quiet breaths between conversations.",
  },
];

export default function FreedomFromTechPage() {
  return (
    <>
      <section className="py-12 md:py-24">
        <Container size="narrow">
          <H1 className="mb-6">Freedom from Tech</H1>
          <Text variant="lead">
            Technology is part of my work, but so is knowing when to step away.
            Yoga, breathwork, and time outside help me return to my body
            and pay attention to the people around me.
          </Text>
        </Container>
      </section>

      <section className="py-12 md:py-24 bg-[var(--color-bg-secondary)]">
        <Container>
          <SectionTitle subtitle="What I teach and make time for.">
            My practice
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
