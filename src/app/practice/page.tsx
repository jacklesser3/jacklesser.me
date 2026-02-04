import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { H1, H2, H3, Text, SectionTitle } from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Practice",
  description:
    "How philosophy translates into action. Methodology, areas of focus, and current work.",
};

const areas = [
  {
    title: "Physical Training",
    description:
      "Strength training, movement practice, and body awareness as the foundation for all growth. The body is the first domain of mastery.",
    aspects: [
      "Functional strength development",
      "Movement quality and mobility",
      "Recovery and regeneration",
      "Mind-body integration",
    ],
  },
  {
    title: "Mental Cultivation",
    description:
      "Developing clarity of thought, emotional regulation, and the capacity for deep focus. The mind as a tool to be sharpened and directed.",
    aspects: [
      "Meditation and contemplation",
      "Journaling and reflection",
      "Intentional learning",
      "Decision-making frameworks",
    ],
  },
  {
    title: "Creative Work",
    description:
      "Expression through writing, building, and creation. The act of making something from nothing as a form of spiritual practice.",
    aspects: [
      "Long-form writing",
      "Building digital products",
      "Exploring ideas publicly",
      "Documentation of the journey",
    ],
  },
];

export default function PracticePage() {
  return (
    <>
      {/* Header */}
      <section className="py-16 md:py-24">
        <Container size="narrow">
          <H1 className="mb-6">The Practice</H1>
          <Text variant="lead">
            Where philosophy becomes action. The daily work of integration.
          </Text>
        </Container>
      </section>

      {/* Methodology */}
      <section className="py-16 md:py-24 bg-[var(--color-bg-secondary)]">
        <Container size="narrow">
          <SectionTitle>Methodology</SectionTitle>

          <div className="prose max-w-none space-y-6">
            <Text variant="muted">
              Practice is not about perfection—it&apos;s about showing up with
              intention, day after day. The methodology is simple: identify what
              matters, remove what doesn&apos;t, and do the work consistently.
            </Text>

            <Text variant="muted">
              There are no shortcuts. There is no hack that replaces time under
              tension, whether that tension is physical, mental, or emotional.
              The practice honors this reality while remaining adaptable to
              life&apos;s rhythms.
            </Text>

            <div className="mt-8 p-6 bg-[var(--color-bg-primary)] rounded-lg">
              <H3 className="mb-4">Core Principles</H3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-accent-forge)] font-medium">
                    01
                  </span>
                  <Text variant="small" className="flex-1">
                    <strong>Consistency over intensity.</strong> Small actions
                    compounded beat sporadic heroics.
                  </Text>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-accent-forge)] font-medium">
                    02
                  </span>
                  <Text variant="small" className="flex-1">
                    <strong>Integration over isolation.</strong> Train body,
                    mind, and spirit together, not separately.
                  </Text>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-accent-forge)] font-medium">
                    03
                  </span>
                  <Text variant="small" className="flex-1">
                    <strong>Process over outcome.</strong> Fall in love with the
                    work, not just the results.
                  </Text>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-accent-forge)] font-medium">
                    04
                  </span>
                  <Text variant="small" className="flex-1">
                    <strong>Recovery as practice.</strong> Rest is not the
                    absence of work—it is part of the work.
                  </Text>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Areas of Practice */}
      <section className="py-16 md:py-24">
        <Container>
          <SectionTitle subtitle="The domains where I apply these principles daily.">
            Areas of Practice
          </SectionTitle>

          <div className="grid gap-8 max-w-4xl">
            {areas.map((area) => (
              <Card key={area.title} variant="outlined">
                <CardContent className="p-8">
                  <H2 className="mb-4">{area.title}</H2>
                  <Text variant="muted" className="mb-6">
                    {area.description}
                  </Text>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {area.aspects.map((aspect) => (
                      <div
                        key={aspect}
                        className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-ember)]" />
                        {aspect}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Current Focus */}
      <section className="py-16 md:py-24 bg-[var(--color-bg-secondary)]">
        <Container size="narrow">
          <SectionTitle subtitle="What I'm working on right now.">
            Current Focus
          </SectionTitle>

          <div className="space-y-8">
            <Card variant="elevated">
              <CardContent>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <H3>Building in Public</H3>
                  <span className="text-xs uppercase tracking-wider text-[var(--color-accent-forge)] bg-[var(--color-bg-secondary)] px-3 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <Text variant="muted">
                  Sharing the journey through writing on Substack and building
                  this personal site. Documenting the integration of philosophy
                  and practice in real time.
                </Text>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardContent>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <H3>Deepening Physical Practice</H3>
                  <span className="text-xs uppercase tracking-wider text-[var(--color-accent-forge)] bg-[var(--color-bg-secondary)] px-3 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <Text variant="muted">
                  Exploring the edges of physical capacity while maintaining
                  focus on longevity and sustainable practice. Training as
                  meditation.
                </Text>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardContent>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <H3>Contemplative Study</H3>
                  <span className="text-xs uppercase tracking-wider text-[var(--color-accent-ember)] bg-[var(--color-bg-secondary)] px-3 py-1 rounded-full">
                    Ongoing
                  </span>
                </div>
                <Text variant="muted">
                  Deepening understanding of wisdom traditions and their
                  practical application. Reading, reflection, and integration.
                </Text>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Text variant="muted" className="mb-6">
              Interested in working together or learning more?
            </Text>
            <Button href="/connect">Get in Touch</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
