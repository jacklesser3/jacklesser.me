"use client";

/* eslint-disable @next/next/no-img-element -- Local, pre-optimized portfolio assets. */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import photos from "./photos.json";
import photoDetails from "./photoDetails.json";
import videos from "./videos.json";
import "./portfolio.css";
import { ScrollFlow } from "./ScrollFlow";
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
  [photos.GFTS[4], photos.IF26[4], photos.GFTS[5], photos.IF26[5], photos["Selected additions"][2], photos.GFTS[6], photos.IF26[6], photos.GFTS[7], photos.IF26[9], photos.IF26[10], photos.GFTS[12], photos["Bitcoin Takeover 2026"][9]],
  [photos.GFTS[3], photos.GFTS[2], photos.GFTS[0], photos["Selected additions"][1], photos.IF26[1], photos["Peru 2026"][2], photos["Peru 2026"][0], photos.GFTS[9], photos.GFTS[14]],
  [photos["Bitcoin Takeover 2026"][0], photos["Bitcoin Takeover 2026"][2], photos["NEMS 2026"][0], photos["NEMS 2026"][3], photos.IF26[8], photos["Selected additions"][4], photos.GFTS[10], photos.GFTS[11], photos["Bitcoin Takeover 2026"][5], photos["Bitcoin Takeover 2026"][6], photos["Bitcoin Takeover 2026"][8]],
  [photos.IF26[7], photos["NEMS 2026"][1], photos["NEMS 2026"][2], photos["Selected additions"][0], photos["Bitcoin Takeover 2026"][1], photos["Bitcoin Takeover 2026"][3], photos.GFTS[13], photos["Selected additions"][3], photos["Bitcoin Takeover 2026"][4], photos["Bitcoin Takeover 2026"][7], photos["Bitcoin Takeover 2026"][10]],
];

const galleryPhotos = pools.flat();
type PhotoDetails = { name: string; event: string; date: string; bio: string; x?: string; linkedin?: string };
const detailFor = (src: string): PhotoDetails => (photoDetails as Record<string, PhotoDetails>)[src];

