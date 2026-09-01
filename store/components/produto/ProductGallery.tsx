"use client";

import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

export default function ProductGallery({
  images,
  alt,
}: ProductGalleryProps) {
  const validImages = images.filter(Boolean);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoom, setZoom] = useState(false);

  if (validImages.length === 0) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center">
        <span className="text-7xl font-black text-white/[0.035]">
          BL
        </span>
      </div>
    );
  }

  const selectedImage =
    validImages[selectedIndex] ?? validImages[0];

  return (
    <div className="w-full">
      <div
        className="group relative aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-[#111111]"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
      >
        <img
          src={selectedImage}
          alt={alt}
          className={`block h-full w-full object-cover transition-transform duration-500 ${
            zoom ? "scale-[1.08]" : "scale-100"
          }`}
        />

        <div className="pointer-events-none absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4 text-white"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
        </div>
      </div>

      {validImages.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {validImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Imagem ${index + 1}`}
              className={`h-[68px] w-[58px] overflow-hidden rounded-xl bg-[#0B0B0B] p-[2px] transition ${
                selectedIndex === index
                  ? "border-2 border-[#FFEA00]"
                  : "border border-white/[0.12] hover:border-white/40"
              }`}
            >
              <img
                src={image}
                alt=""
                className="h-full w-full rounded-[9px] object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}