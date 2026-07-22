import { MetadataRoute } from "next";

export const dynamic = "force-static";

// Answer-engine / AI crawlers explicitly welcomed so the site is eligible for
// citation in AI answers (AEO). A bare `*` already permits them, but explicit
// groups signal intent and survive any future default-deny changes.
const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "Amazonbot",
  "meta-externalagent",
  "FacebookBot",
  "DuckAssistBot",
  "YouBot",
  "MistralAI-User",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: aiCrawlers,
        allow: "/",
      },
    ],
    sitemap: "https://jacklesser.me/sitemap.xml",
    host: "https://jacklesser.me",
  };
}
