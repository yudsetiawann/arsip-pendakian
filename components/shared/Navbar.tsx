"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between p-6 mix-blend-difference text-zinc-100 uppercase font-mono text-[10px] tracking-[0.2em]">
      {/* Top Bar */}
      <div className="flex justify-between items-center pointer-events-auto w-full">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="text-amber-500"
          >
            <Compass size={14} />
          </motion.div>
          <span className="font-semibold group-hover:text-amber-400 transition-colors duration-300">
            Arsip_Pendakian // v2.0
          </span>
        </Link>
        <div className="text-right text-[8px] opacity-75 hidden sm:block">
          JKT // 106.8272° E, -6.1751° S
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-end pointer-events-auto w-full">
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="rotate-180 [writing-mode:vertical-lr] text-[8px] opacity-60 tracking-[0.3em] flex items-center gap-2"
        >
          <span className="animate-bounce">↓</span>
          <span>Gulir_Eksplorasi</span>
        </motion.div>

        {/* Menu Links */}
        <div className="flex gap-8 items-center bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10">
          <Link href="/" className="relative hover:text-amber-400 transition-colors duration-300 group py-1">
            Index
            <span className="absolute bottom-0 left-0 w-0 h-px bg-amber-400 transition-all duration-300 group-hover:w-full" />
          </Link>
          <span className="opacity-30">|</span>
          <a
            href="https://github.com/yudsetiawann"
            target="_blank"
            rel="noopener noreferrer"
            className="relative hover:text-amber-400 transition-colors duration-300 group py-1"
          >
            GitHub
            <span className="absolute bottom-0 left-0 w-0 h-px bg-amber-400 transition-all duration-300 group-hover:w-full" />
          </a>
        </div>
      </div>
    </nav>
  );
}
