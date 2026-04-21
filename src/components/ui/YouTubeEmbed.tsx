"use client";

import { useState } from "react";

export function YouTubeEmbed({
  videoId,
  className = "",
}: {
  videoId: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className={`group relative cursor-pointer overflow-hidden bg-black ${className}`}
      style={{ paddingBottom: "56.25%" }}
      onClick={() => setPlaying(true)}
    >
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&controls=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: "none" }}
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/10" />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(217,165,114,0.3)] bg-[rgba(9,9,12,0.7)] backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-[rgba(217,165,114,0.5)] group-hover:bg-[rgba(9,9,12,0.8)]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path d="M6.5 3.5L16 10L6.5 16.5V3.5Z" fill="#d9a572" />
              </svg>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
