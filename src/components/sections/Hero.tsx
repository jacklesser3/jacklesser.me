import { Container } from "@/components/ui/Container";
import { H1, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="py-20 md:py-32">
      <Container size="narrow">
        <div className="animate-fade-in">
          <H1 className="mb-6">Jack Lesser</H1>
          <Text variant="lead" className="mb-8 max-w-xl">
            Where discipline meets depth.
          </Text>
          <Text variant="muted" className="mb-10 max-w-xl">
            Exploring the integration of body, mind, and spirit through
            intentional practice and grounded philosophy.
          </Text>
          <div className="flex flex-wrap gap-4">
            <Button href="/philosophy">Explore Philosophy</Button>
            <Button href="/connect" variant="outline">
              Get in Touch
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
