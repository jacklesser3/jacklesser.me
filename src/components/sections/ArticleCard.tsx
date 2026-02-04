import Link from "next/link";
import { SubstackArticle } from "@/lib/substack";
import { formatDate, truncate } from "@/lib/utils";

interface ArticleCardProps {
  article: SubstackArticle;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="group">
      <Link href={article.link} target="_blank" rel="noopener noreferrer">
        <div className="py-6 border-b border-[var(--color-bg-secondary)] transition-colors group-hover:border-[var(--color-accent-forge)]">
          <time className="text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
            {article.pubDate ? formatDate(article.pubDate) : ""}
          </time>
          <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-medium mt-2 mb-3 text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-forge)] transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {truncate(article.contentSnippet, 150)}
          </p>
        </div>
      </Link>
    </article>
  );
}
