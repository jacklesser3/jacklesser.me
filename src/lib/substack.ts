import Parser from "rss-parser";

const parser = new Parser();

const getFeedUrl = () =>
  process.env.SUBSTACK_FEED_URL ?? "https://satflow.substack.com/feed";

export interface SubstackArticle {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
}

export async function getSubstackArticles(
  limit = 5
): Promise<SubstackArticle[]> {
  const feedUrl = getFeedUrl();
  try {
    const res = await fetch(feedUrl, {
      next: { revalidate: 3600 },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; jacklesser.me/1.0; +https://jacklesser.me)",
      },
    });
    if (!res.ok) {
      console.error("Substack feed fetch failed:", res.status, res.statusText);
      return [];
    }
    const xml = await res.text();
    const feed = await parser.parseString(xml);
    const items = feed.items ?? [];
    return items.slice(0, limit).map((item) => ({
      title: item.title ?? "Untitled",
      link: item.link ?? "",
      pubDate: item.pubDate ?? "",
      contentSnippet: item.contentSnippet ?? "",
    }));
  } catch (error) {
    console.error("Failed to fetch or parse Substack feed:", error);
    return [];
  }
}
