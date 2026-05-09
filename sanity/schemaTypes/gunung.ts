import { defineType, defineField } from 'sanity'

export const gunungType = defineType({
  name: "gunung",
  title: "Gunung",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nama Gunung",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "elevasi",
      title: "Ketinggian (mdpl)",
      type: "number",
    }),
    defineField({
      name: "tanggal",
      title: "Tanggal Pendakian",
      type: "date",
    }),
    defineField({
      name: "provinsi",
      title: "Provinsi",
      type: "string",
      options: {
        list: [
          { title: "Aceh", value: "Aceh" },
          { title: "Sumatera Utara", value: "Sumatera Utara" },
          { title: "Sumatera Barat", value: "Sumatera Barat" },
          { title: "Jawa Barat", value: "Jawa Barat" },
          { title: "Jawa Tengah", value: "Jawa Tengah" },
          { title: "Jawa Timur", value: "Jawa Timur" },
          { title: "DI Yogyakarta", value: "DI Yogyakarta" },
          { title: "Bali", value: "Bali" },
          { title: "Lombok / NTB", value: "Nusa Tenggara Barat" },
          { title: "Papua", value: "Papua" },
          // Tambahkan provinsi lain sesuai kebutuhan arsipmu
        ],
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "jalur",
      title: "Jalur Pendakian",
      type: "string",
      description: "Contoh: Via Bambangan, Via Cibodas, dll.",
    }),
    defineField({
      name: "coverImage",
      title: "Foto Cover",
      type: "image",
      options: {
        hotspot: true, // Memungkinkan crop visual di CMS
      },
    }),
    defineField({
      name: "gallery",
      title: "Galeri Foto",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "narasi",
      title: "Narasi Singkat",
      type: "text", // Menggunakan text biasa untuk estetika brutalist yang fokus pada tipografi sederhana
    }),
  ],
});