/**
 * kalingPendingData.jsx
 * ─────────────────────────────────────────────────────────────
 * Data permohonan yang SEDANG MENUNGGU verifikasi di Kaling.
 * Surat yang sudah di-approve Kaling akan diteruskan ke Kelurahan
 * (jika needsKelurahan = true).
 *
 * Alur valid:
 *   - Masyarakat → Kaling → Kelurahan  (domisili, sktm, nikah, sku, dll.)
 *   - Masyarakat → Kaling               (belum_menikah, izin_keramaian)
 *   - Masyarakat → Kelurahan            (masih_hidup — langsung, tanpa Kaling)
 *
 * CATATAN: SKCK tidak masuk sistem ini. Per 2025 langsung ke Polres/Polsek.
 */
export const DUMMY_PENDING = [
  {
    id: 1,
    name: "Andi Wijaya",
    nik: "5171012504950003",
    block: "Banjar Tegal / No. 12",
    serviceId: "sku",
    date: "24 Okt 2026, 09:15",
    ttl: "Denpasar, 25 April 1995",
    jenisKelamin: "Laki-laki",
    agama: "Hindu",
    pekerjaan: "Wiraswasta",
    alamat: "Jl. Tukad Badung No. 12, Banjar Tegal, Kel. Panjer, Denpasar",
    keperluan: "Pengurusan izin usaha warung makan untuk pengajuan KUR BRI",
    docs: [
      "KTP_AndiWijaya.jpg",
      "KK_AndiWijaya.pdf",
      "SuratPernyataanUsaha_AndiWijaya.pdf",
    ],
  },
  {
    id: 2,
    name: "Siti Halimah",
    nik: "5171014306920005",
    block: "Banjar Anyar / No. 04",
    serviceId: "domisili",
    date: "24 Okt 2026, 10:40",
    ttl: "Surabaya, 3 Juni 1992",
    jenisKelamin: "Perempuan",
    agama: "Islam",
    pekerjaan: "Ibu Rumah Tangga",
    alamat:
      "Jl. Pulau Saelus Gg. II No. 4, Banjar Anyar, Kel. Panjer, Denpasar",
    keperluan: "Pendaftaran sekolah anak ke SD Negeri setempat",
    docs: ["KTP_SitiHalimah.jpg", "KK_SitiHalimah.pdf"],
  },
  {
    id: 3,
    name: "Budi Pratama",
    nik: "5171011208880001",
    block: "Banjar Tegal / No. 15",
    serviceId: "belum_menikah",
    date: "23 Okt 2026, 16:20",
    ttl: "Denpasar, 12 Agustus 1988",
    jenisKelamin: "Laki-laki",
    agama: "Hindu",
    pekerjaan: "PNS",
    alamat: "Jl. Kamboja No. 15, Banjar Tegal, Kel. Panjer, Denpasar",
    keperluan: "Persyaratan melamar pekerjaan BUMN",
    docs: [
      "KTP_BudiPratama.jpg",
      "KK_BudiPratama.pdf",
      "SuratPernyataanBelumMenikah_Materai.pdf",
    ],
  },
  {
    id: 4,
    name: "Made Suarsana",
    nik: "5171010202870009",
    block: "Banjar Tegal / No. 07",
    serviceId: "sktm",
    date: "23 Okt 2026, 14:05",
    ttl: "Gianyar, 2 Februari 1987",
    jenisKelamin: "Laki-laki",
    agama: "Hindu",
    pekerjaan: "Buruh Harian",
    alamat: "Jl. Pulau Galang No. 7, Banjar Tegal, Kel. Panjer, Denpasar",
    keperluan: "Pengajuan beasiswa pendidikan anak ke SMA Negeri",
    docs: [
      "KTP_MadeSuarsana.jpg",
      "KK_MadeSuarsana.pdf",
      "SuratPernyataanKurangMampu_Materai.pdf",
    ],
  },
  {
    id: 5,
    name: "Wayan Sudirga",
    nik: "5171010107870002",
    block: "Banjar Tegal / No. 22",
    serviceId: "izin_keramaian",
    date: "22 Okt 2026, 11:30",
    ttl: "Denpasar, 1 Juli 1987",
    jenisKelamin: "Laki-laki",
    agama: "Hindu",
    pekerjaan: "Pemangku Adat",
    alamat: "Jl. Kamboja No. 22, Banjar Tegal, Kel. Panjer, Denpasar",
    keperluan: "Upacara Ngaben keluarga besar, estimasi 300 tamu",
    docs: ["KTP_WayanSudirga.jpg", "SusunanAcara_Ngaben.pdf"],
  },
];
