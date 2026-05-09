import { getGunungBySlug, urlFor } from "@/lib/sanity-utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Lightbox from "@/components/gallery/Lightbox";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gunung = await getGunungBySlug(slug);

  if (!gunung) return { title: "Gunung Tidak Ditemukan" };
  return { title: `${gunung.title} | Arsip Visual` };
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
    <main className="relative min-h-screen bg-[#f5f0e8] text-[#1a1510] overflow-x-hidden">
      {/* Topo map background texture (Konsisten dengan Homepage) */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            repeating-radial-gradient(ellipse 200px 120px at 30% 40%, transparent 0, transparent 18px, #4a5c3a 19px, transparent 20px),
            repeating-radial-gradient(ellipse 150px 90px at 80% 20%, transparent 0, transparent 12px, #1a1510 13px, transparent 14px)
          `,
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto pb-24">
        {/* ── NAVIGATION ── */}
        <nav className="px-5 pt-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8b4513]"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            <span>Kembali ke Index_Arsip</span>
          </Link>
        </nav>

        {/* ── HEADER DETAIL ── */}
        <header className="px-5 pt-12 pb-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-px bg-[#c8b896]"></span>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#4a5c3a]">
              Data_Field_Report
            </p>
          </div>

          <h1 className="font-serif text-[64px] md:text-[90px] font-black leading-[0.85] tracking-[-4px] text-[#1a1510] mb-8">
            {gunung.title}
            {gunung.status === "Aktif" && (
              <span className="inline-block align-top ml-2 text-[#8b4513] text-sm font-mono tracking-normal">
                ●
              </span>
            )}
          </h1>

          {/* Technical Stats Grid */}
          <div className="grid grid-cols-2 border-y border-[#c8b896] py-6 gap-y-6">
            <div className="border-r border-[#e8e0d0] pr-4">
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#c8b896] mb-1">
                Ketinggian
              </p>
              <p className="font-serif text-2xl font-bold text-[#1a1510]">
                {gunung.elevasi}m{" "}
                <span className="text-sm font-normal text-[#c8b896]">ASL</span>
              </p>
            </div>
            <div className="pl-6">
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#c8b896] mb-1">
                Tanggal_Ekspedisi
              </p>
              <p className="font-serif text-2xl font-bold text-[#1a1510]">
                {gunung.tanggal
                  ? new Date(gunung.tanggal).getFullYear()
                  : "N/A"}
              </p>
            </div>
            <div className="border-r border-[#e8e0d0] pr-4">
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#c8b896] mb-1">
                Wilayah_Administrasi
              </p>
              <p className="font-serif text-lg font-bold text-[#4a5c3a]">
                {gunung.provinsi ?? "Indonesia"}
              </p>
            </div>
            <div className="pl-6">
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#c8b896] mb-1">
                Akses_Rute
              </p>
              <p className="font-serif text-lg font-bold text-[#1a1510]">
                {gunung.jalur ?? "Standard"}
              </p>
            </div>
          </div>
        </header>

        {/* ── COVER IMAGE (Wide) ── */}
        <section className="px-5 mb-16">
          <div className="relative aspect-16/10 border border-[#c8b896] p-2 bg-[#e8e0d0]/50">
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={urlFor(gunung.coverImage).width(1200).url()}
                alt={gunung.title}
                fill
                className="object-cover sepia-20 contrast-[1.05]"
              />
            </div>
          </div>
        </section>

        {/* ── NARRATIVE / FIELD NOTES ── */}
        {gunung.narasi && (
          <section className="px-5 mb-20 relative">
            <span className="absolute -left-2 top-0 text-4xl text-[#c8b896] font-serif opacity-50">
              "
            </span>
            <div className="pl-6 border-l-2 border-[#4a5c3a]">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8b4513] mb-4">
                Catatan_Perjalanan //
              </p>
              <p className="font-serif text-xl md:text-2xl leading-relaxed text-[#1a1510]/90 italic">
                {gunung.narasi}
              </p>
            </div>
          </section>
        )}

        {/* ── VISUAL ARCHIVE (Gallery) ── */}
        {gunung.gallery && gunung.gallery.length > 0 && (
          <section className="px-5 border-t border-[#c8b896] pt-12">
            <div className="flex justify-between items-center mb-10">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#1a1510] font-bold">
                ▲ Galeri_Dokumentasi
              </h2>
              <span className="font-mono text-[8px] text-[#c8b896]">
                Item_Count: {gunung.gallery.length}
              </span>
            </div>

            {/* Lightbox dengan styling khusus agar menyatu */}
            <div className="gallery-wrapper border-b border-[#e8e0d0] pb-12">
              <Lightbox images={gunung.gallery} mountainTitle={gunung.title} />
            </div>
          </section>
        )}

        {/* ── DATA FOOTER ── */}
        <footer className="px-5 mt-20 pt-8 border-t border-[#c8b896] flex flex-col gap-4">
          <div className="flex justify-between font-mono text-[8px] uppercase tracking-[0.2em] text-[#c8b896]">
            <span>Verified_Record // 2026</span>
            <span>{gunung.title}_IDX_001</span>
          </div>
          <p className="font-mono text-[8px] leading-loose text-[#c8b896]">
            Seluruh data visual di atas diambil dalam kondisi lapangan asli.
            Dilarang menggunakan tanpa izin tertulis dari arsiparis:
            <span className="text-[#1a1510]"> Muhammad Yudi Setiawan.</span>
          </p>
        </footer>
      </div>
    </main>
  );
}
