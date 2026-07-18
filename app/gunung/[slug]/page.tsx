import { getGunungBySlug, getGunungSlugs, urlFor } from "@/lib/sanity-utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Lightbox from "@/components/gallery/Lightbox";
import { Calendar, MapPin, Milestone, ArrowLeft, Layers } from "lucide-react";

// Force static rendering (Next.js will generate this route statically at build time)
export const dynamic = "force-static";

export async function generateStaticParams() {
  const slugsData = await getGunungSlugs();
  return (slugsData || [])
    .filter((g: { slug: string }) => g.slug)
    .map((g: { slug: string }) => ({
      slug: g.slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gunung = await getGunungBySlug(slug);

  if (!gunung) return { title: "Gunung Tidak Ditemukan" };
  return { title: `${gunung.title} | Arsip Visual Pendakian` };
}

export default async function GunungDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gunung = await getGunungBySlug(slug);

  if (!gunung) {
    notFound();
  }

  return (
    <main className="relative min-h-screen bg-[#f5f0e8] text-[#1a1510] pb-24 pt-20 md:pt-28 px-4 md:px-8 overflow-hidden">
      {/* Topographic Background Overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `
            repeating-radial-gradient(ellipse 200px 120px at 70% 30%, transparent 0, transparent 18px, #4a5c3a 19px, transparent 20px),
            repeating-radial-gradient(ellipse 150px 90px at 15% 70%, transparent 0, transparent 12px, #1a1510 13px, transparent 14px)
          `,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">
        
        {/* ── LEFT COLUMN: EDITORIAL METADATA & FIELD NOTES (Sticky on Desktop) ── */}
        <section className="lg:col-span-5 flex flex-col justify-start lg:sticky lg:top-24 lg:h-[calc(100vh-140px)] gap-6 overflow-y-auto scrollbar-none pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-[#c8b896] pb-8 lg:pb-0">
          {/* Back Navigation */}
          <div>
            <Link
              href="/"
              className="group inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-stone-500 hover:text-amber-800 transition-colors"
            >
              <ArrowLeft size={10} className="transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Kembali ke Index_Arsip</span>
            </Link>
          </div>

          {/* Title Header */}
          <div>
            <div className="flex items-center gap-2 font-mono text-[8px] text-[#4a5c3a] uppercase tracking-[0.3em] mb-2">
              <Layers size={10} />
              Dokumen Ekspedisi
            </div>
            <h1 className="font-serif text-[44px] md:text-[64px] font-black leading-[0.88] tracking-[-3px] text-[#1a1510] mb-2">
              {gunung.title}
            </h1>
            <p className="font-mono text-xs text-amber-800 uppercase tracking-widest font-semibold">
              {gunung.elevasi}m ASL // {gunung.provinsi}
            </p>
          </div>

          {/* Technical Info Grid */}
          <div className="grid grid-cols-2 gap-4 border-y border-[#c8b896] py-5">
            <div>
              <p className="font-mono text-[7px] uppercase tracking-wider text-stone-400 mb-1 flex items-center gap-1">
                <MapPin size={8} /> Wilayah
              </p>
              <p className="font-serif text-base font-bold text-stone-800 leading-tight">
                {gunung.provinsi ?? "Indonesia"}
              </p>
            </div>
            <div>
              <p className="font-mono text-[7px] uppercase tracking-wider text-stone-400 mb-1 flex items-center gap-1">
                <Milestone size={8} /> Akses Jalur
              </p>
              <p className="font-serif text-base font-bold text-stone-800 leading-tight">
                {gunung.jalur ?? "Via Basecamp"}
              </p>
            </div>
            <div className="mt-2">
              <p className="font-mono text-[7px] uppercase tracking-wider text-stone-400 mb-1 flex items-center gap-1">
                <Calendar size={8} /> Tahun Ekspedisi
              </p>
              <p className="font-serif text-base font-bold text-stone-800 leading-tight">
                {gunung.tanggal ? new Date(gunung.tanggal).getFullYear() : "—"}
              </p>
            </div>
            <div className="mt-2">
              <p className="font-mono text-[7px] uppercase tracking-wider text-stone-400 mb-1 flex items-center gap-1">
                Status Arsip
              </p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-[#4a5c3a] font-bold mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#4a5c3a] rounded-full" /> Terbuka
              </p>
            </div>
          </div>

          {/* Travel narrative / Field notes */}
          {gunung.narasi && (
            <div className="relative pl-5 border-l-2 border-[#4a5c3a] py-1 bg-white/20 rounded-r">
              <p className="font-mono text-[8px] uppercase tracking-widest text-amber-800 mb-2 font-semibold">
                Catatan_Perjalanan //
              </p>
              <p className="font-serif text-lg leading-relaxed text-stone-700 italic">
                &ldquo;{gunung.narasi}&rdquo;
              </p>
            </div>
          )}

          {/* Footer Copyright */}
          <div className="mt-auto pt-6 text-[8px] font-mono text-stone-400 leading-loose">
            <p>Seluruh dokumen visual diambil di lapangan secara asli.</p>
            <p>© {new Date().getFullYear()} Muhammad Yudi Setiawan. All rights reserved.</p>
          </div>
        </section>

        {/* ── RIGHT COLUMN: HIGH-RES COVER & GALLERY MASONRY (Scrollable) ── */}
        <section className="lg:col-span-7 flex flex-col gap-10">
          
          {/* Main cover image */}
          <div className="relative aspect-16/10 rounded overflow-hidden border border-[#c8b896] p-2 bg-[#e8e0d0]/50 shadow-md">
            <div className="relative w-full h-full rounded overflow-hidden">
              <Image
                src={urlFor(gunung.coverImage).width(1200).url()}
                alt={gunung.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-102 filter sepia-10 hover:sepia-0"
              />
            </div>
          </div>

          {/* Visual Archive Grid / Gallery */}
          {gunung.gallery && gunung.gallery.length > 0 ? (
            <div className="border-t border-[#c8b896] pt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#1a1510] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-amber-800 rounded-full" />
                  Galeri Visual Dokumentasi
                </h2>
                <span className="font-mono text-[8px] text-stone-400">
                  Total File: {gunung.gallery.length}
                </span>
              </div>

              {/* Lightbox masonry grid */}
              <Lightbox images={gunung.gallery} mountainTitle={gunung.title} />
            </div>
          ) : (
            <div className="border-t border-dashed border-[#c8b896] rounded p-8 text-center bg-white/20">
              <p className="font-serif text-sm italic text-stone-500">Galeri foto tidak tersedia untuk arsip ini</p>
            </div>
          )}

        </section>

      </div>
    </main>
  );
}
