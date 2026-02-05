"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Freedom Tech", href: "/freedom-tech" },
  { name: "Freedom from Tech", href: "/freedom-from-tech" },
  { name: "Philosophy", href: "/philosophy" },
  { name: "Practice", href: "/practice" },
  { name: "Connect", href: "/connect" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full py-6 px-6 md:px-8">
      <nav className="max-w-5xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="font-[family-name:var(--font-cormorant)] text-2xl font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent-forge)] transition-colors"
        >
          Jack Lesser
        </Link>

        <ul className="flex items-center gap-8">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`text-sm tracking-wide transition-colors ${
                    isActive
                      ? "text-[var(--color-text-primary)] font-medium"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
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
