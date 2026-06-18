import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const DUMMY_SUBMISSIONS = [
  {
    id: "#CL-2026-10-23",
    name: "Surat Keterangan Tidak Mampu (SKTM)",
    date: "23 Okt 2026",
    status: "DIPROSES",
    keperluan: "Pengajuan Beasiswa Pendidikan Anak ke SMA Negeri",
    timeline: [
      {
        label: "Permohonan Dikirim",
        date: "23 Okt 2026, 14:05",
        note: "Berhasil diserahkan secara digital",
        status: "done",
      },
      {
        label: "Verifikasi Kaling",
        date: "23 Okt 2026, 17:30",
        note: "Disetujui dan diteruskan oleh Kepala Lingkungan (Banjar Tegal)",
        status: "done",
      },
      {
        label: "Validasi Kelurahan",
        date: "Sedang Berjalan",
        note: "Menunggu tanda tangan dan validasi Lurah Panjer",
        status: "active",
      },
      {
        label: "Selesai",
        date: null,
        note: "Surat siap diambil atau diunduh",
        status: "pending",
      },
    ],
  },
  {
    id: "#CL-2023-0892",
    name: "Surat Keterangan Domisili",
    date: "14 Okt 2023",
    status: "SELESAI",
    keperluan: "Persyaratan Pembukaan Rekening Bank",
    timeline: [
      {
        label: "Permohonan Dikirim",
        date: "14 Okt 2023, 08:30",
        note: "Berhasil diserahkan",
        status: "done",
      },
      {
        label: "Verifikasi Kaling",
        date: "14 Okt 2023, 10:15",
        note: "Disetujui oleh Kepala Lingkungan",
        status: "done",
      },
      {
        label: "Validasi Kelurahan",
        date: "14 Okt 2023, 14:00",
        note: "Selesai divalidasi lurah",
        status: "done",
      },
      {
        label: "Selesai",
        date: "14 Okt 2023, 15:30",
        note: "Surat dapat diunduh digital",
        status: "completed",
      },
    ],
  },
  {
    id: "#CL-2023-0912",
    name: "Permohonan KTP Baru (Rusak)",
    date: "22 Okt 2023",
    status: "DIPROSES",
    keperluan: "KTP Lama Mengalami Kerusakan Fisik / Patah",
    timeline: [
      {
        label: "Permohonan Dikirim",
        date: "22 Okt 2023, 11:00",
        note: "Berhasil diserahkan",
        status: "done",
      },
      {
        label: "Verifikasi Kaling",
        date: "23 Okt 2023, 08:00",
        note: "Disetujui Kepala Lingkungan",
        status: "done",
      },
      {
        label: "Validasi Kelurahan",
        date: "Sedang Berjalan",
        note: "Menunggu antrean pencetakan KTP baru",
        status: "active",
      },
      {
        label: "Selesai",
        date: null,
        note: "KTP siap diambil di Kelurahan",
        status: "pending",
      },
    ],
  },
  {
    id: "#CL-2023-0905",
    name: "Pembaruan Kartu Keluarga",
    date: "18 Okt 2023",
    status: "DITOLAK",
    keperluan: "Penambahan Anggota Keluarga Baru (Kelahiran Anak)",
    timeline: [
      {
        label: "Permohonan Dikirim",
        date: "18 Okt 2023, 09:15",
        note: "Berhasil diserahkan",
        status: "done",
      },
      {
        label: "Verifikasi Kaling",
        date: "18 Okt 2023, 11:30",
        note: "Ditolak karena berkas Akta Lahir kurang jelas/buram",
        status: "rejected",
      },
      {
        label: "Validasi Kelurahan",
        date: null,
        note: "Pengajuan dibatalkan",
        status: "pending",
      },
      {
        label: "Selesai",
        date: null,
        note: "Silakan ajukan kembali dengan berkas baru",
        status: "pending",
      },
    ],
  },
  {
    id: "#CL-2023-0850",
    name: "Surat Keterangan Usaha (SKU)",
    date: "05 Okt 2023",
    status: "SELESAI",
    keperluan: "Pengajuan Kredit Usaha Rakyat (KUR) BRI",
    timeline: [
      {
        label: "Permohonan Dikirim",
        date: "05 Okt 2023, 10:00",
        note: "Berhasil diserahkan",
        status: "done",
      },
      {
        label: "Verifikasi Kaling",
        date: "05 Okt 2023, 12:00",
        note: "Disetujui Kepala Lingkungan",
        status: "done",
      },
      {
        label: "Validasi Kelurahan",
        date: "05 Okt 2023, 15:00",
        note: "Telah ditandatangani Lurah",
        status: "done",
      },
      {
        label: "Selesai",
        date: "05 Okt 2023, 16:30",
        note: "Dokumen digital terbit",
        status: "completed",
      },
    ],
  },
];

