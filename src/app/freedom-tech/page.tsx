import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { H1, H3, Text, SectionTitle } from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Freedom Tech",
  description:
    "I work with people building technology that gives us more control over our money, tools, and information.",
  openGraph: {
    title: "Freedom Tech | Timeless Practice",
    description:
      "I work with people building technology that gives us more control over our money, tools, and information.",
  },
};

const workAreas = [
  {
    title: "Bitcoin Park",
    description:
      "Bitcoin Park brings people together around Bitcoin and freedom technology in Nashville and Austin. I run Austin operations and help organize events and communications.",
  },
  {
    title: "Summits & Events",
    description:
      "I help produce Imagine IF, the Nashville Energy & Mining Summit (NEMS), and the Texas Energy & Mining Summit (TEMS). These gatherings give people working in Bitcoin, AI, and energy a place to exchange ideas.",
  },
  {
    title: "Building with AI",
    description:
      "I use AI to build tools and websites. I learn by making something useful, testing it, and improving what doesn’t work.",
  },
  {
    title: "Bitcoin as Proof of Work",
    description:
      "I’m interested in Bitcoin as a form of money people can hold and use independently, and in how mining connects it to energy production.",
  },
];

export default function FreedomTechPage() {
  return (
    <>
      <section className="py-12 md:py-24">
        <Container size="narrow">
          <H1 className="mb-6">Freedom Tech</H1>
          <Text variant="lead">
            I’m interested in technology that gives people more control over
            their money, tools, and information. My work brings together the
            people building and using it.
          </Text>
        </Container>
      </section>

      <section className="py-12 md:py-24 bg-[var(--color-bg-secondary)]">
        <Container>
          <SectionTitle subtitle="Here’s how that interest takes shape in my work.">
            What I’m working on
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
