import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { H1, H3, Text, SectionTitle } from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Connect",
  description:
    "Get in touch with Jack Lesser. Reach out for collaboration, questions, or conversation.",
  openGraph: {
    title: "Connect | Timeless Practice",
    description:
      "Get in touch with Jack Lesser. Reach out for collaboration, questions, or conversation.",
  },
};

export default function ConnectPage() {
  return (
    <>
      <section className="py-12 md:py-24">
        <Container size="narrow">
          <H1 className="mb-6">Connect</H1>
          <Text variant="lead">
            Whether you have a question, want to collaborate, or just want to
            say hello — I&apos;d love to hear from you.
          </Text>

          <div className="mt-10">
            <a
              href="mailto:jack@bitcoinpark.com"
              className="inline-flex w-full items-center justify-center rounded-xl border border-[var(--color-accent-ember)]/30 bg-[var(--color-accent-ember)]/10 px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-accent-ember)] transition hover:bg-[var(--color-accent-ember)]/20 sm:w-auto sm:text-sm"
            >
              Get in Touch
            </a>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-[var(--color-bg-secondary)]">
        <Container>
          <div className="grid gap-6 max-w-2xl">
            <Card variant="elevated">
              <CardContent>
                <H3 className="mb-2">Substack</H3>
                <Text variant="muted">
                  Ideas, thinkers, and technologies that hold up across time.
                  Essays on performance, leverage, and inner work.
                </Text>
                <a
                  href="https://satflow.substack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-[var(--color-accent-ember)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  satflow.substack.com
                </a>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardContent>
                <H3 className="mb-2">Social</H3>
                <Text variant="muted">
                  More frequent updates, threads, and conversations.
                </Text>
                <div className="flex gap-4 mt-3">
                  <a
                    href="https://twitter.com/jacklesser"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-accent-ember)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    Twitter
                  </a>
                  <a
                    href="https://linkedin.com/in/jacklesser"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-accent-ember)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    LinkedIn
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
