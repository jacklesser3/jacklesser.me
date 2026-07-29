"use client";

import Link from "next/link";
import type { BookInfo } from "./booksData";
import type { ShelfMode } from "./scene/experience";

export interface HoverState {
  title: string;
  x: number;
  y: number;
}

export interface LoadProgress {
  loaded: number;
  failed: number;
  total: number;
}

interface ShelfUIProps {
  books: BookInfo[];
  activeIndex: number;
  mode: ShelfMode;
  selectedIndex: number | null;
  hover: HoverState | null;
  progress: LoadProgress;
  webglFailed: boolean;
  onStep(direction: -1 | 1): void;
  onMarker(index: number): void;
  onSelectActive(): void;
  onClose(): void;
}

const serif = { fontFamily: "var(--font-cormorant), Georgia, serif" };
// Inline color because the site's global h1–h6 rule (unlayered CSS) beats utility classes.
const serifInk = { ...serif, color: "#2a2118" };
const sans = { fontFamily: "var(--font-inter), system-ui, sans-serif" };

export function ShelfUI({
  books,
  activeIndex,
  mode,
  selectedIndex,
  hover,
  progress,
  webglFailed,
  onStep,
  onMarker,
  onSelectActive,
  onClose,
}: ShelfUIProps) {
  const selected = selectedIndex !== null ? books[selectedIndex] : null;
  const inspecting = mode === "inspecting";
  const browsing = mode === "browsing";
  const stillLoading = progress.total > 0 && progress.loaded + progress.failed < progress.total;

  if (webglFailed) {
    return (
      <div className="shelf-ui pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-4xl italic" style={serifInk}>
          The Shelf
        </h1>
        <p className="max-w-sm text-sm text-[#2a2118]/70" style={sans}>
          This library is drawn in WebGL, which your browser couldn&apos;t start. The
          volumes themselves live on the home page.
        </p>
        <Link href="/" className="text-sm underline underline-offset-4" style={sans}>
          Return to jacklesser.me
        </Link>
      </div>
    );
  }

  return (
    <div className="shelf-ui pointer-events-none absolute inset-0" style={sans}>
      {/* Masthead */}
      <header className="absolute inset-x-0 top-0 flex flex-col items-center gap-2 px-5 pt-4 sm:pt-7">
        <Link
          href="/"
          className="pointer-events-auto self-start text-xs tracking-wide sm:absolute sm:left-8 sm:top-7"
        >
          ← jacklesser.me
        </Link>
        <div className="pointer-events-none text-center">
          <h1 className="text-2xl italic leading-none sm:text-3xl" style={serifInk}>
            The Shelf
          </h1>
          <p className="mt-1.5 text-[10px] uppercase tracking-[0.28em] text-[#2a2118]/50">
            Timeless Practice · {books.length} Volumes
          </p>
        </div>
      </header>

      {/* Hover tooltip */}
      {hover && browsing && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-sm border border-[#2a2118]/10 bg-[#fbf7ee]/95 px-3 py-1.5 text-sm italic shadow-sm"
          style={{ ...serif, left: hover.x, top: hover.y - 44 }}
        >
          {hover.title}
        </div>
      )}

      {/* Bottom rail */}
      <footer className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-4 pb-5 sm:pb-7">
        {stillLoading && (
          <p className="text-[11px] tracking-wide text-[#2a2118]/45">
            Binding volumes · {progress.loaded + progress.failed} of {progress.total}
          </p>
        )}

        {selected && !browsing ? (
          <div
            className="pointer-events-auto w-full max-w-md rounded-md border border-[#2a2118]/10 bg-[#fbf7ee]/95 px-6 py-5 text-center shadow-[0_12px_40px_rgba(42,33,24,0.12)] backdrop-blur transition-opacity"
            role="dialog"
            aria-label={selected.title}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a6f4d]">
              {selected.kind} · Volume {String((selectedIndex ?? 0) + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-2 text-2xl italic leading-tight sm:text-[1.7rem]" style={serifInk}>
              {selected.title}
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-[#2a2118]/70">
              {selected.context}
            </p>
            <div className="mt-4 flex items-center justify-center gap-5">
              <a
                href={selected.href}
                target={selected.href.startsWith("http") ? "_blank" : undefined}
                rel={selected.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="shelf-read-link text-sm font-medium underline underline-offset-4"
              >
                {selected.kind === "Essay" ? "Read the essay" : "Open the episode"} →
              </a>
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer text-sm text-[#2a2118]/55 transition-colors hover:text-[#2a2118]"
              >
                Return to shelf
              </button>
            </div>
            {inspecting && (
              <p className="mt-3 text-[10px] tracking-wide text-[#2a2118]/35">
                Drag to orbit · Scroll to zoom · Two-finger drag to pan · Esc to return
              </p>
            )}
          </div>
        ) : (
          <div className="pointer-events-auto flex items-center gap-4 rounded-full border border-[#2a2118]/10 bg-[#fbf7ee]/90 px-4 py-2.5 shadow-sm backdrop-blur">
            <button
              type="button"
              onClick={() => onStep(-1)}
              aria-label="Previous volume"
              className="cursor-pointer px-1 text-lg leading-none text-[#2a2118]/60 transition-colors hover:text-[#2a2118]"
            >
              ‹
            </button>
            <div className="flex items-center gap-[7px]">
              {books.map((book, index) => (
                <button
                  key={book.id}
                  type="button"
                  aria-label={`Go to ${book.title}`}
                  onClick={() =>
                    index === activeIndex ? onSelectActive() : onMarker(index)
                  }
                  className={`cursor-pointer rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "h-[9px] w-[9px] bg-[#5a4030]"
                      : "h-[5px] w-[5px] bg-[#2a2118]/25 hover:bg-[#2a2118]/50"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => onStep(1)}
              aria-label="Next volume"
              className="cursor-pointer px-1 text-lg leading-none text-[#2a2118]/60 transition-colors hover:text-[#2a2118]"
            >
              ›
            </button>
          </div>
        )}

        {browsing && (
          <p className="text-[10px] tracking-wide text-[#2a2118]/35">
            Drag, scroll, or use arrow keys · Click a spine to pull it from the shelf
          </p>
        )}
      </footer>
    </div>
  );
}
