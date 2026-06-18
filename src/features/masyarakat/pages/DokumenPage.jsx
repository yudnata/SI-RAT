import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const DUMMY_PERSONAL_DOCS = [
  {
    id: "ktp",
    name: "KTP (Kartu Tanda Penduduk)",
    number: "3174011204920005",
    type: "Identitas Diri",
    bgClass: "from-rose-500 to-red-600 text-white",
    verified: true,
    layout: "ktp",
  },
  {
    id: "kk",
    name: "KK (Kartu Keluarga)",
    number: "3276010509120001",
    type: "Identitas Diri",
    bgClass: "from-blue-500 to-cyan-600 text-white",
    verified: true,
    layout: "kk",
  },
  {
    id: "sim",
    name: "SIM (Surat Izin Mengemudi)",
    number: "112101345678",
    type: "Identitas Diri",
    bgClass: "from-emerald-400 to-teal-600 text-white",
    verified: true,
    layout: "sim",
  },
  {
    id: "akta",
    name: "Akta Kelahiran",
    number: "AK-20240512-001",
    type: "Identitas Diri",
    bgClass: "from-indigo-500 to-purple-600 text-white",
    verified: true,
    layout: "akta",
  },
  {
    id: "npwp",
    name: "NPWP",
    number: "91.123.456.7-012.000",
    type: "Identitas Diri",
    bgClass: "from-amber-400 to-amber-600 text-slate-900",
    verified: true,
    layout: "npwp",
  },
];

const DUMMY_ISSUED_DOCS = [
  {
    id: "sktm",
    name: "Surat Keterangan Tidak Mampu (SKTM)",
    issuer: "Kelurahan Panjer",
    date: "23 Okt 2026",
    status: "Selesai",
  },
  {
    id: "domisili",
    name: "Surat Keterangan Domisili",
    issuer: "Kelurahan Panjer",
    date: "05 Sep 2023",
    status: "Selesai",
  },
];

const DOC_STYLES = {
  KTP: {
    bgClass: "from-rose-500 to-red-600 text-white",
    name: "KTP (Kartu Tanda Penduduk)",
  },
  KK: {
    bgClass: "from-blue-500 to-cyan-600 text-white",
    name: "KK (Kartu Keluarga)",
  },
  SIM: {
    bgClass: "from-emerald-400 to-teal-600 text-white",
    name: "SIM (Surat Izin Mengemudi)",
  },
  "Akta Kelahiran": {
    bgClass: "from-indigo-500 to-purple-600 text-white",
    name: "Akta Kelahiran",
  },
  NPWP: { bgClass: "from-amber-400 to-amber-600 text-slate-900", name: "NPWP" },
  "BPJS / KIS": {
    bgClass: "from-teal-500 to-emerald-600 text-white",
    name: "BPJS / KIS (Kesehatan)",
  },
  "Pas Foto": {
    bgClass: "from-slate-700 to-slate-900 text-white",
    name: "Pas Foto Resmi",
  },
  Ijazah: {
    bgClass: "from-violet-500 to-fuchsia-600 text-white",
    name: "Ijazah Terakhir",
  },
  Lainnya: {
    bgClass: "from-gray-500 to-gray-700 text-white",
    name: "Dokumen Lainnya",
  },
};

const DokumenPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "Semua";
  const [personalDocs, setPersonalDocs] = useState(DUMMY_PERSONAL_DOCS);
  const isModalOpen = searchParams.get("modal") === "add";

  // Form state
  const [docType, setDocType] = useState("KTP");
  const [docName, setDocName] = useState(DOC_STYLES["KTP"].name);
  const [docNumber, setDocNumber] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const styleInfo = DOC_STYLES[docType] || {
      bgClass: "from-gray-500 to-gray-700 text-white",
      name: docName,
    };
    const newDoc = {
      id: Math.random().toString(36).substring(2, 9),
      name: docName || styleInfo.name,
      number: docNumber || "Tidak ada nomor",
      type: "Identitas Diri",
      bgClass: styleInfo.bgClass,
      verified: false,
      layout: docType.toLowerCase(),
    };
    setPersonalDocs([newDoc, ...personalDocs]);
    updateQuery({ modal: "" });

    // Reset form
    setDocType("KTP");
    setDocName(DOC_STYLES["KTP"].name);
    setDocNumber("");
    setUploadedFile(null);
  };

  const filteredPersonalDocs = personalDocs;
  const filteredIssuedDocs = DUMMY_ISSUED_DOCS;

  return (
    <div className="w-full space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Dokumen Saya</h1>
        <p className="text-gray-400 text-xs mt-0.5">
          Kelola, lihat, dan unduh seluruh dokumen kependudukan Anda secara
          digital dan aman.
        </p>
      </div>

      {/* Filter and Sort buttons */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex gap-2">
          {["Semua", "Identitas Diri", "Dokumen Terbit"].map((t) => (
            <button
              key={t}
              onClick={() => updateQuery({ filter: t })}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200
                ${
                  filter === t
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
            />
          </svg>
          Urutkan
        </button>
      </div>

      {/* Section: Identitas Diri */}
      {(filter === "Semua" || filter === "Identitas Diri") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                />
              </svg>
              Identitas Diri
            </h2>
            <button
            onClick={() => updateQuery({ modal: "add" })}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
            >
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
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Tambah Dokumen Pribadi
            </button>
          </div>

          {/* Cards Grid - Changed to 4 columns layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPersonalDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-gray-300 transition-all flex flex-col"
              >
                {/* Visual Card Component wrapper */}
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-center">
                  <div
                    className={`w-full aspect-[1.58/1] rounded-xl bg-gradient-to-br p-3.5 shadow-md flex flex-col justify-between relative overflow-hidden ${doc.bgClass}`}
                  >
                    {/* Decorative Card Elements */}
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-black/10 blur-md"></div>

                    {/* Card Header */}
                    <div className="flex items-start justify-between relative z-10">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center backdrop-blur-sm">
                          <svg
                            className="w-3 h-3 text-current"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                            />
                          </svg>
                        </div>
                        <span className="text-[9px] font-bold tracking-widest uppercase opacity-90">
                          REPUBLIK INDONESIA
                        </span>
                      </div>
                      <div className="w-4 h-5 opacity-40">
                        {/* Garuda placeholder representation */}
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L9 7h6l-3-5zm0 20l3-5H9l3 5zm9-9l-5-3v6l5-3zm-18 0l5 3v-6l-5 3z" />
                        </svg>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="relative z-10 flex gap-3 items-end">
                      {/* Photo Placeholder */}
                      <div className="w-9 h-11 bg-white/20 rounded border border-white/30 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                        <svg
                          className="w-6 h-6 opacity-60"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"
                          />
                        </svg>
                      </div>

                      {/* Text Details */}
                      <div className="flex-1 min-w-0 leading-none space-y-1">
                        <p className="text-[7px] uppercase font-bold tracking-wider opacity-60">
                          Identity Card
                        </p>
                        <p className="text-[10px] font-extrabold tracking-wide truncate uppercase">
                          {doc.name.split(" ")[0]}
                        </p>
                        <div className="h-0.5 w-8 bg-white/30 rounded"></div>
                        <p className="text-[8px] font-mono tracking-wider opacity-85">
                          {doc.number}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-xs font-bold text-gray-800 truncate">
                        {doc.name}
                      </h3>
                    </div>
                    <p className="text-xs font-mono text-gray-400 mb-4">
                      {doc.number}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors text-center">
                      Lihat Detail
                    </button>
                    <button
                      className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-colors"
                      aria-label="Unduh Dokumen"
                    >
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
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section: Dokumen Terbit */}
      {(filter === "Semua" || filter === "Dokumen Terbit") && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Dokumen Terbit
          </h2>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Nama Dokumen</th>
                    <th className="px-6 py-4">Instansi Penerbit</th>
                    <th className="px-6 py-4">Tanggal Terbit</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {filteredIssuedDocs.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <span className="text-blue-600 flex-shrink-0">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                            />
                          </svg>
                        </span>
                        <span className="font-semibold text-gray-800">
                          {doc.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{doc.issuer}</td>
                      <td className="px-6 py-4 text-gray-500">{doc.date}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 border border-emerald-500 rounded-md text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2.5">
                          <button
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all"
                            aria-label="Lihat Dokumen"
                          >
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
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </button>
                          <button
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                            aria-label="Unduh Dokumen"
                          >
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
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Dokumen */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 flex flex-col gap-4 relative animate-scaleIn">
            {/* Close button */}
            <button
              onClick={() => updateQuery({ modal: "" })}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div>
              <h3 className="text-base font-bold text-gray-900">
                Tambah Dokumen Pribadi
              </h3>
              <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                Unggah dokumen kependudukan utama Anda untuk mempermudah
                pendaftaran dan mempercepat verifikasi permohonan surat.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-750 mb-1">
                  Jenis Dokumen
                </label>
                <select
                  value={docType}
                  onChange={(e) => {
                    setDocType(e.target.value);
                    setDocName(DOC_STYLES[e.target.value]?.name || "");
                  }}
                  className="w-full px-3 py-2 border border-gray-205 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {Object.keys(DOC_STYLES).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-750 mb-1">
                  Nama Dokumen
                </label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="Contoh: KTP Utama, KK Asli"
                  className="w-full px-3 py-2 border border-gray-205 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-750 mb-1">
                  Nomor Dokumen / NIK (Opsional)
                </label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="Masukkan nomor identitas jika ada"
                  className="w-full px-3 py-2 border border-gray-205 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-750 mb-1">
                  Unggah File Dokumen
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    onChange={(e) => setUploadedFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <svg
                    className="w-8 h-8 text-gray-400 mb-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                    />
                  </svg>
                  <span className="text-xs font-semibold text-gray-700">
                    {uploadedFile
                      ? uploadedFile.name
                      : "Pilih file atau drag & drop"}
                  </span>
                  <span className="text-[9px] text-gray-400 mt-0.5">
                    PNG, JPG, PDF (Maks. 5MB)
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => updateQuery({ modal: "" })}
                  className="flex-1 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                >
                  Simpan Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DokumenPage;
