"use client";

/* eslint-disable @next/next/no-img-element -- Local, pre-optimized portfolio assets. */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import photos from "./photos.json";
import videos from "./videos.json";
import "./portfolio.css";
import { ConnectMenu } from "./ConnectMenu";

function useRotation(delay: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [engaged, setEngaged] = useState(false);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const element = ref.current;
    if (!element || paused || reduced || engaged) return;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.2 });
    observer.observe(element);
    const timer = window.setInterval(() => { if (visible && !document.hidden) setStep(s => s + 1); }, delay);
    return () => { observer.disconnect(); clearInterval(timer); };
  }, [delay, paused, reduced, engaged]);
  return { ref, step, setStep, paused: paused || reduced, toggle: () => { if (reduced) setReduced(false); setPaused(p => !reduced && !p); }, setPaused, setEngaged };
}

const pools = [
  [photos.GFTS[0], photos["Peru 2026"][3], photos.IF26[0]],
  [photos["Peru 2026"][0], photos["Peru 2026"][4], photos["Peru 2026"][5]],
  [photos["Bitcoin Takeover 2026"][0], photos["NEMS 2026"][1], photos["Bitcoin Takeover 2026"][2], photos["NEMS 2026"][0]],
  [photos.GFTS[1], photos["Peru 2026"][5], photos["Peru 2026"][0], photos["Peru 2026"][4]],
];

function PhotoMosaic() {
  const rotation = useRotation(3000);
  return <div ref={rotation.ref}>
    <div className="jp-mixed-gallery" aria-label="Selected photographs">
      {pools.map((pool, slot) => {
        const active = Math.floor((rotation.step + 3 - slot) / 4) % pool.length;
        return <figure key={slot}>{pool.map((photo, index) => <img key={photo.src} src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className={index === active ? "is-visible" : ""} aria-hidden={index !== active} />)}</figure>;
      })}
    </div>
    <div className="jp-gallery-bottom"><button type="button" className="jp-photo-pause" onClick={rotation.toggle} aria-label={rotation.paused ? "Play photo slideshow" : "Pause photo slideshow"}>{rotation.paused ? "Play slideshow" : "Pause slideshow"}</button><span>From the archive</span></div>
  </div>;
}

type Video = (typeof videos)["Bitcoin Park"][number];
function VideoCarousel({ channel, items }: { channel: string; items: Video[] }) {
  const rotation = useRotation(8000);
  const active = ((rotation.step % items.length) + items.length) % items.length;
  function move(delta: number) { rotation.setPaused(true); rotation.setStep(step => step + delta); }
  return <div ref={rotation.ref} role="region" aria-roledescription="carousel" aria-label={`${channel} selected videos`}
    onMouseEnter={() => rotation.setEngaged(true)} onMouseLeave={() => rotation.setEngaged(false)}
    onFocus={() => rotation.setEngaged(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) rotation.setEngaged(false); }}>
    <div className="jp-videos jp-carousel">
      {items.map((video, i) => <a key={video.id} className={`jp-video-card ${active === i ? "is-current" : ""}`} href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" inert={active !== i} aria-hidden={active !== i}>
        <div className="jp-thumbnail"><img src={`/portfolio/videos/${video.id}.webp`} alt={`${video.title} — ${video.subtitle}`} loading="lazy" width="1280" height="720" /><span className="jp-duration">{video.duration}</span></div>
        <div className="jp-video-meta">{video.label}</div><h4>{video.title}</h4><p>{video.subtitle}</p><span className="jp-watch">Watch conversation ↗</span>
      </a>)}
    </div>
    <div className="jp-carousel-controls"><button type="button" onClick={() => move(-1)} aria-label={`Previous ${channel} video`}>←</button><span className="jp-carousel-count" aria-live={rotation.paused ? "polite" : "off"}>{String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span><button type="button" onClick={() => move(1)} aria-label={`Next ${channel} video`}>→</button><button type="button" className="jp-toggle" onClick={rotation.toggle} aria-label={`${rotation.paused ? "Play" : "Pause"} ${channel} slideshow`}>{rotation.paused ? "Play" : "Pause"}</button></div>
  </div>;
}

const pillars = [
  { name: "Aura", number: "01 / CONNECT", subtitle: "Spaces & connection", text: "The feeling of being there. Physical community and connection, shaped by the details that make a space come alive.", tags: ["Setting · Music · Photography", "Food · Drink · Atmosphere"], href: "#jp-photography", action: "Explore the photography ↗" },
  { name: "Soul", number: "02 / FEEL", subtitle: "Movement & presence", text: "Coming back to the body. A full spectrum of wellness experiences, from movement and strength to breath and stillness.", tags: ["Yoga · Meditation · Running", "Lifting · Breathwork"], href: "/freedom-from-tech", action: "Explore the practice ↗" },
  { name: "Timeless", number: "03 / CREATE", subtitle: "Digital creation", text: "Giving ideas a digital home. Design, interfaces, technology, and the ongoing practice of making things online.", tags: ["Design · Web UX/UI", "Vibe coding · Technology"], href: "/timeless", action: "Explore Timeless ↗" },
];

