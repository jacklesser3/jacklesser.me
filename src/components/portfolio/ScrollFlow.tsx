"use client";

import { useEffect, useRef } from "react";

/** An ambient layer driven by native scroll; no idle animation loop. */
export function ScrollFlow() {
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const element = svg.current;
    if (!element) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const draw = () => {
      frame = 0;
      const root = document.getElementById("jack-portfolio");
      if (!root) return;
      const progress = motion.matches ? 0.4 : Math.max(0, Math.min(1, -root.getBoundingClientRect().top / Math.max(1, root.offsetHeight - innerHeight)));
      const gather = Math.sin(progress * Math.PI);
      element.querySelectorAll<SVGPathElement>("path").forEach((path, i) => {
        const side = i < 12 ? 1 : -1;
        const n = i % 12;
        const edge = side === 1 ? 0 : 1440;
        const spread = 28 + n * (17 - gather * 8);
        const shift = progress * 240;
        path.setAttribute("d", `M ${edge + side * (n * 20 - 180)} -100 C ${edge + side * (spread + 150)} ${200 + shift}, ${edge + side * (spread - 40)} ${430 - shift}, ${edge + side * spread} 900`);
      });
      root.style.setProperty("--flow-travel", `${(progress - 0.5) * 70}px`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    draw();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    const observer = new ResizeObserver(schedule);
    if (element.parentElement) observer.observe(element.parentElement);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
    };
  }, []);
  return <svg ref={svg} className="jp-scroll-flow" viewBox="0 0 1440 900" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
    {Array.from({ length: 24 }, (_, i) => <path key={i} stroke={i % 12 === 5 ? "#d5b76f" : "#83b5dc"} strokeWidth={i % 12 === 5 ? 1.3 : 0.8} />)}
  </svg>;
}
