import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

export interface GunungData {
  _id: string;
  title: string;
  slug?: { current: string };
  elevasi?: number;
  tanggal?: string;
  provinsi?: string;
  jalur?: string;
  coverImage?: unknown;
  narasi?: string;
  gallery?: unknown[];
}

// Konfigurasi Client Sanity
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-05-09", // Gunakan tanggal hari ini atau saat project dibuat
  useCdn: true, // true untuk performa lebih cepat di halaman publik
});

// Helper untuk URL Gambar Sanity
const builder = createImageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  if (typeof source === "string") {
    return {
      width: () => ({
        url: () => source,
      }),
      url: () => source,
    };
  }
  return builder.image(source);
}

// Fungsi untuk mengambil data gunung
export async function getGunung(): Promise<GunungData[]> {
  // GROQ Query untuk mengambil data yang dibutuhkan di halaman depan
  const query = `*[_type == "gunung"] | order(tanggal desc) {
    _id,
    title,
    slug,
    elevasi,
    tanggal,
    provinsi,
    jalur,
    coverImage
  }`;

  const sanityData = await client.fetch<GunungData[]>(
    query,
    {},
    {
      next: {
        revalidate: 3600,
      },
    },
  );

  // Map cover images to local thumbnails
  const mappedData = (sanityData || []).map((g: GunungData) => {
    const slugStr = g.slug?.current;
    if (slugStr === "lumut") g.coverImage = "/Thumbnail/Lumut.png";
    else if (slugStr === "butik") g.coverImage = "/Thumbnail/Butik.png";
    else if (slugStr === "kawah-ratu") g.coverImage = "/Thumbnail/Kawah-ratu.png";
    else if (slugStr === "canar") g.coverImage = "/Thumbnail/Canar.png";
    else if (slugStr === "pangrango-via-cibodas") g.coverImage = "/Thumbnail/Pangrango.png";
    else if (slugStr === "salak-i") g.coverImage = "/Thumbnail/Salak-I.png";
    else if (slugStr === "salak-ii") g.coverImage = "/Thumbnail/Salak-II.png";
    return g;
  });

  // Append Mt. Gede
  const hasGede = mappedData.some((g: GunungData) => g.slug?.current === "gede");
  if (!hasGede) {
    mappedData.push({
      _id: "local-gede",
      title: "Mt. Gede",
      slug: { current: "gede" },
      elevasi: 2958,
      tanggal: "2026-07-15",
      provinsi: "Jawa Barat",
      jalur: "Via Gunung Putri",
      coverImage: "/Thumbnail/Gede.png",
    });
  }

  // Sort by date desc
  return mappedData.sort((a: GunungData, b: GunungData) => {
    const dateA = a.tanggal ? new Date(a.tanggal).getTime() : 0;
    const dateB = b.tanggal ? new Date(b.tanggal).getTime() : 0;
    return dateB - dateA;
  });
}

export async function getGunungBySlug(slug: string): Promise<GunungData | null> {
  if (slug === "gede") {
    return {
      _id: "local-gede",
      title: "Mt. Gede",
      elevasi: 2958,
      tanggal: "2026-07-15",
      provinsi: "Jawa Barat",
      jalur: "Via Gunung Putri",
      narasi: "Pendakian Gunung Gede dengan ketinggian 2958 mdpl dilaksanakan pada tanggal 15-16 Juli 2026, melewati jalur pendakian Putri yang menantang dan menyajikan keindahan sabana Suryakencana serta kawah aktif yang megah.",
      coverImage: "/Thumbnail/Gede.png",
      gallery: [
        "/Mt. Gede 2958 MDPL - 15-16 Juli 2026/_MG_3072.jpg",
        "/Mt. Gede 2958 MDPL - 15-16 Juli 2026/_MG_3154.jpg",
        "/Mt. Gede 2958 MDPL - 15-16 Juli 2026/_MG_3176.jpg",
        "/Mt. Gede 2958 MDPL - 15-16 Juli 2026/IMG_6957.jpg",
        "/Mt. Gede 2958 MDPL - 15-16 Juli 2026/IMG_6964.jpg",
        "/Mt. Gede 2958 MDPL - 15-16 Juli 2026/IMG_7030 (1).jpg",
        "/Mt. Gede 2958 MDPL - 15-16 Juli 2026/IMG_7032 (1).jpg",
        "/Mt. Gede 2958 MDPL - 15-16 Juli 2026/PXL_20260715_231922508 (1).jpg",
        "/Mt. Gede 2958 MDPL - 15-16 Juli 2026/PXL_20260715_233625944.jpg",
        "/Mt. Gede 2958 MDPL - 15-16 Juli 2026/PXL_20260716_010937910.jpg",
        "/Mt. Gede 2958 MDPL - 15-16 Juli 2026/PXL_20260716_011723916.jpg",
      ],
    };
  }

  // Ambil 1 data gunung beserta array gallery-nya
  const query = `*[_type == "gunung" && slug.current == $slug][0] {
    _id,
    title,
    elevasi,
    tanggal,
    provinsi,
    jalur,
    narasi,
    coverImage,
    gallery
  }`;

  const g = await client.fetch<GunungData | null>(query, { slug });
  if (g) {
    const slugStr = slug;
    if (slugStr === "lumut") g.coverImage = "/Thumbnail/Lumut.png";
    else if (slugStr === "butik") g.coverImage = "/Thumbnail/Butik.png";
    else if (slugStr === "kawah-ratu") g.coverImage = "/Thumbnail/Kawah-ratu.png";
    else if (slugStr === "canar") g.coverImage = "/Thumbnail/Canar.png";
    else if (slugStr === "pangrango-via-cibodas") g.coverImage = "/Thumbnail/Pangrango.png";
    else if (slugStr === "salak-i") g.coverImage = "/Thumbnail/Salak-I.png";
    else if (slugStr === "salak-ii") g.coverImage = "/Thumbnail/Salak-II.png";
  }
  return g;
}

export async function getGunungSlugs(): Promise<{ slug: string }[]> {
  const query = `*[_type == "gunung"] {
    "slug": slug.current
  }`;
  const slugsData = await client.fetch<{ slug: string }[]>(query);
  const list = slugsData || [];
  if (!list.some((s: { slug: string }) => s.slug === "gede")) {
    list.push({ slug: "gede" });
  }
  return list;
}