export default function Portfolio() {
  return <div id="jack-portfolio">
    <header className="jp-nav"><Link className="jp-brand" href="/">Jack Lesser.</Link><nav className="jp-links" aria-label="Portfolio"><a href="#jp-pillars">The practice</a><a href="#jp-photography">Photography</a><a href="#jp-channels">Media</a><Link href="/timeless">Timeless</Link><ConnectMenu /></nav></header>
    <section className="jp-intro" id="jp-top"><div><div className="jp-eyebrow">Jack Lesser / A creative practice</div><h1>Vibes<br /><span className="jp-title-second">Architecture.</span></h1></div><div className="jp-lead"><p>How we feel. What we create. How we come together.</p><p className="jp-lead-second">Wellness, digital creation, and physical connection—with an eye for capturing it all.</p><a href="#jp-pillars">Explore the three pillars ↓</a></div></section>
    <div className="jp-cover"><img src={photos["Peru 2026"][1].src} alt="Warm light on snow-covered mountains in Peru" fetchPriority="high" width="1800" height="1200" /><div className="jp-cover-overlay"><div className="jp-cover-title">Create the feeling.<br />Capture the moment.</div><small>PERU / 2026</small></div></div>
    <div className="jp-caption"><span>A portfolio of experiences, images, and things I’m building.</span><span>Jack Lesser / Selected work</span></div>
    <section className="jp-section" id="jp-pillars"><div className="jp-section-head"><div><div className="jp-eyebrow">One philosophy, three expressions</div><h2>It starts with how it feels.</h2></div></div><div className="jp-pillars">{pillars.map(pillar => <article key={pillar.name}><div className="jp-pillar-number">{pillar.number}</div><h3>{pillar.name}</h3><div className="jp-pillar-subtitle">{pillar.subtitle}</div><p>{pillar.text}</p><div className="jp-pillar-tags">{pillar.tags.map(tag => <div key={tag}>{tag}</div>)}</div><Link className="jp-pillar-link" href={pillar.href}>{pillar.action}</Link></article>)}</div></section>
    <section className="jp-section jp-capture" id="jp-photography"><div className="jp-section-head"><div><div className="jp-eyebrow">Capture / Selected photography</div><h2>Produced locally.</h2></div><span className="jp-gallery-context">People, places &amp; everything between.</span></div><PhotoMosaic /></section>
    <section className="jp-media" id="jp-channels"><div className="jp-eyebrow">Media / Channel operations</div><div className="jp-media-top"><h2>Distributed globally.</h2><p>I operate the Bitcoin Park and Tangents YouTube channels. The ongoing work of sharing conversations, ideas, and the people behind them.</p></div>
      {(["Bitcoin Park", "Tangents"] as const).map(channel => <article className="jp-channel jp-channel-real" key={channel}><div className="jp-channel-heading"><div><div className="jp-role">Channel operations</div><h3>{channel}</h3></div><a className="jp-channel-link" href={channel === "Bitcoin Park" ? "https://www.youtube.com/@BitcoinPark/videos" : "https://www.youtube.com/@tangents_d/videos"} target="_blank" rel="noopener noreferrer">Explore the channel ↗</a></div><p className="jp-channel-description">{channel === "Bitcoin Park" ? "Conversations from Bitcoin Takeover, NEMS, Imagine IF, and the wider Bitcoin Park community." : "Following ideas across money, technology, and open systems."}</p><VideoCarousel channel={channel} items={videos[channel]} /></article>)}
    </section>
    <section className="jp-section jp-about"><div className="jp-eyebrow">The person behind the practice</div><div><h2>Different forms.<br />The same attention.</h2><p>I’m Jack. Vibes Architecture is how I connect my interests in wellness, digital creation, and community. Sometimes that means making something. Sometimes it means bringing people together. Sometimes it means noticing a moment and capturing it.</p><Link href="/timeless">Explore Timeless: reflections, reviews &amp; The Shelf ↗</Link></div></section>
    <footer className="jp-footer" id="jp-contact"><div><div className="jp-eyebrow">Something in mind?</div><p>Let’s make it happen.</p></div><a href="mailto:jacklesser44@gmail.com">jacklesser44@gmail.com ↗</a><small>Jack Lesser</small></footer>
  </div>;
}
