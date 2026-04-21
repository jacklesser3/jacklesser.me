"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigation = [
  { name: "Freedom Technology", href: "/freedom-tech" },
  { name: "Freedom from Technology", href: "/freedom-from-tech" },
  { name: "Connect", href: "https://satflow.substack.com", external: true },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/8 bg-[rgba(7,7,9,0.84)] px-4 py-4 backdrop-blur sm:px-6 md:px-8">
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 sm:gap-6">
        <Link
          href="/"
          className="transition-colors hover:text-[var(--color-accent-ember)]"
        >
          <span className="font-[family-name:var(--font-cormorant)] text-2xl italic text-[var(--color-text-primary)] sm:text-[1.75rem] md:text-3xl">
            Jack Lesser
          </span>
        </Link>

        <ul className="hidden items-center gap-5 sm:gap-8 md:flex">
          {navigation.map((item) => {
            const isActive = !item.external && pathname === item.href;
            return (
              <li key={item.name}>
                {item.external ? (
                  <a
                    href={item.href}
                    className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)] sm:text-xs"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={`text-[0.7rem] uppercase tracking-[0.24em] transition-colors sm:text-xs ${
                      isActive
                        ? "font-medium text-[var(--color-text-primary)]"
                        : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] p-3 text-[var(--color-text-primary)] transition hover:border-white/20 hover:bg-white/[0.06] md:hidden"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            {isMenuOpen ? (
              <path
                d="M4.5 4.5l9 9m0-9l-9 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M3.5 5.25h11m-11 3.75h11m-11 3.75h11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>

        {isMenuOpen ? (
          <div
            id="mobile-navigation"
            className="absolute left-0 right-0 top-full mt-3 rounded-2xl border border-white/10 bg-[rgba(12,12,15,0.96)] p-3 shadow-[0_22px_80px_rgba(0,0,0,0.35)] backdrop-blur md:hidden"
          >
            <ul className="grid gap-2">
              {navigation.map((item) => {
                const isActive = !item.external && pathname === item.href;
                const classes = `block rounded-xl px-4 py-3 text-[0.72rem] uppercase tracking-[0.24em] transition-colors ${
                  isActive
                    ? "bg-white/[0.06] text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-muted)] hover:bg-white/[0.04] hover:text-[var(--color-text-primary)]"
                }`;

                return (
                  <li key={item.name}>
                    {item.external ? (
                      <a
                        href={item.href}
                        className={classes}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className={classes}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
