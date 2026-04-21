import { Container } from "@/components/ui/Container";

export const revalidate = 3600; // Revalidate every hour for RSS feed

const podcastReviews = [
  {
    number: "01",
    href: "/naval-podcast.html",
    title: "Naval Ravikant x Joe Rogan",
    subtitle: "Wealth, Happiness & Leverage",
    summary:
      "A cleaner look at leverage, judgment, wealth creation, and how to think in a way that compounds over time.",
    gradient: "from-[#38bdf8] via-[#a78bfa] to-[#34d399]",
    videoId: "KxqsQ4xKlt8",
  },
  {
    number: "02",
    href: "/goggins-podcast.html",
    title: "David Goggins x Chris Williamson",
    subtitle: "Never Finished",
    summary:
      "A hard-edged review on identity, suffering, and the standard required to stop negotiating with yourself.",
    gradient: "from-[#dc2626] via-[#f97316] to-[#fbbf24]",
  },
  {
    number: "03",
    href: "/dr-k-podcast.html",
    title: "Dr. K x Andre Duqum",
    subtitle: "Eastern Wisdom & Neuroscience",
    summary:
      "A more reflective review on healing, attention, and the overlap between contemplative practice and modern psychology.",
    gradient: "from-[#f59e0b] via-[#8b5cf6] to-[#06b6d4]",
  },
];

const pillars = [
  {
    label: "Performance",
    text: "Discipline, standards, resilience, and the kind of effort that changes identity.",
  },
  {
    label: "Leverage",
    text: "Business, judgment, wealth, and clearer models for building a life with optionality.",
  },
  {
    label: "Inner Work",
    text: "Healing, spirituality, attention, and the practices that make ambition sustainable.",
  },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12rem] top-[-8rem] h-[32rem] w-[32rem] rounded-full bg-[rgba(217,165,114,0.1)] blur-[140px]" />
        <div className="absolute right-[-10rem] top-[16rem] h-[28rem] w-[28rem] rounded-full bg-[rgba(142,155,170,0.12)] blur-[140px]" />
      </div>

      <section className="relative">
        <Container className="flex min-h-[calc(100vh-9rem)] flex-col items-center justify-center py-10 md:py-14">
          <div className="w-full overflow-hidden rounded-[2.75rem] border border-white/8 bg-[rgba(6,7,9,0.66)] shadow-[var(--shadow-medium)]">
            <div className="px-6 py-12 md:px-10 md:py-16 text-center">
              <h1 className="font-[family-name:var(--font-cormorant)] text-7xl italic leading-none text-[var(--color-text-primary)] md:text-9xl tracking-tight">
                Timeless
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-sm leading-7 tracking-wide text-[var(--color-text-muted)] md:text-base md:leading-8">
                Ideas, thinkers, and technologies that hold up across time.
              </p>
            </div>

            <div className="grid divide-y divide-white/8 border-t border-white/8 md:grid-cols-3 md:divide-x md:divide-y-0">
              {pillars.map((item, index) => (
                <div
                  key={item.label}
                  className="animate-fade-in relative bg-white/[0.02] p-5 transition duration-300 hover:bg-white/[0.04] md:p-6"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <p className="text-[0.68rem] uppercase tracking-[0.34em] text-[var(--color-text-muted)]">
                    {item.label}
                  </p>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--color-text-secondary)]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <a
            href="#reviews"
            className="mt-8 flex flex-col items-center gap-2 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-secondary)]"
          >
            <span className="font-[family-name:var(--font-cormorant)] text-lg italic">
              explore
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="animate-bounce"
            >
              <path
                d="M8 3v10m0 0l-4-4m4 4l4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </Container>
      </section>

      <section id="reviews" className="relative border-t border-white/8">
        <Container className="py-16 md:py-20">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[var(--color-text-muted)]">
                Timeless
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl leading-none text-[var(--color-text-primary)] md:text-5xl">
                Discover to unlock ancient and present wisdom.
              </h2>
            </div>
          </div>

          <div className="grid gap-5">
            {podcastReviews.map((review, index) => (
              <a
                key={review.href}
                href={review.href}
                className="group animate-fade-in rounded-[2rem] border border-white/8 bg-[rgba(6,7,9,0.5)] p-6 transition duration-300 hover:border-white/15 hover:bg-white/[0.04] md:p-8"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className={`mb-6 h-px w-full bg-gradient-to-r ${review.gradient}`} />
                <div className="grid gap-4 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-8">
                  <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[var(--color-text-muted)]">
                    {review.number}
                  </p>
                  <div className={review.videoId ? "grid gap-6 md:grid-cols-[1fr_16rem]" : ""}>
                    <div>
                      <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[var(--color-accent-forge)]">
                        {review.subtitle}
                      </p>
                      <h3 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl leading-tight text-[var(--color-text-primary)] md:text-4xl">
                        {review.title}
                      </h3>
                      <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--color-text-secondary)]">
                        {review.summary}
                      </p>
                    </div>
                    {review.videoId && (
                      <div className="relative self-center overflow-hidden rounded-xl bg-black" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          className="absolute inset-0 h-full w-full"
                          src={`https://www.youtube-nocookie.com/embed/${review.videoId}?modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&controls=1`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ border: 'none' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
