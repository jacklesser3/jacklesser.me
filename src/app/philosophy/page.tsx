import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { H1, H2, H3, Text, SectionTitle } from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Philosophy",
  description:
    "Core beliefs and guiding principles on integrated wellness, discipline, and the pursuit of depth.",
};

const pillars = [
  {
    title: "Body as Foundation",
    description:
      "The physical vessel is where all transformation begins. Through movement, strength, and disciplined care of the body, we build the foundation for mental clarity and spiritual growth. The body is not separate from the mind—it is the first teacher.",
  },
  {
    title: "Spiritual Practice",
    description:
      "Connection to something greater than ourselves provides meaning and direction. Whether through meditation, contemplation, or simply being present, spiritual practice grounds us in purpose and opens us to wisdom beyond our individual understanding.",
  },
  {
    title: "Emotional Intelligence",
    description:
      "The courage to feel fully—to sit with discomfort, joy, grief, and love—is essential to living authentically. Emotional depth is not weakness; it is the capacity to be human completely.",
  },
  {
    title: "Proof of Work",
    description:
      "Ideas mean nothing without action. Consistent, intentional effort over time is the only path to genuine transformation. Show up, do the work, let the results speak for themselves.",
  },
  {
    title: "Integration",
    description:
      "The goal is not to master body, mind, and spirit separately, but to weave them together into a unified whole. True strength comes from integration—when all parts of ourselves move in the same direction.",
  },
];

export default function PhilosophyPage() {
  return (
    <>
      {/* Header */}
      <section className="py-16 md:py-24">
        <Container size="narrow">
          <H1 className="mb-6">Philosophy</H1>
          <Text variant="lead">
            Guiding principles for living with intention, discipline, and depth.
          </Text>
        </Container>
      </section>

      {/* Core Beliefs */}
      <section className="py-16 md:py-24 bg-[var(--color-bg-secondary)]">
        <Container>
          <SectionTitle subtitle="The foundations that guide my approach to life and work.">
            Core Pillars
          </SectionTitle>

          <div className="grid gap-8 max-w-3xl">
            {pillars.map((pillar, index) => (
              <Card key={pillar.title} variant="elevated">
                <CardContent>
                  <div className="flex items-start gap-4">
                    <span className="text-sm font-medium text-[var(--color-accent-forge)] mt-1">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <H3 className="mb-3">{pillar.title}</H3>
                      <Text variant="muted">{pillar.description}</Text>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Extended Philosophy */}
      <section className="py-16 md:py-24">
        <Container size="narrow">
          <SectionTitle>The Deeper Path</SectionTitle>

          <div className="prose max-w-none space-y-6">
            <Text variant="muted">
              We live in a world that celebrates fragmentation—the specialist,
              the optimizer, the hack. But the most profound growth comes not
              from isolating variables, but from embracing the messy,
              interconnected reality of human experience.
            </Text>

            <Text variant="muted">
              When we train the body, we are also training the mind. When we
              sit in meditation, we are also healing the heart. When we face
              our fears, we are also discovering our purpose. Nothing exists
              in isolation.
            </Text>

            <H2 className="mt-12 mb-6">The Forge Metaphor</H2>

            <Text variant="muted">
              A forge is where raw materials are transformed through heat,
              pressure, and skillful intention. The process is neither gentle
              nor quick—it requires sustained effort and the wisdom to know
              when to apply force and when to let things cool.
            </Text>

            <Text variant="muted">
              We are both the blacksmith and the metal. We choose to enter the
              fire, to be shaped by challenge, to emerge stronger and more
              refined. This is the work: showing up to the forge, day after
              day, with humility and determination.
            </Text>

            <H2 className="mt-12 mb-6">Grounded Futurism</H2>

            <Text variant="muted">
              To be grounded is to be rooted in reality—in the body, in
              relationships, in the present moment. To be futuristic is to
              imagine new possibilities and work toward them with intention.
            </Text>

            <Text variant="muted">
              These are not opposites. The most powerful vision for the future
              comes from a deep understanding of who we are now. Innovation
              without roots becomes distraction. Tradition without evolution
              becomes stagnation. The path forward holds both.
            </Text>
          </div>
        </Container>
      </section>

      {/* Influences */}
      <section className="py-16 md:py-24 bg-[var(--color-bg-secondary)]">
        <Container>
          <SectionTitle subtitle="Thinkers, practices, and traditions that have shaped my path.">
            Influences
          </SectionTitle>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl">
            <div>
              <H3 className="mb-4">Traditions</H3>
              <ul className="space-y-2">
                <li className="text-[var(--color-text-secondary)]">
                  Stoic Philosophy
                </li>
                <li className="text-[var(--color-text-secondary)]">
                  Contemplative Practices
                </li>
                <li className="text-[var(--color-text-secondary)]">
                  Somatic Work
                </li>
                <li className="text-[var(--color-text-secondary)]">
                  Martial Arts Philosophy
                </li>
              </ul>
            </div>

            <div>
              <H3 className="mb-4">Thinkers</H3>
              <ul className="space-y-2">
                <li className="text-[var(--color-text-secondary)]">
                  Carl Jung
                </li>
                <li className="text-[var(--color-text-secondary)]">
                  Marcus Aurelius
                </li>
                <li className="text-[var(--color-text-secondary)]">
                  Thich Nhat Hanh
                </li>
                <li className="text-[var(--color-text-secondary)]">
                  David Whyte
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
