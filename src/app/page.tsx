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
        <Container className="flex min-h-[calc(100vh-9rem)] items-center py-10 md:py-14">
          <div className="w-full overflow-hidden rounded-[2.75rem] border border-white/8 bg-[rgba(6,7,9,0.66)] shadow-[var(--shadow-medium)]">
            <div className="border-b border-white/8 px-6 py-6 md:px-10">
              <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[var(--color-text-muted)]">
                Three Pillars
              </p>
              <p className="mt-4 max-w-2xl font-[family-name:var(--font-cormorant)] text-3xl leading-tight text-[var(--color-text-primary)] md:text-4xl">
                Performance, leverage, and inner work are different expressions
                of the same project.
              </p>
            </div>

            <div className="grid divide-y divide-white/8 md:grid-cols-3 md:divide-x md:divide-y-0">
              {pillars.map((item, index) => (
                <div
                  key={item.label}
                  className="animate-fade-in relative bg-white/[0.02] p-6 transition duration-300 hover:bg-white/[0.04] md:min-h-[24rem] md:p-8"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.03] to-transparent" />
                  <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[var(--color-text-muted)]">
                    0{index + 1}
                  </p>
                  <p className="mt-12 font-[family-name:var(--font-cormorant)] text-4xl leading-[0.95] text-[var(--color-text-primary)] md:text-5xl">
                    {item.label}
                  </p>
                  <p className="mt-8 max-w-sm text-lg leading-8 text-[var(--color-text-secondary)]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="relative border-t border-white/8">
        <Container className="py-16 md:py-20">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[var(--color-text-muted)]">
                Latest Reviews
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl leading-none text-[var(--color-text-primary)] md:text-5xl">
                Summaries on the main page.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[var(--color-text-muted)]">
              A quick read before diving into the full review.
            </p>
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
                </div>
              </a>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