function PhotoMosaic() {
  const rotation = useRotation(3000);
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const detail = detailFor(galleryPhotos[selected].src);
  const touchStart = useRef<number | null>(null);
  const move = (delta: number) => setSelected(index => (index + delta + galleryPhotos.length) % galleryPhotos.length);
  useEffect(() => {
    if (!viewerOpen) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [viewerOpen]);
  function openPhoto(src: string) {
    setSelected(galleryPhotos.findIndex(photo => photo.src === src));
    setViewerOpen(true);
    rotation.setEngaged(true);
    dialog.current?.showModal();
  }
  function closePhoto() { dialog.current?.close(); }

  return <div ref={rotation.ref}>
    <div className="jp-mixed-gallery" aria-label="Selected photographs"
      onMouseEnter={() => rotation.setEngaged(true)} onMouseLeave={() => { if (!viewerOpen) rotation.setEngaged(false); }}
      onFocus={() => rotation.setEngaged(true)} onBlur={event => { if (!viewerOpen && !event.currentTarget.contains(event.relatedTarget)) rotation.setEngaged(false); }}>
      {pools.map((pool, slot) => {
        const active = Math.floor((rotation.step + 3 - slot) / 4) % pool.length;
        const info = detailFor(pool[active].src);
        return <figure key={slot}><button className="jp-photo-open" type="button" aria-label={`Open photo: ${info.name}`} onClick={() => openPhoto(pool[active].src)}>{pool.map((photo, index) => <img key={photo.src} src={photo.src} alt={detailFor(photo.src).name} loading="lazy" decoding="async" className={index === active ? "is-visible" : ""} aria-hidden={index !== active} />)}<span className="jp-photo-label"><strong>{info.name}</strong><span>{info.event} · {info.date}</span></span></button></figure>;
      })}
    </div>
    <dialog ref={dialog} className="jp-photo-dialog" aria-label="Photo viewer" onClose={() => { setViewerOpen(false); rotation.setEngaged(false); }}
      onClick={event => { if (event.target === event.currentTarget) closePhoto(); }}
      onKeyDown={event => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); }
      }}>
      {viewerOpen && <>
        <button type="button" className="jp-viewer-close" onClick={closePhoto} aria-label="Close photo viewer" autoFocus>✕</button>
        <div className="jp-viewer-image" onTouchStart={event => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={event => {
          if (touchStart.current !== null) { const delta = touchStart.current - event.changedTouches[0].clientX; if (Math.abs(delta) > 50) move(delta > 0 ? 1 : -1); }
          touchStart.current = null;
        }}><img src={galleryPhotos[selected].src} alt={detail.name} /></div>
        <div className="jp-viewer-caption" aria-live="polite"><strong>{detail.name}</strong><div>{detail.event} · {detail.date}</div><p>{detail.bio}</p><div className="jp-photo-socials">{detail.x && <a href={detail.x} target="_blank" rel="noopener noreferrer">X ↗</a>}{detail.linkedin && <a href={detail.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}</div></div>
        <div className="jp-viewer-controls"><button type="button" onClick={() => move(-1)} aria-label="Previous photo">←</button><span aria-live="polite">{selected + 1} / {galleryPhotos.length}</span><button type="button" onClick={() => move(1)} aria-label="Next photo">→</button></div>
      </>}
    </dialog>
    <div className="jp-gallery-bottom"><button type="button" className="jp-photo-pause" onClick={rotation.toggle} aria-label={rotation.paused ? "Play photo slideshow" : "Pause photo slideshow"}>{rotation.paused ? "Play slideshow" : "Pause slideshow"}</button><span>From the archive</span></div>
  </div>;
}

type Video = (typeof videos)["Bitcoin Park"][number];
function VideoCarousel({ channel, items }: { channel: string; items: Video[] }) {
  const rotation = useRotation(8000);
  const [playing, setPlaying] = useState<string | null>(null);
  const active = ((rotation.step % items.length) + items.length) % items.length;
  function move(delta: number) { setPlaying(null); rotation.setPaused(true); rotation.setStep(step => step + delta); }
  function play(id: string) { rotation.setPaused(true); setPlaying(id); }
  return <div ref={rotation.ref} role="region" aria-roledescription="carousel" aria-label={`${channel} selected videos`}
    onMouseEnter={() => rotation.setEngaged(true)} onMouseLeave={() => rotation.setEngaged(false)}
    onFocus={() => rotation.setEngaged(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) rotation.setEngaged(false); }}>
    <div className="jp-videos jp-carousel">
      {items.map((video, i) => <article key={video.id} className={`jp-video-card ${active === i ? "is-current" : ""}`} inert={active !== i} aria-hidden={active !== i}>
        <div className="jp-thumbnail">{playing === video.id && active === i
          ? <iframe src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&playsinline=1&rel=0`} title={`${video.title} — ${video.subtitle}`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
          : <button type="button" className="jp-video-play" aria-label={`Play ${video.title}`} onClick={() => play(video.id)}><img src={`/portfolio/videos/${video.id}.webp`} alt={`${video.title} — ${video.subtitle}`} loading="lazy" width="1280" height="720" /><span className="jp-play-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 4.5v15l12-7.5z" /></svg></span><span className="jp-duration">{video.duration}</span></button>}</div>
        <div className="jp-video-meta">{video.label}</div><h4>{video.title}</h4><p>{video.subtitle}</p><a className="jp-watch" href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a>
      </article>)}
    </div>
    <div className="jp-carousel-controls"><button type="button" onClick={() => move(-1)} aria-label={`Previous ${channel} video`}>←</button><span className="jp-carousel-count" aria-live={rotation.paused ? "polite" : "off"}>{String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span><button type="button" onClick={() => move(1)} aria-label={`Next ${channel} video`}>→</button><button type="button" className="jp-toggle" onClick={() => { setPlaying(null); rotation.toggle(); }} aria-label={`${rotation.paused ? "Play" : "Pause"} ${channel} slideshow`}>{rotation.paused ? "Play" : "Pause"}</button></div>
  </div>;
}

const pillars = [
  { name: "Aura", number: "A", subtitle: "Spaces & connection", text: "The feeling of being there. Physical community and connection, shaped by the details that make a space come alive.", tags: ["Environment · Music · Photography", "Food · Drink · Atmosphere · Aesthetic"], href: "#jp-photography", action: "Explore the photography ↗" },
  { name: "Soul", number: "B", subtitle: "Presence, ideas & collaboration", text: "Coming back to the body. Exploring what comes next. Workshops and programming around frontier ideas, freedom technology, and freedom from technology—creating space for presence, new perspectives, and collaboration.", tags: ["Frontier ideas · Freedom technology", "Presence · Workshops · Collaboration · Leadership"], href: "/freedom-from-tech", action: "Explore the practice ↗" },
  { name: "Time", number: "C", subtitle: "Digital creation", text: "Giving ideas a digital home. Design, interfaces, technology, and the ongoing practice of making things online.", tags: ["Design · Web UX/UI", "Production · Technology · Distribution"], href: "/timeless", action: "Explore Time ↗" },
];

export default function Portfolio() {
  return <div id="jack-portfolio">
    <ScrollFlow />
    <header className="jp-nav"><Link className="jp-brand" href="/">Jack Lesser.</Link><nav className="jp-links" aria-label="Portfolio"><a href="#jp-pillars">The practice</a><a href="#jp-photography">Photography</a><a href="#jp-channels">Media</a><Link href="/timeless">Timeless</Link><ConnectMenu /></nav></header>
    <section className="jp-intro" id="jp-top"><div><div className="jp-eyebrow">Jack Lesser / A creative practice</div><h1>Vibes<br /><span className="jp-title-second">Architecture.</span></h1></div><div className="jp-lead"><p>How we feel. What we create. How we come together.</p><p className="jp-lead-second">Frontier ideas, freedom technology, and human connection—with an eye for capturing it all.</p><a href="#jp-pillars">Explore the three pillars ↓</a></div></section>
    <div className="jp-cover"><img src={photos["Peru 2026"][1].src} alt="Warm light on snow-covered mountains in Peru" fetchPriority="high" width="1800" height="1200" /><div className="jp-cover-overlay"><div className="jp-cover-title">Create the feeling.<br />Capture the moment.<br />Share with the world.</div></div></div>
    <div className="jp-caption"><span>A portfolio of experiences, images, and things I’m building.</span><span>Jack Lesser / Selected work</span></div>
    <section className="jp-section" id="jp-pillars"><div className="jp-section-head"><div><div className="jp-eyebrow">One philosophy, three expressions</div><h2>It starts with how it feels.</h2></div></div><div className="jp-pillars">{pillars.map(pillar => <article key={pillar.name}><div className="jp-pillar-number">{pillar.number}</div><h3>{pillar.name}</h3><div className="jp-pillar-subtitle">{pillar.subtitle}</div><p>{pillar.text}</p><div className="jp-pillar-tags">{pillar.tags.map(tag => <div key={tag}>{tag}</div>)}</div><Link className="jp-pillar-link" href={pillar.href}>{pillar.action}</Link></article>)}</div></section>
    <section className="jp-section jp-capture" id="jp-photography"><div className="jp-section-head"><div><div className="jp-eyebrow">Capture / Selected photography</div><h2>Produced locally.</h2></div><span className="jp-gallery-context">People, places &amp; everything between.</span></div><PhotoMosaic /></section>
    <section className="jp-media" id="jp-channels"><div className="jp-media-intro"><div className="jp-flow-steps" aria-label="The process"><span>01 / Gather</span><span>02 / Curate</span><span>03 / Distribute</span></div><div className="jp-eyebrow">Media / Channel operations</div><div className="jp-media-top"><h2>Distributed globally.</h2><p>I operate the Bitcoin Park and Tangents YouTube channels. The ongoing work of sharing conversations, ideas, and the people behind them.</p></div></div>
      {(["Bitcoin Park", "Tangents"] as const).map(channel => <article className="jp-channel jp-channel-real" key={channel}><div className="jp-channel-heading"><div><div className="jp-role">Channel operations</div><h3>{channel}</h3></div><a className="jp-channel-link" href={channel === "Bitcoin Park" ? "https://www.youtube.com/@BitcoinPark/videos" : "https://www.youtube.com/@tangents_d/videos"} target="_blank" rel="noopener noreferrer">Explore the channel ↗</a></div><p className="jp-channel-description">{channel === "Bitcoin Park" ? "Conversations from Bitcoin Takeover, NEMS, Imagine IF, and the wider Bitcoin Park community." : "Following ideas across money, technology, and open systems."}</p><VideoCarousel channel={channel} items={videos[channel]} /></article>)}
    </section>
    <section className="jp-section jp-about"><div className="jp-eyebrow jp-about-label">The person behind the practice</div><div className="jp-about-portrait"><div className="jp-headshot"><img src="/portfolio/photos/jack-lesser-peru.jpg" alt="Jack Lesser in the mountains of Peru" width="2048" height="1365" loading="lazy" /></div></div><div><h2>Different forms.<br />The same attention.</h2><p>I’m Jack. Vibes Architecture is how I connect frontier ideas, technology, and community. I’m interested in both freedom technology and freedom from technology: tools that expand what we can do, and space to reconnect with our bodies, our attention, and each other. Sometimes that means making something. Sometimes it means bringing people together. Sometimes it means noticing a moment and capturing it.</p><Link href="/timeless">Explore Timeless: reflections, reviews &amp; The Shelf ↗</Link></div></section>
    <footer className="jp-footer" id="jp-contact"><div><div className="jp-eyebrow">Something in mind?</div><p>Let’s make it happen.</p></div><a href="mailto:jacklesser44@gmail.com">jacklesser44@gmail.com ↗</a><small>Jack Lesser</small></footer>
  </div>;
}
