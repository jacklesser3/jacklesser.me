import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { H1, H2, H3, Text, SectionTitle } from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Freedom Tech",
  description:
    "Work in freedom tech: Bitcoin Park, summits, meetups, podcast, and speaking.",
};

const workAreas = [
  {
    title: "Bitcoin Park",
    description:
      "Building and contributing to the Nashville hub for Bitcoin and freedom technology. A physical space where builders, thinkers, and adopters converge.",
  },
  {
    title: "Summits",
    description:
      "Organizing and participating in summits that bring together the freedom tech community. High-signal gatherings for alignment and collaboration.",
  },
  {
    title: "Meetups",
    description:
      "Local and regional meetups to foster connection, education, and grassroots adoption of sovereign technology.",
  },
  {
    title: "Podcast",
    description:
      "Conversations at the intersection of freedom tech, philosophy, and lived experience. Long-form dialogue with builders and thinkers.",
  },
  {
    title: "Speaking",
    description:
      "Talks and workshops on Bitcoin, freedom tech, and the integration of technology with human flourishing.",
  },
];

export default function FreedomTechPage() {
  return (
    <>
      <section className="py-16 md:py-24">
        <Container size="narrow">
          <H1 className="mb-6">Freedom Tech</H1>
          <Text variant="lead">
            Work in the space where technology serves human freedom—Bitcoin,
            sovereign systems, and the builders who make it real.
          </Text>
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-[var(--color-bg-secondary)]">
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

          <div className="mt-12 flex flex-wrap gap-4">
            <Button href="/freedom-from-tech" variant="outline">
              Freedom from Tech →
            </Button>
            <Button href="/connect">Get in Touch</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
