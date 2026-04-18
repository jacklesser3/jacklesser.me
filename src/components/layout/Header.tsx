"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Freedom Technology", href: "/freedom-tech" },
  { name: "Freedom from Technology", href: "/freedom-from-tech" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/8 bg-[rgba(7,7,9,0.84)] px-6 py-5 backdrop-blur md:px-8">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6">
        <Link
          href="/"
          className="transition-colors hover:text-[var(--color-accent-ember)]"
        >
          <span className="font-[family-name:var(--font-cormorant)] text-2xl italic text-[var(--color-text-primary)] md:text-3xl">
            Jack Lesser
          </span>
        </Link>

        <ul className="flex items-center gap-5 sm:gap-8">
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
        </ul>
      </nav>
    </header>
  );
}
