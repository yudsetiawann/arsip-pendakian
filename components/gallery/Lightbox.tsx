"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { urlFor } from "@/lib/sanity-utils";
import { ArrowLeft, ArrowRight, X, Download, ZoomIn } from "lucide-react";

export default function Lightbox({
  images,
  mountainTitle,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  images: any[];
  mountainTitle: string;
}) {
  const [selectedImage, setSelectedImage] = useState<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image: any;
    index: number;
  } | null>(null);

  // Navigate to previous image
  const handlePrev = useCallback(() => {
    if (!selectedImage) return;
    const newIndex = (selectedImage.index - 1 + images.length) % images.length;
    setSelectedImage({
      image: images[newIndex],
      index: newIndex,
    });
  }, [selectedImage, images]);

  // Navigate to next image
  const handleNext = useCallback(() => {
    if (!selectedImage) return;
    const newIndex = (selectedImage.index + 1) % images.length;
    setSelectedImage({
      image: images[newIndex],
      index: newIndex,
    });
  }, [selectedImage, images]);

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") handlePrev();
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") handleNext();
      if (e.key === "Escape") setSelectedImage(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, handlePrev, handleNext]);

  // Toggle class on document html for modal open state
  useEffect(() => {
    if (selectedImage) {
      document.documentElement.classList.add("lightbox-open");
    } else {
      document.documentElement.classList.remove("lightbox-open");
    }
    return () => {
      document.documentElement.classList.remove("lightbox-open");
    };
  }, [selectedImage]);

  return (
    <>
      {/* ── MASONRY GRID CUSTOM ── */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
        {images.map((image, index) => (
          <motion.div
            key={index}
            layoutId={`img-card-${index}`}
            onClick={() => setSelectedImage({ image, index })}
            className="break-inside-avoid border border-[#c8b896] bg-white/40 p-4 pb-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-zoom-in group relative rounded"
          >
            {/* Asset ID Label */}
            <div className="flex justify-between items-center mb-3 font-mono text-[7px] tracking-widest text-[#8b4513] uppercase">
              <span>Arsip_Foto. 0{index + 1}</span>
              <span>Spesimen Lapangan</span>
            </div>

            <div className="relative overflow-hidden bg-stone-100 rounded aspect-square md:aspect-auto">
              <Image
                src={urlFor(image).width(800).url()}
                alt={`${mountainTitle} record ${index + 1}`}
                width={800}
                height={1000}
                className="w-full h-auto grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-amber-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <div className="bg-white/95 text-stone-800 p-2 rounded-full shadow border border-amber-800/20">
                  <ZoomIn size={14} className="text-amber-800" />
                </div>
              </div>
            </div>

            {/* Footer Metadata pada Card */}
            <div className="mt-4 flex justify-between items-center border-t border-[#c8b896]/45 pt-3">
              <p className="font-serif text-[10px] italic text-[#1a1510]/60">
                Visual dari {mountainTitle}
              </p>
              <span className="font-mono text-[8px] text-stone-400 group-hover:text-amber-800 transition-colors">
                PERBESAR →
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── TECHNICAL OVERLAY (MODAL LIGHTBOX) ── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a1510]/95 backdrop-blur-md p-4 md:p-10"
            onClick={() => setSelectedImage(null)}
          >
            {/* Heads-Up Display (HUD) overlay */}
            <div className="absolute inset-x-6 top-6 pointer-events-none flex justify-between font-mono text-[8px] sm:text-[9px] text-[#c8b896] uppercase tracking-[0.25em] z-10">
              <span>Arsip_Visual // {mountainTitle}</span>
              <span>
                Index_Frame: {selectedImage.index + 1} / {images.length}
              </span>
            </div>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 z-20 text-white/60 hover:text-amber-400 p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all focus:outline-none"
              aria-label="Previous image"
            >
              <ArrowLeft size={20} />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 z-20 text-white/60 hover:text-amber-400 p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all focus:outline-none"
              aria-label="Next image"
            >
              <ArrowRight size={20} />
            </button>

            {/* Image Container with scaling animation */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl w-full h-[70vh] md:h-[80vh] flex items-center justify-center z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full border border-stone-800 bg-[#f5f0e8] p-2 md:p-3 shadow-2xl flex flex-col justify-between rounded">
                
                {/* Image Display */}
                <div className="relative w-full flex-1 overflow-hidden rounded bg-stone-900/5">
                  <Image
                    src={urlFor(selectedImage.image).width(1600).url()}
                    alt="High resolution archive"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Bottom Controls inside Card */}
                <div className="mt-3 flex justify-between items-center border-t border-stone-300 pt-2.5 font-mono text-[9px] text-stone-600">
                  <div>
                    <span>Spesimen_No: 0{selectedImage.index + 1}</span>
                  </div>
                  <div className="flex gap-4">
                    <a
                      href={urlFor(selectedImage.image).url()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-amber-800 transition-colors uppercase tracking-wider"
                    >
                      <Download size={10} /> Full-Res
                    </a>
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="flex items-center gap-1 hover:text-red-700 transition-colors uppercase tracking-wider font-semibold"
                    >
                      <X size={10} /> Tutup
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* HUD bottom footer */}
            <div className="absolute inset-x-6 bottom-6 pointer-events-none hidden md:flex justify-between font-mono text-[8px] sm:text-[9px] text-[#c8b896] uppercase tracking-[0.25em] z-10">
              <span>ESC: Tutup_Arsip</span>
              <span>A / D / Arah Panah: Navigasi</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
