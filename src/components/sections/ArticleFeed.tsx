import { getSubstackArticles } from "@/lib/substack";
import { ArticleCard } from "./ArticleCard";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

const SUBSTACK_BASE = "https://satflow.substack.com";

export async function ArticleFeed() {
  const articles = await getSubstackArticles(5);

  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionTitle subtitle="From my Substack — thoughts on discipline, depth, and the path toward integration.">
          Latest Writing
        </SectionTitle>

        {articles.length > 0 ? (
          <>
            <div className="max-w-2xl">
              {articles.map((article) => (
                <ArticleCard key={article.link} article={article} />
              ))}
            </div>
            <div className="mt-10">
              <Button href={SUBSTACK_BASE} variant="outline">
                Read More on Substack
              </Button>
            </div>
          </>
        ) : (
          <div className="max-w-2xl">
            <p className="text-[var(--color-text-muted)] mb-6">
              Latest essays and updates are on Substack.
            </p>
            <Button href={SUBSTACK_BASE} variant="outline">
              Read on Substack
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
