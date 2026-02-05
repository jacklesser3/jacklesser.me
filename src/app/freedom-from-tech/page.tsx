import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { H1, H2, H3, Text, SectionTitle } from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Freedom from Tech",
  description:
    "Work in freedom from tech: yoga, Rewired Protocol, breathwork, and MTA.",
};

const workAreas = [
  {
    title: "Yoga",
    description:
      "Practice and teaching rooted in the body as the first teacher. Movement, breath, and presence as pathways to freedom from the noise.",
  },
  {
    title: "Rewired Protocol",
    description:
      "A systematic approach to nervous system regulation and recovery. Bridging ancient practices with modern understanding of how we heal.",
  },
  {
    title: "Breathwork",
    description:
      "Intentional breathing as a tool for clarity, resilience, and connection. Proof of work that happens in the body, breath by breath.",
  },
  {
    title: "MTA",
    description:
      "Mind-body practices that integrate movement, awareness, and the capacity to show up fully—in tech and beyond.",
  },
];

export default function FreedomFromTechPage() {
  return (
    <>
      <section className="py-16 md:py-24">
        <Container size="narrow">
          <H1 className="mb-6">Freedom from Tech</H1>
          <Text variant="lead">
            Work in the space where we reclaim presence, body, and nervous
            system—so we can use tech without being used by it.
          </Text>
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-[var(--color-bg-secondary)]">
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

          <div className="mt-12 flex flex-wrap gap-4">
            <Button href="/freedom-tech" variant="outline">
              ← Freedom Tech
            </Button>
            <Button href="/connect">Get in Touch</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
