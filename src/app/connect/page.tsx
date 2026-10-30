import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { socialLinks } from "@/components/layout/socialLinks";
import styles from "./connect.module.css";

export const metadata: Metadata = {
  title: { absolute: "Connect with Jack Lesser" },
  description: "Great to meet you. Find Jack Lesser on social, send a note, or save his contact details.",
  alternates: { canonical: "/connect" },
  openGraph: {
    title: "Connect with Jack Lesser",
    description: "All my links. One place. Let's stay in touch.",
    url: "/connect",
  },
};

const details: Record<string, string> = {
  Email: "jacklesser44@gmail.com",
  X: "@jacklesser_",
  Instagram: "@jacklesser_",
  LinkedIn: "Jack Lesser",
  Substack: "Timeless Practice",
  YouTube: "@timeless.practice",
  GitHub: "@jacklesser3",
};
const order = ["Email", "X", "Instagram", "LinkedIn", "Substack", "YouTube", "GitHub"];

export default function ConnectPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.profile}>
          <div className={styles.wordmark}><Link href="/" className={styles.backLink}>← Back to main site</Link><span className={styles.connectLabel}>/ CONNECT</span></div>
          <div className={styles.identity}><div className={styles.portrait}><Image src="/portfolio/photos/jack-lesser-peru.jpg" alt="Jack Lesser in Peru" width={96} height={96} priority /></div>
          <div className={styles.identityCopy}><p className={styles.eyebrow}>GREAT TO MEET YOU</p>
          <h1>Jack Lesser<span>.</span></h1>
          <p className={styles.intro}>Let’s stay in touch.</p></div></div>
          <a className={styles.save} href="/jack-lesser.vcf" download="Jack-Lesser.vcf"><span aria-hidden="true">＋</span> Save my contact</a>
        </header>
        <nav aria-label="Connect with Jack" className={styles.links}>
          {order.map(name => {
            const link = socialLinks.find(item => item.name === name)!;
            return (
              <a key={name} className={styles.link} href={link.href} target={name === "Email" ? undefined : "_blank"} rel={name === "Email" ? undefined : "noopener noreferrer"}>
                <span className={styles.icon}>{link.icon}</span>
                <span className={styles.label}><span>{link.name}</span><small>{details[name]}</small></span>
                <span className={styles.action}>{name === "Email" ? "Say hello →" : "View profile ↗"}</span>
              </a>
            );
          })}
        </nav>
        <footer className={styles.footer}><Link href="/">Explore my work <span aria-hidden="true">↗</span></Link><Link href="/" className={styles.monogram} aria-label="Jack Lesser — main site">JL</Link></footer>
      </div>
    </div>
  );
}
