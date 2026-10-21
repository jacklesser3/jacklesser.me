"use client";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const isPortfolio = usePathname() === "/";
  return <>{!isPortfolio && <Header />}<main className="flex-1">{children}</main>{!isPortfolio && <Footer />}</>;
}