const PermohonanSuratPage = ({ user }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedItemId = searchParams.get("item");
  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null;

    return DUMMY_SUBMISSIONS.find(
      (item) => item.id.replace(/^#/, "") === selectedItemId,
    ) ?? null;
  }, [selectedItemId]);

  const updateQuery = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    navigate({ search: next.toString() }, { replace: true });
  };

  const closeDetail = () => {
    updateQuery({ item: "" });
  };

  if (selectedItem) {
    return (
      <div className="w-full space-y-6 pb-8">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
          <button
            onClick={closeDetail}
            className="hover:text-blue-600 transition-colors"
          >
            Permohonan Surat Saya
          </button>
          <span>&gt;</span>
          <span className="text-gray-600 font-semibold">
            {selectedItem.name}
          </span>
        </div>

        {/* Page layout: 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Timeline */}
          <div className="md:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Status Pengajuan
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Lacak perkembangan surat Anda secara real-time.
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-right flex-shrink-0">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    ID Pengajuan
                  </p>
                  <p className="text-xs font-mono font-bold text-gray-700">
                    {selectedItem.id}
                  </p>
                </div>
              </div>

              {/* Timeline list */}
              <div className="space-y-0 pl-2">
                {selectedItem.timeline.map((step, idx) => {
                  let badgeColor = "bg-gray-100 text-gray-500";
                  let iconBg = "bg-gray-200";
                  let iconMarkup;

                  if (step.status === "done" || step.status === "completed") {
                    badgeColor = "border border-blue-500 text-blue-600";
                    iconBg = "bg-blue-600";
                    iconMarkup = (
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    );
                  } else if (step.status === "active") {
                    badgeColor = "border border-amber-500 text-amber-600";
                    iconBg = "bg-amber-500 animate-pulse";
                    iconMarkup = (
                      <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    );
                  } else if (step.status === "rejected") {
                    badgeColor = "border border-red-500 text-red-650";
                    iconBg = "bg-red-600";
                    iconMarkup = (
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    );
                  } else {
                    iconMarkup = (
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    );
                  }

                  return (
                    <div key={idx} className="flex gap-4">
                      {/* Vertical line indicator */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}
                        >
                          {iconMarkup}
                        </div>
                        {idx < selectedItem.timeline.length - 1 && (
                          <div
                            className={`w-0.5 flex-1 my-1.5 ${step.status === "done" || step.status === "completed" ? "bg-blue-400" : "bg-gray-200"}`}
                            style={{ minHeight: "36px" }}
                          />
                        )}
                      </div>

                      {/* Content details */}
                      <div className="pb-6 flex-1 flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-gray-800">
                            {step.label}
                          </p>
                          <p className="text-xs text-gray-400 font-medium">
                            {step.note}
                          </p>
                          {step.date && (
                            <p className="text-[10px] text-gray-300 font-mono">
                              {step.date}
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${badgeColor}`}
                        >
                          {step.status === "done" || step.status === "completed"
                            ? "Selesai"
                            : step.status === "active"
                              ? "Sedang Diproses"
                              : step.status === "rejected"
                                ? "Ditolak"
                                : "Menunggu"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action buttons — conditional on status */}
            <div className="border-t border-gray-100 pt-6 mt-6 flex gap-3">
              {selectedItem.status === "SELESAI" ? (
                <>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-colors text-sm">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    Unduh Surat Keterangan (PDF)
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 font-bold rounded-xl transition-all text-sm">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.72 13.844l-.234-.112a2.22 2.22 0 010-3.96l.234-.113A2.25 2.25 0 007.875 7.65V7.5a2.25 2.25 0 014.5 0v.15a2.25 2.25 0 001.155 1.96l.234.113a2.22 2.22 0 010 3.96l-.234.112a2.25 2.25 0 00-1.155 1.96v.15a2.25 2.25 0 01-4.5 0v-.15a2.25 2.25 0 00-1.155-1.96z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5"
                      />
                    </svg>
                    Cetak
                  </button>
                </>
              ) : (
                <>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition-all text-sm">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.72 13.844l-.234-.112a2.22 2.22 0 010-3.96l.234-.113A2.25 2.25 0 007.875 7.65V7.5a2.25 2.25 0 014.5 0v.15a2.25 2.25 0 001.155 1.96l.234.113a2.22 2.22 0 010 3.96l-.234.112a2.25 2.25 0 00-1.155 1.96v.15a2.25 2.25 0 01-4.5 0v-.15a2.25 2.25 0 00-1.155-1.96z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5"
                      />
                    </svg>
                    Cetak Bukti Pendaftaran
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition-all text-sm">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Hubungi Admin
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Details & Info */}
          <div className="space-y-6">
            {/* Detail Berkas Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">
                Detail Berkas
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                    NIK PEMOHON
                  </p>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">
                    {user?.nik ?? "3275012345678901"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                    NAMA LENGKAP
                  </p>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">
                    {user?.name ?? "Budi Santoso"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                    JENIS SURAT
                  </p>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">
                    {selectedItem.name}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                    KEPERLUAN
                  </p>
                  <p className="text-xs font-semibold text-gray-600 mt-0.5 leading-relaxed">
                    {selectedItem.keperluan}
                  </p>
                </div>
              </div>
            </div>

            {/* Info Panel — conditional on status */}
            {selectedItem.status === "SELESAI" ? (
              <div className="bg-blue-600 rounded-2xl p-5 space-y-3 text-white">
                <div className="flex gap-2 items-center">
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Surat Keterangan Siap
                  </h4>
                </div>
                <p className="text-xs leading-relaxed font-medium opacity-90">
                  Surat Keterangan resmi telah ditandatangani Lurah dan siap
                  Anda unduh. Tidak perlu datang ke kantor kelurahan.
                </p>
                <div className="border-t border-white/20 pt-3">
                  <p className="text-[10px] font-bold opacity-70 uppercase tracking-wide">
                    Catatan
                  </p>
                  <p className="text-[10px] opacity-80 mt-1">
                    Jika kelurahan menerapkan TTD basah, petugas akan
                    menghubungi Anda untuk pengambilan fisik.
                  </p>
                </div>
              </div>
            ) : selectedItem.status === "DITOLAK" ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-3">
                <div className="flex gap-2 items-center">
                  <svg
                    className="w-5 h-5 text-red-600 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                  <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider">
                    Permohonan Ditolak
                  </h4>
                </div>
                <p className="text-xs text-red-600 leading-relaxed font-medium">
                  Periksa alasan penolakan di timeline, perbaiki berkas, lalu
                  ajukan kembali.
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-3">
                <div className="flex gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                  <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mt-0.5">
                    Sedang Diproses
                  </h4>
                </div>
                <p className="text-xs text-blue-700 leading-relaxed font-medium">
                  Berkas Anda sedang dalam proses verifikasi. Tidak perlu datang
                  ke kantor — Anda akan mendapat notifikasi saat surat selesai
                  dan siap diunduh.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors pt-1"
                >
                  Lihat Lokasi Kantor
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">
          Permohonan Surat Saya
        </h1>
        <p className="text-gray-400 text-xs mt-0.5">
          Pantau status pengajuan surat dan dokumen kependudukan Anda secara
          real-time. Riwayat ini mencakup semua aktivitas yang telah Anda
          kirimkan.
        </p>
      </div>

      {/* Stats summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Pengajuan", val: "24" },
          { label: "Diproses", val: "3" },
          { label: "Selesai", val: "19" },
          { label: "Ditolak", val: "2" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between"
          >
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="text-2xl font-extrabold text-gray-900 mt-2">
              {stat.val}
            </p>
          </div>
        ))}
      </div>

      {/* Daftar Riwayat card container */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-50 pb-4">
          <h2 className="text-sm font-bold text-gray-800">Daftar Riwayat</h2>
          <div className="flex gap-2">
            <button className="px-3.5 py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-lg text-[10px] font-bold text-gray-600 transition-colors">
              Filter
            </button>
            <button className="px-3.5 py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-lg text-[10px] font-bold text-gray-600 transition-colors">
              Urutkan
            </button>
          </div>
        </div>

        {/* List items */}
        <div className="divide-y divide-gray-100">
          {DUMMY_SUBMISSIONS.map((item) => {
            const badgeClass =
              item.status === "SELESAI"
                ? "border border-emerald-500 text-emerald-600"
                : item.status === "DITOLAK"
                  ? "border border-red-500 text-red-650"
                  : "border border-amber-500 text-amber-600";

            return (
              <button
                key={item.id}
                onClick={() => updateQuery({ item: item.id.replace(/^#/, "") })}
                className="w-full text-left py-4 flex items-center justify-between group hover:bg-gray-50/50 transition-all px-2.5 rounded-lg -mx-2.5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                      ID: {item.id} • {item.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-widest ${badgeClass}`}
                  >
                    {item.status}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>

        {/* Load more button */}
        <div className="border-t border-gray-100 pt-4 text-center">
          <button className="text-xs font-bold text-gray-500 hover:text-slate-800 transition-colors">
            Lihat Semua Riwayat
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermohonanSuratPage;
