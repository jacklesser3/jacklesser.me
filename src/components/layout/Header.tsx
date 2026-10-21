"use client";

import Link from "next/link";
import { socialLinks } from "./socialLinks";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navigation = [
  { name: "Timeless", href: "/timeless" },
  { name: "The Shelf", href: "/shelf" },
  { name: "Freedom Technology", href: "/freedom-tech" },
  { name: "Freedom from Technology", href: "/freedom-from-tech" },
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

        <ul className="hidden items-center gap-5 sm:gap-8 lg:flex">
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
                    target={link.href.startsWith("mailto:") ? undefined : "_blank"}
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
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] p-3 text-[var(--color-text-primary)] transition hover:border-white/20 hover:bg-white/[0.06] lg:hidden"
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
            className="absolute left-0 right-0 top-full mt-3 rounded-2xl border border-white/10 bg-[rgba(12,12,15,0.96)] p-3 shadow-[0_22px_80px_rgba(0,0,0,0.35)] backdrop-blur lg:hidden"
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
                      target={link.href.startsWith("mailto:") ? undefined : "_blank"}
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
