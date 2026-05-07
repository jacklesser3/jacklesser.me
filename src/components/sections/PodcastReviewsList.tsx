"use client";

import { useMemo, useState } from "react";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";

export interface PodcastReview {
  number: string;
  href: string;
  title: string;
  subtitle: string;
  summary: string;
  videoId?: string;
}

type SortKey = "recorded" | "newest" | "oldest" | "episode-desc" | "episode-asc";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "recorded", label: "Watch" },
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "episode-desc", label: "Episode # ↓" },
  { key: "episode-asc", label: "Episode # ↑" },
];

export function PodcastReviewsList({ reviews }: { reviews: PodcastReview[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("recorded");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let matches = q
      ? reviews.filter((r) =>
          [r.title, r.subtitle, r.summary, r.number]
            .join(" ")
            .toLowerCase()
            .includes(q),
        )
      : reviews.slice();

    if (sort === "recorded") {
      matches = matches.filter((r) => Boolean(r.videoId));
    }

    const byNumber = (r: PodcastReview) => parseInt(r.number, 10) || 0;

    switch (sort) {
      case "recorded":
      case "newest":
      case "episode-desc":
        return matches.sort((a, b) => byNumber(b) - byNumber(a));
      case "oldest":
      case "episode-asc":
        return matches.sort((a, b) => byNumber(a) - byNumber(b));
    }
  }, [reviews, query, sort]);

  return (
    <>
      <div className="mb-8 sm:mb-10">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.36em] text-[rgba(184,137,90,0.6)]">
          Browse Episodes
        </p>
        <div className="mt-4 rounded-xl border border-white/[0.08] bg-[rgba(9,9,12,0.55)] backdrop-blur-[12px] transition focus-within:border-white/[0.16]">
          <label className="flex items-center gap-3 px-5 py-4">
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              className="shrink-0 text-[var(--color-text-muted)]"
              aria-hidden="true"
            >
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M14 14l3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search episodes…"
              className="w-full bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none sm:text-base"
              aria-label="Search episodes"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {sortOptions.map((option) => {
            const active = sort === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setSort(option.key)}
                className={`rounded-full border px-4 py-1.5 text-xs tracking-wide transition sm:text-[0.8rem] ${
                  active
                    ? "border-white bg-white text-[#09090c]"
                    : "border-white/[0.1] bg-[rgba(9,9,12,0.55)] text-[var(--color-text-secondary)] hover:border-white/[0.2] hover:text-[var(--color-text-primary)]"
                }`}
                aria-pressed={active}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-5">
          {filtered.map((review, index) => (
            <a
              key={review.href}
              href={review.href}
              className="group animate-fade-in rounded-xl border border-white/[0.08] bg-[rgba(9,9,12,0.55)] p-5 backdrop-blur-[12px] transition duration-300 hover:border-white/[0.14] hover:bg-[rgba(9,9,12,0.65)] sm:p-6 md:p-8"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="grid gap-4 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-8">
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.36em] text-[var(--color-text-muted)]">
                  {review.number}
                </p>
                <div className="grid gap-5 md:grid-cols-[1fr_16rem] md:gap-6">
                  <div>
                    <p className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-[rgba(184,137,90,0.7)]">
                      {review.subtitle}
                    </p>
                    <h3 className="mt-3 font-[family-name:var(--font-cormorant)] text-2xl leading-tight text-[var(--color-text-primary)] sm:text-3xl md:text-4xl">
                      {review.title}
                    </h3>
                    <p className="mt-4 max-w-3xl text-[0.95rem] leading-7 text-[var(--color-text-secondary)] sm:mt-5 sm:text-base sm:leading-8">
                      {review.summary}
                    </p>
                  </div>
                  {review.videoId ? (
                    <YouTubeEmbed
                      videoId={review.videoId}
                      className="self-center rounded-lg border border-white/[0.08]"
                    />
                  ) : (
                    <div className="flex items-center justify-center self-center rounded-lg border border-white/[0.08] bg-[rgba(9,9,12,0.4)] aspect-video w-full">
                      <p className="font-[family-name:var(--font-cormorant)] text-sm italic text-[var(--color-text-muted)]">
                        Timeless reflection coming soon
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.08] bg-[rgba(9,9,12,0.55)] p-8 text-center backdrop-blur-[12px]">
          <p className="font-[family-name:var(--font-cormorant)] text-lg italic text-[var(--color-text-muted)]">
            No episodes match &ldquo;{query}&rdquo;.
          </p>
        </div>
      )}
    </>
  );
}
