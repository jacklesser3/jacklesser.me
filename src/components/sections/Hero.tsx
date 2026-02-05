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
            Bridging freedom tech and freedom from tech through a holistic
            approach—with proof of work at the root.
          </Text>
          <div className="flex flex-wrap gap-4">
            <Button href="/freedom-tech">Freedom Tech</Button>
            <Button href="/freedom-from-tech" variant="outline">
              Freedom from Tech
            </Button>
            <Button href="/philosophy" variant="outline">
              Philosophy
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
