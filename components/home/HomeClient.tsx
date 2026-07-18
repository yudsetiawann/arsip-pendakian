"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, ArrowUpDown, Compass } from "lucide-react";
import { urlFor, type GunungData } from "@/lib/sanity-utils";

export default function HomeClient({ initialGunung }: { initialGunung: GunungData[] }) {
  const [search, setSearch] = useState("");
  const [selectedProvinsi, setSelectedProvinsi] = useState("Semua");
  const [sortBy, setSortBy] = useState<"elevasi-desc" | "elevasi-asc" | "tanggal-desc" | "title-asc">("tanggal-desc");
  const [hoveredMtnId, setHoveredMtnId] = useState<string | null>(null);

  // Mouse coordinate tracker for topographic interactive background
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Get all unique provinces
  const provinsiList = useMemo(() => {
    const provs = initialGunung.map((g) => g.provinsi).filter((p): p is string => !!p);
    return ["Semua", ...Array.from(new Set(provs))];
  }, [initialGunung]);

  // Filter & sort data
  const filteredGunung = useMemo(() => {
    return initialGunung
      .filter((g) => {
        const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase()) || 
          (g.jalur && g.jalur.toLowerCase().includes(search.toLowerCase()));
        const matchesProvinsi = selectedProvinsi === "Semua" || g.provinsi === selectedProvinsi;
        return matchesSearch && matchesProvinsi;
      })
      .sort((a, b) => {
        if (sortBy === "elevasi-desc") return (b.elevasi || 0) - (a.elevasi || 0);
        if (sortBy === "elevasi-asc") return (a.elevasi || 0) - (b.elevasi || 0);
        if (sortBy === "tanggal-desc") {
          return new Date(b.tanggal || 0).getTime() - new Date(a.tanggal || 0).getTime();
        }
        return a.title.localeCompare(b.title);
      });
  }, [initialGunung, search, selectedProvinsi, sortBy]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = filteredGunung.length;
    const totalProvs = new Set(filteredGunung.map((g) => g.provinsi).filter(Boolean)).size;
    const maxElev = total > 0 ? Math.max(...filteredGunung.map((g) => g.elevasi || 0)) : 0;
    return { total, totalProvs, maxElev };
  }, [filteredGunung]);

  // SVG Chart data
  const chartWidth = 500;
  const chartHeight = 80;
  const chartPoints = useMemo(() => {
    if (filteredGunung.length === 0) return "";
    const maxVal = Math.max(...initialGunung.map((g) => g.elevasi || 1));
    const step = chartWidth / (filteredGunung.length - 1 || 1);
    return filteredGunung
      .map((g, i) => {
        const x = i * step;
        const y = chartHeight - ((g.elevasi || 0) / maxVal) * (chartHeight - 10) - 5;
        return `${x},${y}`;
      })
      .join(" ");
  }, [filteredGunung, initialGunung]);

  // Scroll to element helper
  const scrollToCard = (id: string) => {
    const el = document.getElementById(`mtn-card-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setHoveredMtnId(id);
      setTimeout(() => setHoveredMtnId(null), 2000);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#f5f0e8] text-[#1a1510] pb-24 pt-20 md:pt-28 px-4 md:px-8 overflow-hidden">
      {/* ── PARALLAX TOPOGRAPHIC BACKGROUND ── */}
      <motion.div
        className="fixed inset-0 pointer-events-none opacity-[0.07] z-0"
        animate={{
          x: mousePos.x,
          y: mousePos.y,
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.8 }}
        style={{
          backgroundImage: `
            repeating-radial-gradient(ellipse 220px 140px at 20% 30%, transparent 0, transparent 18px, #4a5c3a 19px, transparent 20px),
            repeating-radial-gradient(ellipse 320px 220px at 80% 70%, transparent 0, transparent 28px, #8b4513 29px, transparent 30px),
            repeating-radial-gradient(ellipse 180px 110px at 50% 15%, transparent 0, transparent 12px, #1a1510 13px, transparent 14px)
          `,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        
        {/* ── LEFT PANEL: ARCHIVE INFORMATION & CONTROLS ── */}
        <section className="lg:col-span-4 flex flex-col justify-start lg:sticky lg:top-24 lg:h-[calc(100vh-140px)] gap-6">
          <div>
            <div className="flex items-center gap-2 text-amber-800 font-mono text-[9px] uppercase tracking-[0.3em] mb-3">
              <span className="inline-block w-1.5 h-1.5 bg-amber-800 rounded-full animate-pulse" />
              Arsip Lapangan Pendakian
            </div>
            <h1 className="font-serif text-[48px] md:text-[68px] font-black leading-[0.88] tracking-[-3px] text-[#1a1510]">
              Arsip
              <br />
              <span className="italic text-[#4a5c3a]">Pendakian</span>
            </h1>
            <p className="mt-4 font-mono text-[10px] text-stone-500 uppercase tracking-widest leading-relaxed">
              Jurnal Visual & Data Ekspedisi Puncak Nusantara // Oleh M. Yudi Setiawan
            </p>
          </div>

          {/* Real-time Dynamic Stats */}
          <div className="grid grid-cols-3 border-y border-[#c8b896] py-5">
            <div className="text-center border-r border-[#e8e0d0]">
              <motion.p 
                key={stats.total}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-serif text-3xl font-bold text-[#1a1510]"
              >
                {stats.total}
              </motion.p>
              <p className="font-mono text-[8px] uppercase tracking-wider text-stone-400 mt-1">Gunung</p>
            </div>
            <div className="text-center border-r border-[#e8e0d0]">
              <motion.p
                key={stats.totalProvs}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-serif text-3xl font-bold text-[#1a1510]"
              >
                {stats.totalProvs}
              </motion.p>
              <p className="font-mono text-[8px] uppercase tracking-wider text-stone-400 mt-1">Wilayah</p>
            </div>
            <div className="text-center">
              <motion.p
                key={stats.maxElev}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-serif text-3xl font-bold text-amber-800"
              >
                {stats.maxElev > 0 ? `${stats.maxElev}m` : "—"}
              </motion.p>
              <p className="font-mono text-[8px] uppercase tracking-wider text-stone-400 mt-1">Puncak Tertinggi</p>
            </div>
          </div>

          {/* Interactive Elevation Profile Chart */}
          {filteredGunung.length > 1 && (
            <div className="bg-[#e8e0d0]/50 p-4 rounded border border-[#c8b896]/50">
              <h3 className="font-mono text-[9px] uppercase tracking-wider text-stone-500 mb-2 flex items-center justify-between">
                <span>Profil Ketinggian Terfilter</span>
                <span className="text-[8px] text-[#4a5c3a]">Klik baris untuk lompat</span>
              </h3>
              <div className="relative w-full h-[80px]">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                  {/* Line Path */}
                  <polyline
                    fill="none"
                    stroke="#4a5c3a"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    points={chartPoints}
                  />
                  {/* Bar/Dots representing mountains */}
                  {filteredGunung.map((g, i) => {
                    const step = chartWidth / (filteredGunung.length - 1 || 1);
                    const x = i * step;
                    const maxVal = Math.max(...initialGunung.map((mtn) => mtn.elevasi || 1));
                    const y = chartHeight - ((g.elevasi || 0) / maxVal) * (chartHeight - 10) - 5;
                    const isHovered = hoveredMtnId === g._id;
                    return (
                      <g key={g._id} className="cursor-pointer" onClick={() => scrollToCard(g._id)}>
                        <line
                          x1={x}
                          y1={chartHeight}
                          x2={x}
                          y2={y}
                          stroke={isHovered ? "#8b4513" : "#c8b896"}
                          strokeWidth={isHovered ? "3" : "1"}
                          className="hover:stroke-[#8b4513] hover:stroke-[3] transition-all"
                        />
                        <circle
                          cx={x}
                          cy={y}
                          r={isHovered ? 4 : 2}
                          fill={isHovered ? "#8b4513" : "#4a5c3a"}
                          className="hover:r-4 hover:fill-[#8b4513] transition-all"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          )}

          {/* Interactive Search & Sort */}
          <div className="flex flex-col gap-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari gunung atau jalur..."
                className="w-full pl-9 pr-4 py-2 bg-white/70 backdrop-blur-sm border border-[#c8b896] rounded text-xs font-mono placeholder:text-stone-400 focus:outline-none focus:border-amber-800 transition-colors"
              />
            </div>

            <div className="flex gap-2">
              {/* Sort selector */}
              <div className="relative flex-1">
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={12} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full pl-8 pr-4 py-2 bg-white/70 backdrop-blur-sm border border-[#c8b896] rounded text-[10px] font-mono appearance-none focus:outline-none focus:border-amber-800"
                >
                  <option value="tanggal-desc">Urut: Ekspedisi Terbaru</option>
                  <option value="elevasi-desc">Urut: Elevasi Tertinggi</option>
                  <option value="elevasi-asc">Urut: Elevasi Terendah</option>
                  <option value="title-asc">Urut: Abjad A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* ── RIGHT PANEL: FILTER LIST & CARDS ── */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          {/* Horizontal scrolling region/province filter */}
          <div className="sticky top-0 bg-[#f5f0e8]/85 backdrop-blur-md py-4 border-b border-[#e8e0d0] z-20 overflow-x-auto scrollbar-none flex gap-2">
            {provinsiList.map((prov) => (
              <button
                key={prov}
                onClick={() => setSelectedProvinsi(prov)}
                className={`px-3 py-1 font-mono text-[9px] uppercase tracking-wider rounded-full border transition-all duration-300 ${
                  selectedProvinsi === prov
                    ? "bg-[#1a1510] text-[#f5f0e8] border-[#1a1510]"
                    : "bg-white/40 text-stone-600 border-[#c8b896] hover:bg-white"
                }`}
              >
                {prov}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredGunung.length > 0 ? (
                filteredGunung.map((gunung, index) => {
                  const isHovered = hoveredMtnId === gunung._id;
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      key={gunung._id}
                      id={`mtn-card-${gunung._id}`}
                      onMouseEnter={() => setHoveredMtnId(gunung._id)}
                      onMouseLeave={() => setHoveredMtnId(null)}
                      className={`relative bg-white/40 border p-5 rounded transition-all duration-500 flex flex-col justify-between group overflow-hidden ${
                        isHovered 
                          ? "border-amber-800 bg-white/70 shadow-lg -translate-y-1" 
                          : "border-[#c8b896] hover:border-amber-800"
                      }`}
                    >
                      {/* Compass/Grid details shown on hover */}
                      <div className="absolute right-2 bottom-2 text-stone-100 group-hover:text-stone-200 pointer-events-none transition-colors duration-500 z-0">
                        <Compass className="w-48 h-48 rotate-45 transform translate-x-12 translate-y-12 opacity-30" />
                      </div>

                      <div className="relative z-10 flex flex-col h-full justify-between">
                        {/* Card Header metadata */}
                        <div>
                          <div className="flex justify-between items-center mb-3 font-mono text-[8px] text-stone-400">
                            <span>IDN_MTN_00{index + 1}</span>
                            <span className="flex items-center gap-1 text-[#4a5c3a]">
                              <span className="w-1.5 h-1.5 bg-[#4a5c3a] rounded-full" />
                              Arsip Terbuka
                            </span>
                          </div>

                          {/* Cover Image */}
                          <div className="relative aspect-16/10 mb-4 rounded overflow-hidden bg-stone-200 border border-[#e8e0d0]">
                            {gunung.coverImage ? (
                              <Image
                                src={urlFor(gunung.coverImage).width(600).url()}
                                alt={gunung.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 30vw"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter sepia-10 group-hover:sepia-0"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-mono text-[9px] tracking-widest text-[#c8b896]">
                                [ FOTO GUNUNG ]
                              </div>
                            )}
                            <div className="absolute top-2 left-2 bg-[#1a1510]/80 backdrop-blur-md px-2 py-0.5 rounded font-mono text-[8px] text-stone-200 uppercase tracking-widest">
                              {gunung.elevasi}m ASL
                            </div>
                          </div>

                          <h2 className="font-serif text-3xl font-black text-[#1a1510] group-hover:text-amber-900 transition-colors mb-2 leading-none">
                            {gunung.title}
                          </h2>
                          <p className="font-mono text-[9px] text-[#4a5c3a] uppercase tracking-wider mb-4">
                            {gunung.provinsi}
                          </p>
                        </div>

                        {/* Card Footer */}
                        <div className="border-t border-[#e8e0d0] pt-4 mt-2">
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="font-mono text-[7px] uppercase tracking-wider text-stone-400">Akses Jalur</p>
                              <p className="font-mono text-[9px] text-stone-700 mt-0.5">{gunung.jalur ?? "Via Basecamp"}</p>
                            </div>
                            <Link href={`/gunung/${gunung.slug?.current}`}>
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-stone-300 hover:border-amber-800 text-stone-500 hover:text-amber-800 transition-all group-hover:bg-amber-800 group-hover:text-[#f5f0e8] group-hover:border-amber-800">
                                →
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-2 text-center py-20 border border-dashed border-[#c8b896] rounded bg-white/20">
                  <SlidersHorizontal className="mx-auto text-[#c8b896] mb-3 animate-pulse" size={32} />
                  <p className="font-serif text-xl italic text-stone-500">Tidak ada arsip yang cocok</p>
                  <p className="font-mono text-[9px] text-stone-400 uppercase tracking-widest mt-2">
                    Cobalah kata kunci lain atau bersihkan penyaring
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

      </div>
    </main>
  );
}
