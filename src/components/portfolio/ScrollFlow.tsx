"use client";

import { useEffect, useRef } from "react";

/** One continuous ribbon from the curation frame through the page footer. */
export function ScrollFlow() {
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const element = svg.current;
    const root = element?.parentElement;
    const intro = root?.querySelector<HTMLElement>(".jp-media-intro");
    if (!element || !root || !intro) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const draw = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const width = root.clientWidth;
      const height = root.offsetHeight;
      const top = intro.getBoundingClientRect().top - rect.top;
      const mobile = width <= 600;
      const center = top + (mobile ? 45 : 80);
      const x = width * 0.43;
      const exit = width * 0.58;
      const radius = mobile ? 65 : 112;
      const mid = (x + exit) / 2;
      const depth = mobile ? 19 : 32;
      const progress = motion.matches ? 0 : Math.max(0, Math.min(1, -rect.top / Math.max(1, height - innerHeight)));
      const sway = Math.sin(progress * Math.PI * 2) * (mobile ? 3 : 12);
      const spacing = mobile ? 2.1 : 5;
      element.setAttribute("viewBox", `0 0 ${width} ${height}`);
      element.querySelectorAll<SVGPathElement>(".jp-ribbon-strand").forEach((path, i) => {
        const y = center + (i - 7) * (mobile ? 1.5 : 2.6);
        const edge = width - (mobile ? 5 : 14) - i * spacing;
        const bend = center + 210 + i * 5;
        // Distribution expands into a wider, evenly spaced fan below the prism.
        const spread = width - (mobile ? 10 : 28);
        const destination = width - (mobile ? 5 : 14) - (i / 14) * spread;
        // Crossed, uneven approaches stay loose until inside the opaque prism.
        // The ordered output begins behind its face, hiding the transition.
        const start = width * ((i * 7 % 15 + .5) / 15);
        const driftA = width * (.5 + .47 * Math.sin(i * 2.3));
        const driftB = width * (.5 + .46 * Math.cos(i * 1.7));
        const approachX = width * (.025 + (i % 5) * .065);
        const approachY = center - 110 - (i % 7) * 30;
        const tangleX = mid - radius - width * (.04 + (i % 4) * .025);
        const tangleY = center + Math.sin(i * 2.4) * radius * 1.25;
        const entryY = center + Math.sin(i * 1.9) * radius * .28;
        const loose = `M ${start} -50 C ${start + Math.sin(i) * width * .18} ${center * .12}, ${driftA + sway} ${center * .2}, ${driftA} ${center * .32} S ${driftB - sway} ${center * .54}, ${driftB} ${center * .65} C ${driftB} ${center * .79}, ${approachX} ${approachY - 140}, ${approachX} ${approachY} C ${approachX + width * .12} ${center + Math.cos(i * 1.7) * radius * 2}, ${tangleX - width * .08} ${tangleY}, ${tangleX} ${tangleY} C ${mid - radius * .6} ${center - Math.sin(i * 2.4) * radius}, ${mid - radius * .25} ${entryY}, ${mid} ${entryY} L ${mid + radius * .18} ${y}`;
        path.setAttribute("d", `${loose} L ${exit} ${y} C ${edge} ${y}, ${edge} ${bend - 120}, ${edge} ${bend} C ${edge} ${bend + 230}, ${destination + sway} ${height - 480}, ${destination} ${height + 50}`);
      });
      element.querySelectorAll<SVGTextElement>(".jp-prism-point").forEach((label, i) => {
        label.setAttribute("x", String(i === 0 ? mid : i === 1 ? mid-radius : mid+radius));
        label.setAttribute("y", String(i === 0 ? center-radius-depth-12 : center+radius*.7+22));
      });
      const apex = `${mid},${center-radius}`;
      const left = `${mid-radius},${center+radius*.7}`;
      const right = `${mid+radius},${center+radius*.7}`;
      const rearApex = `${mid+depth},${center-radius-depth}`;
      const rearRight = `${mid+radius+depth},${center+radius*.7-depth}`;
      element.querySelector(".jp-prism-side")?.setAttribute("points", `${apex} ${rearApex} ${rearRight} ${right}`);
      element.querySelector(".jp-prism-face")?.setAttribute("points", `${apex} ${left} ${right}`);

    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    draw();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
    };
  }, []);
  return <svg ref={svg} className="jp-scroll-flow" fill="none" aria-hidden="true" focusable="false" preserveAspectRatio="none">
    {Array.from({ length: 15 }, (_, i) => <path className="jp-ribbon-strand" key={i} stroke="#83b5dc" strokeWidth="1" />)}
    <polygon className="jp-prism-side" fill="#263b51" fillOpacity=".98" stroke="#b89c63" strokeWidth="1.2" strokeLinejoin="round" />
    <polygon className="jp-prism-face" fill="#101e31" fillOpacity=".98" stroke="#dfc17e" strokeOpacity=".8" strokeWidth="1.2" strokeLinejoin="round" />
    {["Aura", "Soul", "Time"].map(name => <text key={name} className="jp-prism-point" fill="#dfc17e" textAnchor="middle" fontSize="10" letterSpacing="2">{name.toUpperCase()}</text>)}
  </svg>;
}
