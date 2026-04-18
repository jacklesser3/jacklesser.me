import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-white/8 px-6 py-8 md:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link
          href="/"
          className="font-[family-name:var(--font-cormorant)] text-xl italic text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent-ember)]"
        >
          Jack Lesser
        </Link>
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
          &copy; {currentYear}
        </p>
      </div>
    </footer>
  );
}
