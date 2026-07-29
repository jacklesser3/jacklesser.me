"use client";

import { useEffect, useRef, useState } from "react";
import { BOOKS } from "./booksData";
import { BOOK_MODEL_URLS } from "./registry";
import type { ShelfController, ShelfMode } from "./scene/experience";
import { ShelfUI, type HoverState, type LoadProgress } from "./ShelfUI";

export default function ShelfExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<ShelfController | null>(null);

  const [activeIndex, setActiveIndex] = useState(9);
  const [mode, setMode] = useState<ShelfMode>("browsing");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hover, setHover] = useState<HoverState | null>(null);
  const [progress, setProgress] = useState<LoadProgress>({ loaded: 0, failed: 0, total: 0 });
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let cancelled = false;
    let controller: ShelfController | null = null;
    let observer: ResizeObserver | null = null;

    // Three.js is imported lazily so it never runs during prerender.
    import("./scene/experience")
      .then(({ createShelfExperience }) => {
        if (cancelled) return;
        controller = createShelfExperience(canvas, BOOKS, BOOK_MODEL_URLS, {
          onActiveIndex: setActiveIndex,
          onMode: (nextMode, bookIndex) => {
            setMode(nextMode);
            setSelectedIndex(bookIndex);
            if (nextMode !== "browsing") setHover(null);
          },
          onHover: (book, clientX, clientY) => {
            setHover(book ? { title: book.title, x: clientX, y: clientY } : null);
          },
          onLoadProgress: (loaded, failed, total) => setProgress({ loaded, failed, total }),
        });
        controllerRef.current = controller;
        controller.setSize(container.clientWidth, container.clientHeight);

        observer = new ResizeObserver(() => {
          controller?.setSize(container.clientWidth, container.clientHeight);
        });
        observer.observe(container);
      })
      .catch(() => {
        if (!cancelled) setWebglFailed(true);
      });

    return () => {
      cancelled = true;
      observer?.disconnect();
      controller?.dispose();
      controllerRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-hidden bg-[#f5efe3] text-[#2a2118]"
    >
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
      <ShelfUI
        books={BOOKS}
        activeIndex={activeIndex}
        mode={mode}
        selectedIndex={selectedIndex}
        hover={hover}
        progress={progress}
        webglFailed={webglFailed}
        onStep={(direction) => controllerRef.current?.step(direction)}
        onMarker={(index) => controllerRef.current?.scrollToIndex(index)}
        onSelectActive={() => controllerRef.current?.select(activeIndex)}
        onClose={() => controllerRef.current?.deselect()}
      />
    </div>
  );
}
