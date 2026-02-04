import { Hero } from "@/components/sections/Hero";
import { ArticleFeed } from "@/components/sections/ArticleFeed";
import { Container } from "@/components/ui/Container";
import { SectionTitle, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export const revalidate = 3600; // Revalidate every hour for RSS feed

export default function Home() {
  return (
    <>
      <Hero />

      {/* Manifesto Brief */}
      <section className="py-16 md:py-24 bg-[var(--color-bg-secondary)]">
        <Container size="narrow">
          <div className="text-center">
            <Text variant="lead" className="italic">
              &ldquo;True strength is forged through integration—the unity of
              body, mind, and spirit. It&apos;s not about perfection, but about
              showing up with intention, day after day.&rdquo;
            </Text>
          </div>
        </Container>
      </section>

      {/* Latest Writing */}
      <ArticleFeed />

      {/* Practice Preview */}
      <section className="py-16 md:py-24 bg-[var(--color-bg-secondary)]">
        <Container>
          <SectionTitle subtitle="Where philosophy becomes action.">
            The Practice
          </SectionTitle>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
            <Card variant="elevated">
              <CardContent>
                <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-medium mb-3 text-[var(--color-text-primary)]">
                  Physical Foundation
                </h3>
                <Text variant="small">
                  The body as the vessel. Movement, strength, and discipline as
                  the groundwork for all growth.
                </Text>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardContent>
                <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-medium mb-3 text-[var(--color-text-primary)]">
                  Mental Clarity
                </h3>
                <Text variant="small">
                  Clear thinking through meditation, reflection, and intentional
                  learning. The mind as a tool to be sharpened.
                </Text>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardContent>
                <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-medium mb-3 text-[var(--color-text-primary)]">
                  Spiritual Depth
                </h3>
                <Text variant="small">
                  Connection to something greater. Purpose, meaning, and the
                  courage to face the unknown.
                </Text>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10">
            <Button href="/practice" variant="outline">
              Explore the Practice
            </Button>
          </div>
        </Container>
      </section>

      {/* Connection CTA */}
      <section className="py-20 md:py-32">
        <Container size="narrow">
          <div className="text-center">
            <SectionTitle>Let&apos;s Connect</SectionTitle>
            <Text variant="muted" className="max-w-lg mx-auto mb-8">
              Whether you&apos;re curious about my work, interested in
              collaboration, or just want to say hello—I&apos;d love to hear
              from you.
            </Text>
            <Button href="/connect">Get in Touch</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
