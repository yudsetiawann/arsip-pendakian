import { getGunung, urlFor } from "@/lib/sanity-utils";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const gunungList = await getGunung();
  const featured = gunungList[0];
  const rest = gunungList.slice(1);
  const totalGunung = gunungList.length;
  const totalWilayah = new Set(
    gunungList.map((g: any) => g.provinsi).filter(Boolean),
  ).size;
  // Mencari elevasi tertinggi dari seluruh daftar
  const elevasiTertinggi =
    gunungList.length > 0
      ? Math.max(...gunungList.map((g: any) => g.elevasi || 0))
      : 0;

  const stats = [
    { val: totalGunung, label: "Gunung" },
    { val: totalWilayah > 0 ? totalWilayah : "—", label: "Wilayah" }, // Label diubah ke Wilayah agar lebih akurat dengan data provinsi
    { val: `${elevasiTertinggi}m`, label: "Tertinggi" },
  ];

  return (
    <main className="relative min-h-screen bg-[#f5f0e8] text-[#1a1510] overflow-x-hidden">
      {/* Topo map background texture */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `
            repeating-radial-gradient(ellipse 200px 120px at 30% 40%, transparent 0, transparent 18px, #4a5c3a 19px, transparent 20px),
            repeating-radial-gradient(ellipse 280px 180px at 70% 60%, transparent 0, transparent 28px, #8b4513 29px, transparent 30px),
            repeating-radial-gradient(ellipse 150px 90px at 55% 20%, transparent 0, transparent 12px, #1a1510 13px, transparent 14px)
          `,
        }}
      />

      <div className="relative z-10 max-w-lg mx-auto pb-20">
        {/* ── HERO HEADER ── */}
        <header className="px-5 pt-12 pb-8 border-b border-[#c8b896]">
          <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] text-[#8b4513] mb-4">
            <span className="text-[7px]">▲</span>
            Arsip Visual Yudi Setiawan
          </p>
          <h1 className="font-serif text-[56px] md:text-[80px] font-black leading-[0.88] tracking-[-3px] text-[#1a1510]">
            Arsip
            <br />
            <span className="italic text-[#4a5c3a]">Pendakian</span>
          </h1>
          <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.15em] text-[#c8b896] leading-loose">
            Indonesian Mountain
            {/* <br />
            Visual Archives // v1.0 */}
          </p>

          {/* Quick stats - Now Dynamic */}
          <div className="mt-5 grid grid-cols-3 border-t border-[#e8e0d0] pt-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="text-center px-2 not-last:border-r border-[#e8e0d0]"
              >
                <p className="font-serif text-2xl font-bold text-[#1a1510]">
                  {s.val}
                </p>
                <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.15em] text-[#c8b896]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </header>

        {/* ── FEATURED CARD (first gunung) ── */}
        {featured && (
          <Link href={`/gunung/${featured.slug.current}`}>
            <div className="mx-5 my-6 bg-[#1a1510] text-[#f5f0e8] p-6 relative overflow-hidden border border-[#c8b896] group">
              {/* Rotated badge */}
              <span className="absolute top-4 -right-4.5 bg-[#8b4513] text-[#f5f0e8] font-mono text-[8px] uppercase tracking-[0.2em] px-7 py-1 rotate-90 origin-right">
                Unggulan
              </span>

              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#8b4513] mb-3">
                ▲ Pilihan Utama
              </p>
              <h2 className="font-serif text-[46px] font-black leading-[0.88] tracking-[-2px] text-[#f5f0e8] mb-1">
                {featured.title}
                {/* <br />
                <em className="italic text-[#c8b896] text-3xl">
                  Puncak Tertinggi
                </em> */}
              </h2>
              <p className="font-mono text-[10px] text-[#c8b896] mb-5 mt-1">
                {featured.elevasi}m ASL
              </p>

              {/* Image */}
              <div className="relative w-full aspect-16/7 mb-4 overflow-hidden bg-white/5 border border-white/10">
                {featured.coverImage ? (
                  <Image
                    src={urlFor(featured.coverImage).width(900).url()}
                    alt={featured.title}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 sepia-30"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-[9px] tracking-widest text-white/20">
                    [ FOTO GUNUNG ]
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center border-t border-white/15 pt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-[#c8b896]">
                <span>Buka Arsip Lengkap</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* ── LIST HEADER ── */}
        <div className="px-5 py-6 flex justify-between items-baseline border-b border-[#e8e0d0]">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8b4513]">
            ▲ Semua Arsip
          </span>
          <span className="font-serif text-sm text-[#c8b896]">
            Menampilkan: {gunungList.length}
          </span>
        </div>

        {/* ── MOUNTAIN LIST ── */}
        <div className="px-5">
          {rest.map((gunung: any, index: number) => (
            <Link
              href={`/gunung/${gunung.slug.current}`}
              key={gunung._id}
              className="group block py-7 border-b border-[#e8e0d0] last:border-none"
            >
              {/* Card top row */}
              <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#c8b896]">
                  IDN_MTN_{String(index + 2).padStart(3, "0")}
                </span>
                <span className="font-mono text-[8px] uppercase tracking-[0.15em] border border-[#4a5c3a] text-[#4a5c3a] px-2 py-0.5">
                  Terbuka
                </span>
              </div>

              {/* Mountain name */}
              <h2 className="font-serif text-[40px] font-black leading-none tracking-[-2px] text-[#1a1510] mb-3 transition-all duration-500 group-hover:translate-x-2 group-hover:italic">
                {gunung.title}
              </h2>

              {/* Image */}
              <div className="relative w-full aspect-video mb-3 overflow-hidden bg-[#e8e0d0] border border-[#e8e0d0]">
                {gunung.coverImage ? (
                  <Image
                    src={urlFor(gunung.coverImage).width(800).url()}
                    alt={gunung.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-[9px] tracking-widest text-[#c8b896]">
                    [ FOTO GUNUNG ]
                  </div>
                )}
              </div>

              {/* Data pills */}
              <div className="flex">
                {[
                  { val: `${gunung.elevasi}m`, key: "Ketinggian" },
                  { val: gunung.provinsi ?? "—", key: "Provinsi" },
                  { val: gunung.jalur ?? "—", key: "Jalur" },
                ].map((d, i) => (
                  <div
                    key={d.key}
                    className={`flex-1 px-3 py-2.5 bg-[#e8e0d0] ${i !== 2 ? "border-r border-[#e8e0d0]" : ""}`}
                  >
                    <p className="font-serif text-base font-bold text-[#1a1510] leading-none">
                      {d.val}
                    </p>
                    <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.12em] text-[#c8b896]">
                      {d.key}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer arrow */}
              <div className="flex justify-between items-center mt-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#8b4513]">
                  {gunung.jalur ?? "Via Basecamp"}
                </span>
                <span className="font-serif text-lg text-[#c8b896] transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* ── FOOTER ── */}
        <footer className="mx-5 mt-10 pt-5 border-t border-[#c8b896] flex justify-between">
          <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#c8b896] leading-relaxed">
            Owner: Muhammad Yudi Setiawan
            {/* <br />
            Status: Development_Phase */}
          </p>
          <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#c8b896] leading-relaxed text-right">
            Loc: JKT, IDN
            {/* <br />
            v1.0 // 2026 */}
          </p>
        </footer>
      </div>
    </main>
  );
}
