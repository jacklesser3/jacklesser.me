import { Container } from "@/components/ui/Container";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";

export const revalidate = 3600; // Revalidate every hour for RSS feed

const podcastReviews = [
  {
    number: "01",
    href: "/naval-podcast.html",
    title: "Naval Ravikant x Joe Rogan",
    subtitle: "Wealth, Happiness & Leverage",
    summary:
      "A cleaner look at leverage, judgment, wealth creation, and how to think in a way that compounds over time.",
    videoId: "KxqsQ4xKlt8",
  },
  {
    number: "02",
    href: "/dr-k-podcast.html",
    title: "Dr. K x Andre Duqum",
    subtitle: "Eastern Wisdom & Neuroscience",
    summary:
      "A more reflective review on healing, attention, and the overlap between contemplative practice and modern psychology.",
  },
  {
    number: "03",
    href: "/goggins-podcast.html",
    title: "David Goggins x Chris Williamson",
    subtitle: "Never Finished",
    summary:
      "A hard-edged review on identity, suffering, and the standard required to stop negotiating with yourself.",
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
      {/* ── Full-bleed terrain background ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Ambient glow — warm summit + cool glacier */}
        <div className="absolute left-1/2 top-[8%] -translate-x-1/2 h-[30rem] w-[50rem] rounded-full bg-[rgba(184,137,90,0.07)] blur-[160px]" />
        <div className="absolute right-[-8rem] top-[30%] h-[24rem] w-[24rem] rounded-full bg-[rgba(58,107,138,0.06)] blur-[140px]" />

        {/* Topographic aerial SVG — contour lines seen from above */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="peakFill" cx="50%" cy="45%" r="35%">
              <stop offset="0%" stopColor="rgb(184,137,90)" stopOpacity="0.08" />
              <stop offset="60%" stopColor="rgb(184,137,90)" stopOpacity="0.03" />
              <stop offset="100%" stopColor="rgb(184,137,90)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="peak2Fill" cx="50%" cy="50%" r="40%">
              <stop offset="0%" stopColor="rgb(58,107,138)" stopOpacity="0.06" />
              <stop offset="60%" stopColor="rgb(58,107,138)" stopOpacity="0.02" />
              <stop offset="100%" stopColor="rgb(58,107,138)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Central peak — elevation fill */}
          <ellipse cx="800" cy="400" rx="500" ry="320" fill="url(#peakFill)" />

          {/* Central peak contours — outermost to summit */}
          <path d="M280,520 C320,440 420,360 520,320 C620,280 700,260 800,250 C900,260 980,280 1080,320 C1180,360 1280,440 1320,520 C1280,600 1180,660 1080,700 C980,730 900,740 800,740 C700,740 620,730 520,700 C420,660 320,600 280,520 Z" fill="none" stroke="rgba(184,137,90,0.04)" strokeWidth="0.8" />
          <path d="M360,500 C390,435 470,370 560,340 C650,310 720,295 800,288 C880,295 950,310 1040,340 C1130,370 1210,435 1240,500 C1210,565 1130,620 1040,650 C950,675 880,685 800,688 C720,685 650,675 560,650 C470,620 390,565 360,500 Z" fill="none" stroke="rgba(184,137,90,0.055)" strokeWidth="0.8" />
          <path d="M440,480 C465,430 520,385 600,360 C670,340 740,330 800,326 C860,330 930,340 1000,360 C1080,385 1135,430 1160,480 C1135,530 1080,572 1000,595 C930,615 860,622 800,625 C740,622 670,615 600,595 C520,572 465,530 440,480 Z" fill="none" stroke="rgba(184,137,90,0.07)" strokeWidth="0.9" />
          <path d="M520,465 C540,428 580,400 640,382 C690,368 748,360 800,358 C852,360 910,368 960,382 C1020,400 1060,428 1080,465 C1060,502 1020,528 960,545 C910,558 852,565 800,567 C748,565 690,558 640,545 C580,528 540,502 520,465 Z" fill="none" stroke="rgba(184,137,90,0.085)" strokeWidth="1" />
          <path d="M600,452 C615,430 645,415 690,405 C730,397 766,393 800,392 C834,393 870,397 910,405 C955,415 985,430 1000,452 C985,474 955,490 910,500 C870,508 834,512 800,513 C766,512 730,508 690,500 C645,490 615,474 600,452 Z" fill="none" stroke="rgba(184,137,90,0.1)" strokeWidth="1" />
          {/* Summit */}
          <ellipse cx="800" cy="448" rx="80" ry="35" fill="none" stroke="rgba(184,137,90,0.12)" strokeWidth="1.2" />

          {/* Secondary peak — upper left */}
          <ellipse cx="320" cy="280" rx="220" ry="150" fill="url(#peak2Fill)" />
          <path d="M160,310 C180,260 230,220 290,200 C330,188 360,184 390,190 C430,200 470,230 490,270 C470,310 430,340 390,355 C350,365 320,368 290,360 C230,345 180,330 160,310 Z" fill="none" stroke="rgba(58,107,138,0.05)" strokeWidth="0.7" />
          <path d="M210,295 C225,262 260,240 300,228 C328,220 350,218 375,222 C405,232 430,252 445,278 C430,304 405,322 375,332 C348,340 325,342 300,338 C260,328 225,312 210,295 Z" fill="none" stroke="rgba(58,107,138,0.065)" strokeWidth="0.8" />
          <path d="M255,285 C265,268 285,255 310,248 C328,243 342,242 358,245 C378,252 395,265 402,282 C395,298 378,310 358,316 C342,320 328,321 310,318 C285,312 265,300 255,285 Z" fill="none" stroke="rgba(58,107,138,0.08)" strokeWidth="0.8" />
          <ellipse cx="328" cy="280" rx="35" ry="20" fill="none" stroke="rgba(58,107,138,0.1)" strokeWidth="0.9" />

          {/* Secondary peak — right side */}
          <path d="M1180,350 C1210,300 1260,265 1320,250 C1360,240 1390,240 1420,248 C1460,262 1490,290 1505,325 C1490,360 1460,385 1420,398 C1390,408 1360,410 1320,405 C1260,392 1210,375 1180,350 Z" fill="none" stroke="rgba(160,148,130,0.04)" strokeWidth="0.7" />
          <path d="M1225,340 C1245,305 1280,280 1325,268 C1355,260 1378,260 1400,265 C1430,275 1452,298 1462,325 C1452,352 1430,372 1400,382 C1378,390 1355,392 1325,388 C1280,378 1245,360 1225,340 Z" fill="none" stroke="rgba(160,148,130,0.055)" strokeWidth="0.8" />
          <path d="M1270,332 C1282,310 1305,295 1335,286 C1355,280 1372,280 1390,284 C1410,292 1425,308 1432,328 C1425,348 1410,360 1390,368 C1372,374 1355,375 1335,372 C1305,365 1282,352 1270,332 Z" fill="none" stroke="rgba(160,148,130,0.07)" strokeWidth="0.8" />
          <ellipse cx="1350" cy="328" rx="40" ry="22" fill="none" stroke="rgba(160,148,130,0.09)" strokeWidth="0.9" />

          {/* Ridge connecting peaks — saddle contours */}
          <path d="M480,380 C540,350 620,330 700,320 C740,316 760,315 780,316" fill="none" stroke="rgba(184,137,90,0.03)" strokeWidth="0.6" />
          <path d="M1100,390 C1060,370 1000,350 940,340 C900,335 870,332 840,333" fill="none" stroke="rgba(160,148,130,0.03)" strokeWidth="0.6" />

          {/* Lower foothills — bottom area */}
          <path d="M100,680 C160,650 240,630 340,620 C440,615 520,625 600,640 C660,650 700,660 740,665" fill="none" stroke="rgba(58,107,138,0.03)" strokeWidth="0.6" />
          <path d="M860,665 C920,660 980,650 1060,640 C1160,625 1240,615 1340,620 C1440,630 1520,650 1580,680" fill="none" stroke="rgba(58,107,138,0.03)" strokeWidth="0.6" />
          <path d="M50,750 C140,720 260,700 400,695 C520,692 620,700 720,715" fill="none" stroke="rgba(160,148,130,0.025)" strokeWidth="0.5" />
          <path d="M880,715 C980,700 1080,692 1200,695 C1340,700 1460,720 1550,750" fill="none" stroke="rgba(160,148,130,0.025)" strokeWidth="0.5" />

          {/* Spot heights */}
          <text x="788" y="440" fill="rgba(184,137,90,0.14)" fontSize="9" fontFamily="Georgia, serif" letterSpacing="0.05em">8848</text>
          <text x="316" y="272" fill="rgba(58,107,138,0.12)" fontSize="8" fontFamily="Georgia, serif" letterSpacing="0.05em">7205</text>
          <text x="1338" y="320" fill="rgba(160,148,130,0.11)" fontSize="8" fontFamily="Georgia, serif" letterSpacing="0.05em">6450</text>
        </svg>

        {/* Vignette overlay */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(9,9,12,0.6) 100%)',
        }} />
      </div>

      {/* ── Hero section ── */}
      <section className="relative z-10">
        <Container className="flex min-h-[calc(100vh-9rem)] flex-col items-center justify-center py-10 md:py-14">
          <div className="relative w-full flex flex-col items-center">
            {/* Peak — Timeless */}
            <div className="relative z-10 px-6 pb-10 pt-6 text-center md:pb-12 md:pt-8">
              <h1 className="font-[family-name:var(--font-cormorant)] text-7xl italic leading-none text-[var(--color-text-primary)] md:text-9xl tracking-tight drop-shadow-[0_0_60px_rgba(255,255,255,0.06)]">
                Timeless
              </h1>
              <p className="mx-auto mt-5 whitespace-nowrap text-sm tracking-wide text-[var(--color-text-muted)] md:text-base">
                Ideas, thinkers, and technologies that hold up across time.
              </p>
            </div>

            {/* Base — three pillars as frosted glass panels */}
            <div className="relative z-10 grid w-full max-w-4xl gap-4 md:grid-cols-3">
              {pillars.map((item, index) => (
                <div
                  key={item.label}
                  className="animate-fade-in rounded-xl border border-white/[0.08] bg-[rgba(9,9,12,0.55)] p-6 backdrop-blur-[12px] transition duration-300 hover:border-white/[0.14] hover:bg-[rgba(9,9,12,0.65)]"
                  style={{ animationDelay: `${(index + 1) * 120}ms` }}
                >
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.36em] text-[rgba(184,137,90,0.6)]">
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
            className="mt-10 flex flex-col items-center gap-2 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-secondary)]"
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

      {/* ── Reviews section ── */}
      <section id="reviews" className="relative z-10 border-t border-white/[0.06]">
        <Container className="py-16 md:py-20">
          <div className="mb-10">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.36em] text-[rgba(184,137,90,0.6)]">
              Timeless
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl leading-none text-[var(--color-text-primary)] md:text-5xl">
              Discover to unlock ancient and present wisdom.
            </h2>
          </div>

          <div className="grid gap-5">
            {podcastReviews.map((review, index) => (
              <a
                key={review.href}
                href={review.href}
                className="group animate-fade-in rounded-xl border border-white/[0.08] bg-[rgba(9,9,12,0.55)] p-6 backdrop-blur-[12px] transition duration-300 hover:border-white/[0.14] hover:bg-[rgba(9,9,12,0.65)] md:p-8"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="grid gap-4 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-8">
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.36em] text-[var(--color-text-muted)]">
                    {review.number}
                  </p>
                  <div className={review.videoId ? "grid gap-6 md:grid-cols-[1fr_16rem]" : ""}>
                    <div>
                      <p className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-[rgba(184,137,90,0.7)]">
                        {review.subtitle}
                      </p>
                      <h3 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl leading-tight text-[var(--color-text-primary)] md:text-4xl">
                        {review.title}
                      </h3>
                      <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--color-text-secondary)]">
                        {review.summary}
                      </p>
                    </div>
                    {review.videoId && (
                      <YouTubeEmbed
                        videoId={review.videoId}
                        className="self-center rounded-lg border border-white/[0.08]"
                      />
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
