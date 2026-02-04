import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-12 px-6 md:px-8 mt-auto border-t border-[var(--color-bg-secondary)]">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="font-[family-name:var(--font-cormorant)] text-xl font-medium text-[var(--color-text-primary)]"
            >
              Jack Lesser
            </Link>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Where discipline meets depth.
            </p>
          </div>

          <nav className="flex gap-8">
            <Link
              href="/philosophy"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Philosophy
            </Link>
            <Link
              href="/practice"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Practice
            </Link>
            <Link
              href="/connect"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Connect
            </Link>
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-[var(--color-bg-secondary)]">
          <p className="text-xs text-[var(--color-text-secondary)]">
            &copy; {currentYear} Jack Lesser. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
