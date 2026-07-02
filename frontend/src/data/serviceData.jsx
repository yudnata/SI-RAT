/**
 * serviceData.jsx
 * ─────────────────────────────────────────────────────────────
 * Single source-of-truth for the 13 letter/service types.
 * Every role (Masyarakat, Kaling, Kelurahan, Admin) imports from here.
 * NOTE: SKCK tidak termasuk — per 2025 langsung ke Polres/Polsek, tidak butuh pengantar kelurahan.
 */

// ─── Icon Components ────────────────────────────────────────────────────────────
// We export plain SVG string-keys so that they can be rendered
// without circular JSX imports.  Each consumer maps the key → JSX.

export const SERVICE_ICONS = {
  domisili: (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  ),
  sktm: (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
      />
    </svg>
  ),
  nikah: (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  ),
  kelahiran: (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
      />
    </svg>
  ),
  kematian: (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  pindah: (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
      />
    </svg>
  ),
  sku: (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-2.83A3.001 3.001 0 0012 9.349m0 0a3.001 3.001 0 003.75-2.83 3.001 3.001 0 003.75 2.829M12 9.349V3.75m0 0h3.375c.621 0 1.125.504 1.125 1.125V6M12 3.75H8.625c-.621 0-1.125.504-1.125 1.125V6"
      />
    </svg>
  ),
  belum_menikah: (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  ),

  ktp_kk: (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
      />
    </svg>
  ),
  waris: (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
      />
    </svg>
  ),
  izin_keramaian: (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"
      />
    </svg>
  ),
  beda_nama: (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
      />
    </svg>
  ),
  masih_hidup: (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  ),
};

// ─── Service Catalog ────────────────────────────────────────────────────────────

export const SERVICES = [
  {
    id: "domisili",
    name: "Surat Keterangan Domisili",
    tags: ["KELURAHAN", "KEPENDUDUKAN"],
    requirements: ["Fotokopi KTP", "Fotokopi KK"],
    requirementKeys: ["ktp", "kk"],
    flow: "Masyarakat ➔ Kaling ➔ Kelurahan",
    flowSteps: ["masyarakat", "kaling", "kelurahan"],
    needsKaling: true,
    needsKelurahan: true,
    forwardTo: null,
    specificFields: [
      {
        name: "alamatDomisili",
        label: "Alamat Domisili Saat Ini",
        type: "textarea",
        placeholder: "Jl. Kamboja No. 5, Banjar Anyar, Denpasar",
      },
      { name: "tinggalSejak", label: "Tinggal Sejak Tanggal", type: "date" },
      {
        name: "keperluan",
        label: "Keperluan Surat Domisili",
        type: "text",
        placeholder: "Pendaftaran Sekolah Anak",
      },
    ],
    templateType: "pengantar_rtrw",
  },
  {
    id: "sktm",
    name: "Surat Keterangan Tidak Mampu (SKTM)",
    tags: ["KELURAHAN", "SOSIAL & EKONOMI"],
    requirements: [
      "Fotokopi KTP",
      "Fotokopi KK",
      "Surat Pernyataan Kurang Mampu (Bermaterai)",
    ],
    requirementKeys: ["ktp", "kk", "pernyataan"],
    flow: "Masyarakat ➔ Kaling ➔ Kelurahan",
    flowSteps: ["masyarakat", "kaling", "kelurahan"],
    needsKaling: true,
    needsKelurahan: true,
    forwardTo: null,
    specificFields: [
      {
        name: "penghasilan",
        label: "Penghasilan Bulanan (Rp)",
        type: "text",
        placeholder: "1.500.000",
      },
      {
        name: "tanggungan",
        label: "Jumlah Tanggungan",
        type: "text",
        placeholder: "3 orang",
      },
      {
        name: "keperluan",
        label: "Keperluan SKTM",
        type: "text",
        placeholder: "Pengajuan beasiswa pendidikan anak",
      },
    ],
    templateType: "pengantar_rtrw",
  },
  {
    id: "nikah",
    name: "Surat Pengantar Nikah",
    tags: ["KELURAHAN", "KEPENDUDUKAN"],
    requirements: ["Fotokopi KTP", "Fotokopi KK", "Akta Kelahiran"],
    requirementKeys: ["ktp", "kk", "aktaLahir"],
    flow: "Masyarakat ➔ Kaling ➔ Kelurahan",
    flowSteps: ["masyarakat", "kaling", "kelurahan"],
    needsKaling: true,
    needsKelurahan: true,
    forwardTo: null,
    specificFields: [
      {
        name: "namaCalonPasangan",
        label: "Nama Calon Pasangan",
        type: "text",
        placeholder: "Nama lengkap calon pasangan",
      },
      {
        name: "tanggalRencanaNikah",
        label: "Tanggal Rencana Nikah",
        type: "date",
      },
      {
        name: "statusPerkawinan",
        label: "Status Perkawinan Saat Ini",
        type: "select",
        options: ["Belum Menikah", "Cerai Hidup", "Cerai Mati"],
      },
    ],
    templateType: "pengantar_rtrw",
  },
  {
    id: "kelahiran",
    name: "Surat Keterangan Kelahiran",
    tags: ["KELURAHAN", "KEPENDUDUKAN"],
    requirements: [
      "Surat Keterangan dari Bidan/RS",
      "Fotokopi KTP Orang Tua",
      "Fotokopi KK",
    ],
    requirementKeys: ["suratBidan", "ktp", "kk"],
    flow: "Masyarakat ➔ Kaling ➔ Kelurahan",
    flowSteps: ["masyarakat", "kaling", "kelurahan"],
    needsKaling: true,
    needsKelurahan: true,
    forwardTo: null,
    specificFields: [
      {
        name: "namaBayi",
        label: "Nama Bayi",
        type: "text",
        placeholder: "Nama lengkap bayi",
      },
      { name: "tanggalLahirBayi", label: "Tanggal Lahir Bayi", type: "date" },
      {
        name: "tempatLahirBayi",
        label: "Tempat Lahir Bayi",
        type: "text",
        placeholder: "RSUD Wangaya, Denpasar",
      },
      {
        name: "namaIbu",
        label: "Nama Ibu",
        type: "text",
        placeholder: "Nama lengkap ibu",
      },
      {
        name: "namaAyah",
        label: "Nama Ayah",
        type: "text",
        placeholder: "Nama lengkap ayah",
      },
    ],
    templateType: "pengantar_rtrw",
  },
  {
    id: "kematian",
    name: "Surat Keterangan Kematian",
    tags: ["KELURAHAN", "KEPENDUDUKAN"],
    requirements: [
      "Surat Keterangan dari Puskesmas/RS",
      "Fotokopi KTP Almarhum",
      "Fotokopi KK",
    ],
    requirementKeys: ["suratRS", "ktp", "kk"],
    flow: "Masyarakat ➔ Kaling ➔ Kelurahan",
    flowSteps: ["masyarakat", "kaling", "kelurahan"],
    needsKaling: true,
    needsKelurahan: true,
    forwardTo: null,
    specificFields: [
      {
        name: "namaAlmarhum",
        label: "Nama Almarhum/Almarhumah",
        type: "text",
        placeholder: "Nama lengkap yang meninggal",
      },
      {
        name: "tanggalMeninggal",
        label: "Tanggal Meninggal Dunia",
        type: "date",
      },
      {
        name: "tempatMeninggal",
        label: "Tempat Meninggal",
        type: "text",
        placeholder: "Rumah / Rumah Sakit",
      },
      {
        name: "sebabKematian",
        label: "Sebab Kematian",
        type: "select",
        options: ["Sakit", "Kecelakaan", "Lainnya"],
      },
    ],
    templateType: "pengantar_rtrw",
  },
  {
    id: "pindah",
    name: "Surat Keterangan Pindah",
    tags: ["KELURAHAN", "KEPENDUDUKAN"],
    requirements: ["Fotokopi KTP", "Fotokopi KK"],
    requirementKeys: ["ktp", "kk"],
    flow: "Masyarakat ➔ Kaling ➔ Kelurahan",
    flowSteps: ["masyarakat", "kaling", "kelurahan"],
    needsKaling: true,
    needsKelurahan: true,
    forwardTo: null,
    specificFields: [
      {
        name: "alamatTujuan",
        label: "Alamat Tujuan Pindah",
        type: "textarea",
        placeholder: "Alamat lengkap tujuan pindah",
      },
      {
        name: "alasanPindah",
        label: "Alasan Pindah",
        type: "select",
        options: ["Pekerjaan", "Pendidikan", "Keluarga", "Keamanan", "Lainnya"],
      },
      {
        name: "jumlahPindah",
        label: "Jumlah Anggota yang Ikut Pindah",
        type: "text",
        placeholder: "3 orang",
      },
    ],
    templateType: "pengantar_rtrw",
  },
  {
    id: "sku",
    name: "Surat Keterangan Usaha (SKU)",
    tags: ["KELURAHAN", "SOSIAL & EKONOMI"],
    requirements: [
      "Fotokopi KTP",
      "Fotokopi KK",
      "Surat Pernyataan Memiliki Usaha (Bermaterai)",
    ],
    requirementKeys: ["ktp", "kk", "pernyataan"],
    flow: "Masyarakat ➔ Kaling ➔ Kelurahan",
    flowSteps: ["masyarakat", "kaling", "kelurahan"],
    needsKaling: true,
    needsKelurahan: true,
    forwardTo: null,
    specificFields: [
      {
        name: "namaUsaha",
        label: "Nama Usaha",
        type: "text",
        placeholder: "Warung Makan Bahari",
      },
      {
        name: "jenisUsaha",
        label: "Jenis Usaha",
        type: "text",
        placeholder: "Kuliner / Perdagangan",
      },
      {
        name: "alamatUsaha",
        label: "Alamat Usaha",
        type: "textarea",
        placeholder: "Jl. Raya Sesetan No. 12, Denpasar",
      },
      {
        name: "tahunBerdiri",
        label: "Tahun Berdiri Usaha",
        type: "text",
        placeholder: "2020",
      },
    ],
    templateType: "pengantar_rtrw",
  },
  {
    id: "belum_menikah",
    name: "Surat Keterangan Belum Menikah",
    tags: ["KALING SAJA", "KEPENDUDUKAN"],
    requirements: [
      "Fotokopi KTP",
      "Fotokopi KK",
      "Surat Pernyataan Belum Menikah (Bermaterai)",
    ],
    requirementKeys: ["ktp", "kk", "pernyataan"],
    flow: "Masyarakat ➔ Kaling",
    flowSteps: ["masyarakat", "kaling"],
    needsKaling: true,
    needsKelurahan: false,
    forwardTo: null,
    specificFields: [
      {
        name: "keperluan",
        label: "Keperluan Surat",
        type: "text",
        placeholder: "Persyaratan melamar pekerjaan",
      },
    ],
    templateType: "pengantar_rtrw",
  },

  {
    id: "ktp_kk",
    name: "Surat Pengantar Pembuatan KTP/KK",
    tags: ["KELURAHAN", "KEPENDUDUKAN"],
    requirements: ["Dokumen pendukung sesuai keperluan"],
    requirementKeys: ["ktp"],
    flow: "Masyarakat ➔ Kaling ➔ Kelurahan",
    flowSteps: ["masyarakat", "kaling", "kelurahan"],
    needsKaling: true,
    needsKelurahan: true,
    forwardTo: null,
    specificFields: [
      {
        name: "jenisPermohonan",
        label: "Jenis Permohonan",
        type: "select",
        options: ["KTP Baru", "KTP Hilang/Rusak", "KK Baru", "KK Perubahan"],
      },
      {
        name: "keperluan",
        label: "Keperluan",
        type: "text",
        placeholder: "Pembuatan KTP baru karena usia 17 tahun",
      },
    ],
    templateType: "pengantar_rtrw",
  },
  {
    id: "waris",
    name: "Surat Keterangan Ahli Waris",
    tags: ["KELURAHAN", "UMUM"],
    requirements: [
      "Akta Kematian Pewaris",
      "Fotokopi KTP Ahli Waris",
      "Fotokopi KK",
      "Surat Pernyataan Ahli Waris (Bermaterai)",
    ],
    requirementKeys: ["aktaKematian", "ktp", "kk", "pernyataan"],
    flow: "Masyarakat ➔ Kaling ➔ Kelurahan",
    flowSteps: ["masyarakat", "kaling", "kelurahan"],
    needsKaling: true,
    needsKelurahan: true,
    forwardTo: null,
    specificFields: [
      {
        name: "namaPewaris",
        label: "Nama Pewaris (Almarhum)",
        type: "text",
        placeholder: "Nama lengkap almarhum",
      },
      {
        name: "hubunganDenganPewaris",
        label: "Hubungan dengan Pewaris",
        type: "select",
        options: ["Anak", "Istri/Suami", "Orang Tua", "Saudara Kandung"],
      },
      {
        name: "namaSaksi1",
        label: "Nama Saksi 1",
        type: "text",
        placeholder: "Nama lengkap saksi pertama",
      },
      {
        name: "namaSaksi2",
        label: "Nama Saksi 2",
        type: "text",
        placeholder: "Nama lengkap saksi kedua",
      },
    ],
    templateType: "pengantar_rtrw",
  },
  {
    id: "izin_keramaian",
    name: "Surat Pengantar Izin Keramaian",
    tags: ["KALING SAJA", "UMUM"],
    requirements: ["Fotokopi KTP", "Detail Susunan Acara"],
    requirementKeys: ["ktp"],
    flow: "Masyarakat ➔ Kaling",
    flowSteps: ["masyarakat", "kaling"],
    needsKaling: true,
    needsKelurahan: false,
    forwardTo: null,
    specificFields: [
      {
        name: "namaAcara",
        label: "Nama Acara",
        type: "text",
        placeholder: "Upacara Adat Ngaben",
      },
      { name: "tanggalAcara", label: "Tanggal Acara", type: "date" },
      {
        name: "lokasiAcara",
        label: "Lokasi Acara",
        type: "textarea",
        placeholder: "Banjar Tegal Gundul, Denpasar Selatan",
      },
      {
        name: "estimasiTamu",
        label: "Estimasi Jumlah Tamu",
        type: "text",
        placeholder: "200 orang",
      },
    ],
    templateType: "pengantar_rtrw",
  },
  {
    id: "beda_nama",
    name: "Surat Keterangan Beda Nama",
    tags: ["KELURAHAN", "UMUM"],
    requirements: [
      "Dokumen yang memuat nama berbeda",
      "Fotokopi KTP",
      "Fotokopi KK",
    ],
    requirementKeys: ["dokumenBedaNama", "ktp", "kk"],
    flow: "Masyarakat ➔ Kaling ➔ Kelurahan",
    flowSteps: ["masyarakat", "kaling", "kelurahan"],
    needsKaling: true,
    needsKelurahan: true,
    forwardTo: null,
    specificFields: [
      {
        name: "namaDiDokumen",
        label: "Nama di Dokumen Lain",
        type: "text",
        placeholder: "Nama yang tercantum berbeda",
      },
      {
        name: "namaDiKTP",
        label: "Nama Sesuai KTP",
        type: "text",
        placeholder: "Nama di KTP/KK saat ini",
      },
      {
        name: "dokumenYangBerbeda",
        label: "Jenis Dokumen yang Berbeda",
        type: "text",
        placeholder: "Ijazah SD / Sertifikat Tanah",
      },
    ],
    templateType: "pengantar_rtrw",
  },
  {
    id: "masih_hidup",
    name: "Surat Keterangan Masih Hidup",
    tags: ["KELURAHAN", "UMUM"],
    requirements: ["Fotokopi KTP", "Fotokopi KK"],
    requirementKeys: ["ktp", "kk"],
    flow: "Masyarakat ➔ Kelurahan",
    flowSteps: ["masyarakat", "kelurahan"],
    needsKaling: false,
    needsKelurahan: true,
    forwardTo: null,
    specificFields: [
      {
        name: "keperluan",
        label: "Keperluan Surat",
        type: "text",
        placeholder: "Pencairan dana pensiun",
      },
    ],
    templateType: "keterangan_kelurahan",
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────

/** Get a service by ID */
export const getServiceById = (id) => SERVICES.find((s) => s.id === id);

/** Get the icon component for a service */
export const getServiceIcon = (id) => SERVICE_ICONS[id] || null;

/** Get flow step label */
export const FLOW_STEP_LABELS = {
  masyarakat: "Masyarakat",
  kaling: "Kepala Lingkungan",
  kelurahan: "Kelurahan",
  kecamatan: "Kecamatan",
  disdukcapil: "Disdukcapil",
  kua: "KUA",
  polsek: "Polsek / Polres",
};
