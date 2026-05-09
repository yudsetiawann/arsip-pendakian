import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

// Konfigurasi Client Sanity
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-05-09", // Gunakan tanggal hari ini atau saat project dibuat
  useCdn: true, // true untuk performa lebih cepat di halaman publik
});

// Helper untuk URL Gambar Sanity
const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

// Fungsi untuk mengambil data gunung
export async function getGunung() {
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

  return client.fetch(
    query,
    {},
    {
      next: {
        revalidate: 3600,
      },
    },
  );
}

export async function getGunungBySlug(slug: string) {
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

  return client.fetch(query, { slug });
}
