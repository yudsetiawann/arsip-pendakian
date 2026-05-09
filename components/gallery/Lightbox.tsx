"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { urlFor } from "@/lib/sanity-utils";

export default function Lightbox({
  images,
  mountainTitle,
}: {
  images: any[];
  mountainTitle: string;
}) {
  const [selectedImage, setSelectedImage] = useState<{
    image: any;
    index: number;
  } | null>(null);

  return (
    <>
      {/* ── MASONRY GRID CUSTOM ── */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {images.map((image, index) => (
          <motion.div
            key={index}
            layoutId={`img-card-${index}`}
            onClick={() => setSelectedImage({ image, index })}
            className="break-inside-avoid border border-[#c8b896] bg-[#e8e0d0]/30 p-3 pb-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-zoom-in group relative"
          >
            {/* Asset ID Label */}
            <div className="flex justify-between items-center mb-2 font-mono text-[7px] tracking-widest text-[#8b4513] uppercase">
              <span>Specimen_No. 0{index + 1}</span>
              <span>Visual_Record</span>
            </div>

            <div className="relative overflow-hidden bg-[#1a1510]/5 aspect-square md:aspect-auto">
              <Image
                src={urlFor(image).width(800).url()}
                alt={`${mountainTitle} record ${index + 1}`}
                width={800}
                height={1000}
                className="w-full h-auto grayscale contrast-[1.1] group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-700"
              />
            </div>

            {/* Footer Metadata pada Card */}
            <div className="mt-3 flex justify-between items-center border-t border-[#c8b896] pt-2">
              <p className="font-serif text-[10px] italic text-[#1a1510]/60">
                Part of {mountainTitle} Archive
              </p>
              <span className="font-mono text-[8px] text-[#c8b896]">
                → EXPAND
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── TECHNICAL OVERLAY (MODAL) ── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-100 flex items-center justify-center bg-[#1a1510]/90 backdrop-blur-sm p-4 md:p-10 cursor-zoom-out"
          >
            {/* UI HUD (Heads-Up Display) overlay */}
            <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between border-20 border-transparent">
              <div className="flex justify-between font-mono text-[9px] text-[#c8b896] uppercase tracking-[0.3em]">
                <span>Arsip_Visual_Indonesia // 2026</span>
                <span>
                  Frame_Pos: {selectedImage.index + 1}/{images.length}
                </span>
              </div>
              <div className="flex justify-between font-mono text-[9px] text-[#c8b896] uppercase tracking-[0.3em]">
                <span>{mountainTitle}_Visual_Asset</span>
                <span>CMD: EXIT_VIEW</span>
              </div>
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full border-12 border-[#f5f0e8] bg-[#f5f0e8] shadow-2xl overflow-hidden">
                <Image
                  src={urlFor(selectedImage.image).width(2000).url()}
                  alt="High resolution archive"
                  fill
                  className="object-contain"
                  priority
                />

                {/* Close Trigger (Mobile Friendly) */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-0 right-0 bg-[#1a1510] text-[#f5f0e8] font-mono text-[10px] px-4 py-2 hover:bg-[#8b4513] transition-colors uppercase tracking-widest"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
