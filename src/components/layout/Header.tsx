"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navigation = [
  { name: "Freedom Technology", href: "/freedom-tech" },
  { name: "Freedom from Technology", href: "/freedom-from-tech" },
];

const socialLinks = [
  {
    name: "Substack",
    href: "https://satflow.substack.com",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/jacklesser_",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/jacklesser_/",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@timeless.practice",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 18" fill="currentColor" aria-hidden="true">
        <path d="M23.498 2.186a3.016 3.016 0 0 0-2.122-2.136C19.505 0 12 0 12 0S4.495 0 2.623.05A3.016 3.016 0 0 0 .502 2.186C0 4.075 0 9 0 9s0 4.926.502 6.814a3.016 3.016 0 0 0 2.122 2.136C4.495 18 12 18 12 18s7.505 0 9.377-.05a3.016 3.016 0 0 0 2.122-2.136C24 13.926 24 9 24 9s0-4.926-.502-6.814zM9.545 12.818V5.182L15.818 9l-6.273 3.818z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/jacklesser/",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/jacklesser3",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const connectRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsConnectOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isConnectOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (connectRef.current && !connectRef.current.contains(event.target as Node)) {
        setIsConnectOpen(false);
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setIsConnectOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isConnectOpen]);

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
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
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
              </li>
            );
          })}

          <li ref={connectRef} className="relative">
            <button
              type="button"
              onClick={() => setIsConnectOpen((open) => !open)}
              aria-expanded={isConnectOpen}
              aria-haspopup="menu"
              className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent-ember)] sm:text-xs"
            >
              Connect
            </button>

            {isConnectOpen ? (
              <div
                role="menu"
                className="absolute right-0 top-full mt-3 min-w-[10rem] rounded-xl border border-white/10 bg-[rgba(12,12,15,0.96)] p-1.5 shadow-[0_22px_80px_rgba(0,0,0,0.35)] backdrop-blur"
              >
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="menuitem"
                    onClick={() => setIsConnectOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs tracking-wide text-[var(--color-text-muted)] transition-colors hover:bg-white/[0.04] hover:text-[var(--color-text-primary)]"
                  >
                    <span className="text-[var(--color-text-muted)]">{link.icon}</span>
                    <span>{link.name}</span>
                  </a>
                ))}
              </div>
            ) : null}
          </li>
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
                const isActive = pathname === item.href;
                const classes = `block rounded-xl px-4 py-3 text-[0.72rem] uppercase tracking-[0.24em] transition-colors ${
                  isActive
                    ? "bg-white/[0.06] text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-muted)] hover:bg-white/[0.04] hover:text-[var(--color-text-primary)]"
                }`;

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={classes}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-2 border-t border-white/10 pt-2">
              <p className="px-4 pb-1 pt-2 text-[0.6rem] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
                Connect
              </p>
              <ul className="grid gap-1">
                {socialLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-xs text-[var(--color-text-muted)] transition-colors hover:bg-white/[0.04] hover:text-[var(--color-text-primary)]"
                    >
                      <span>{link.icon}</span>
                      <span>{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
