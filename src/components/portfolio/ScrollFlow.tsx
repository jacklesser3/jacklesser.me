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
        const left = (mobile ? 3 : 8) + (14 - i) * (mobile ? 1.8 : Math.min(4, width * .0028));
        const approach = center - 240 + i * 5;
        path.setAttribute("d", `M ${left} -50 C ${left + sway * .4} ${center * .3}, ${left} ${approach - 180}, ${left} ${approach} C ${left} ${y}, ${x * .55} ${y}, ${x} ${y} L ${exit} ${y} C ${edge} ${y}, ${edge} ${bend - 120}, ${edge} ${bend} C ${edge} ${bend + 230}, ${edge - 24 + sway} ${height - 480}, ${edge - 12} ${height + 50}`);
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
