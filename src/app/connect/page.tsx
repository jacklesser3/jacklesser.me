import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { H1, H3, Text, SectionTitle } from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/Card";
import { ContactForm } from "@/components/sections/ContactForm";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Connect",
  description:
    "Get in touch with Jack Lesser. Reach out for collaboration, questions, or conversation.",
};

export default function ConnectPage() {
  return (
    <>
      {/* Header */}
      <section className="py-16 md:py-24">
        <Container size="narrow">
          <H1 className="mb-6">Connect</H1>
          <Text variant="lead">
            Whether you have a question, want to collaborate, or just want to
            say hello—I&apos;d love to hear from you.
          </Text>
        </Container>
      </section>

      {/* Contact Form */}
      <section className="py-16 md:py-24 bg-[var(--color-bg-secondary)]">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl">
            <div>
              <SectionTitle>Send a Message</SectionTitle>
              <ContactForm />
            </div>

            <div>
              <SectionTitle>Other Ways to Connect</SectionTitle>

              <div className="space-y-6">
                <Card variant="elevated">
                  <CardContent>
                    <H3 className="mb-2">Email</H3>
                    <Text variant="muted">
                      For direct inquiries or longer conversations.
                    </Text>
                    <a
                      href="mailto:hello@jacklesser.me"
                      className="inline-block mt-3 text-[var(--color-accent-forge)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      hello@jacklesser.me
                    </a>
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardContent>
                    <H3 className="mb-2">Substack</H3>
                    <Text variant="muted">
                      Subscribe to receive essays on discipline, depth, and the
                      path toward integration.
                    </Text>
                    <a
                      href="https://satflow.substack.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-[var(--color-accent-forge)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      satflow.substack.com
                    </a>
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardContent>
                    <H3 className="mb-2">Social</H3>
                    <Text variant="muted">
                      Find me on social platforms for more frequent updates.
                    </Text>
                    <div className="flex gap-4 mt-3">
                      <a
                        href="https://twitter.com/jacklesser"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-accent-forge)] hover:text-[var(--color-text-primary)] transition-colors"
                      >
                        Twitter
                      </a>
                      <a
                        href="https://linkedin.com/in/jacklesser"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-accent-forge)] hover:text-[var(--color-text-primary)] transition-colors"
                      >
                        LinkedIn
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Substack CTA */}
      <section className="py-16 md:py-24">
        <Container size="narrow">
          <div className="text-center">
            <SectionTitle subtitle="Get essays on discipline, depth, and integrated living delivered to your inbox.">
              Stay Connected
            </SectionTitle>

            <Button
              href="https://satflow.substack.com/subscribe"
              variant="primary"
            >
              Subscribe on Substack
            </Button>

            <Text variant="small" className="mt-4">
              No spam. Unsubscribe anytime.
            </Text>
          </div>
        </Container>
      </section>
    </>
  );
}
