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
      const progress = motion.matches ? 0 : Math.max(0, Math.min(1, -rect.top / Math.max(1, height - innerHeight)));
      const sway = Math.sin(progress * Math.PI * 2) * (mobile ? 3 : 12);
      const spacing = mobile ? 2.1 : 5;
      element.setAttribute("viewBox", `0 0 ${width} ${height}`);
      element.querySelectorAll<SVGPathElement>(".jp-ribbon-strand").forEach((path, i) => {
        const y = center + (i - 7) * (mobile ? 1.5 : 2.6);
        const edge = width - (mobile ? 5 : 14) - i * spacing;
        const bend = center + 210 + i * 5;
        // Independent, uneven paths across the canvas gradually resolve into
        // a shared horizontal tangent at the door. Deterministic on resize.
        const start = width * ((i * 7 % 15 + .5) / 15);
        const driftA = width * (.5 + .47 * Math.sin(i * 2.3));
        const driftB = width * (.5 + .46 * Math.cos(i * 1.7));
        const approachX = width * (.025 + (i % 5) * .065);
        const approachY = center - 110 - (i % 7) * 30;
        const loose = `M ${start} -50 C ${start + Math.sin(i) * width * .18} ${center * .12}, ${driftA + sway} ${center * .2}, ${driftA} ${center * .32} S ${driftB - sway} ${center * .54}, ${driftB} ${center * .65} C ${driftB} ${center * .79}, ${approachX} ${approachY - 140}, ${approachX} ${approachY} C ${approachX} ${y}, ${x * .7} ${y}, ${x} ${y}`;
        path.setAttribute("d", `${loose} L ${exit} ${y} C ${edge} ${y}, ${edge} ${bend - 120}, ${edge} ${bend} C ${edge} ${bend + 230}, ${edge - 24 + sway} ${height - 480}, ${edge - 12} ${height + 50}`);
      });
      element.querySelector(".jp-ribbon-frame")?.setAttribute("d", `M ${x - 32} ${center - 115} L ${x + 18} ${center - 80} L ${x + 18} ${center + 90} L ${x - 32} ${center + 125} Z M ${x + 18} ${center - 80} L ${exit + 24} ${center - 60} L ${exit + 24} ${center + 65}`);
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
    <path className="jp-ribbon-frame" stroke="#dfc17e" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>;
}
