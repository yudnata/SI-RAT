import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../../utils/api.js";

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
  AKTA: {
    bgClass: "from-indigo-500 to-purple-600 text-white",
    name: "Akta Kelahiran",
  },
  NPWP: { 
    bgClass: "from-amber-400 to-amber-600 text-slate-900", 
    name: "NPWP" 
  },
  BPJS: {
    bgClass: "from-teal-500 to-emerald-600 text-white",
    name: "BPJS / KIS (Kesehatan)",
  },
  LAINNYA: {
    bgClass: "from-gray-500 to-gray-700 text-white",
    name: "Dokumen Lainnya",
  },
};

const DokumenPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "Semua";
  const isModalOpen = searchParams.get("modal") === "add";

  const [personalDocs, setPersonalDocs] = useState([]);
  const [issuedDocs, setIssuedDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form state
  const [docType, setDocType] = useState("KTP");
  const [docName, setDocName] = useState(DOC_STYLES["KTP"].name);
  const [docNumber, setDocNumber] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch personal documents
      const docsRes = await api.get("/users/documents");
      const mappedDocs = (docsRes.data.documents || []).map((d) => {
        const key = d.documentKey.toUpperCase();
        const style = DOC_STYLES[key] || DOC_STYLES.LAINNYA;
        return {
          id: d.id,
          name: d.documentName,
          key: d.documentKey,
          number: docNumber || d.documentKey.toUpperCase(),
          type: "Identitas Diri",
          bgClass: style.bgClass,
          fileUrl: d.fileUrl,
          fileName: d.fileName,
        };
      });
      setPersonalDocs(mappedDocs);

      // 2. Fetch completed submissions for issued documents
      const subRes = await api.get("/submissions?limit=100&status=SELESAI");
      const mappedIssued = (subRes.data.submissions || []).map((s) => ({
        id: s.id,
        name: s.service.name,
        issuer: s.service.needsKelurahan ? "Kelurahan Panjer" : "Kepala Lingkungan",
        date: new Date(s.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        status: "Selesai",
        submissionNumber: s.submissionNumber,
      }));
      setIssuedDocs(mappedIssued);
    } catch (err) {
      console.error("Gagal memuat data dokumen:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleAddDocument = async (e) => {
    e.preventDefault();
    if (!uploadedFile) {
      setErrorMsg("Harap pilih berkas file dokumen terlebih dahulu!");
      return;
    }

    setUploading(true);
    setErrorMsg("");

    try {
      const payload = new FormData();
      payload.append("file", uploadedFile);
      payload.append("documentKey", docType.toLowerCase());
      payload.append("documentName", docName);

      await api.post("/users/documents", payload, true);
      
      updateQuery({ modal: "" });
      setDocType("KTP");
      setDocName(DOC_STYLES["KTP"].name);
      setDocNumber("");
      setUploadedFile(null);
      
      fetchData(); // Reload
    } catch (err) {
      setErrorMsg(err.message || "Gagal mengunggah dokumen pribadi.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) return;
    try {
      await api.delete(`/users/documents/${id}`);
      fetchData();
    } catch (err) {
      alert(err.message || "Gagal menghapus dokumen.");
    }
  };

  const handleDownloadIssued = async (id) => {
    try {
      const response = await api.get(`/submissions/${id}/download`);
      if (response.data && response.data.url) {
        window.open(response.data.url, "_blank");
      } else {
        alert("Dokumen tidak ditemukan!");
      }
    } catch (err) {
      alert(err.message || "Gagal mengunduh berkas.");
    }
  };

  const filteredPersonalDocs = useMemo(() => {
    return personalDocs;
  }, [personalDocs]);

  const filteredIssuedDocs = useMemo(() => {
    return issuedDocs;
  }, [issuedDocs]);

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
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-gray-400 font-medium">
          Memuat data berkas dokumen...
        </div>
      ) : (
        <>
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

              {/* Cards Grid */}
              {filteredPersonalDocs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredPersonalDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-gray-300 transition-all flex flex-col"
                    >
                      {/* Visual Card Component */}
                      <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-center">
                        <div
                          className={`w-full aspect-[1.58/1] rounded-xl bg-gradient-to-br p-3.5 shadow-md flex flex-col justify-between relative overflow-hidden ${doc.bgClass}`}
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
                          <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-black/10 blur-md"></div>

                          {/* Card Header */}
                          <div className="flex items-start justify-between relative z-10">
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center backdrop-blur-sm">
                                <svg
                                  className="w-3 h-3 text-white"
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
                          </div>

                          {/* Card Body */}
                          <div className="relative z-10 flex gap-3 items-end">
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

                            <div className="flex-1 min-w-0 leading-none space-y-1">
                              <p className="text-[7px] uppercase font-bold tracking-wider opacity-60">
                                DOKUMEN WARGA
                              </p>
                              <p className="text-[10px] font-extrabold tracking-wide truncate uppercase">
                                {doc.name.split(" ")[0]}
                              </p>
                              <div className="h-0.5 w-8 bg-white/30 rounded"></div>
                              <p className="text-[8px] font-mono tracking-wider opacity-85">
                                {doc.key.toUpperCase()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Content Details */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xs font-bold text-gray-800 truncate">
                            {doc.name}
                          </h3>
                          <p className="text-[10px] text-gray-400 mt-1 truncate">
                            {doc.fileName}
                          </p>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-650 hover:bg-gray-50 text-center transition-colors"
                          >
                            Lihat Berkas
                          </a>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="p-2 border border-gray-200 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            aria-label="Hapus Dokumen"
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
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-xs text-gray-400 font-medium">
                  Belum ada dokumen pribadi yang diunggah.
                </div>
              )}
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
                Dokumen Hasil Layanan (Telah Terbit)
              </h2>

              {filteredIssuedDocs.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                          <th className="px-6 py-4">Nama Surat</th>
                          <th className="px-6 py-4">Penerbit</th>
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
                              <button
                                onClick={() => handleDownloadIssued(doc.id)}
                                className="inline-flex items-center justify-center p-2 border border-gray-250 rounded-lg text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
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
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-xs text-gray-400 font-medium">
                  Belum ada dokumen surat hasil layanan yang diterbitkan.
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal Tambah Dokumen */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 flex flex-col gap-4 relative animate-scaleIn">
            <button
              onClick={() => {
                updateQuery({ modal: "" });
                setErrorMsg("");
              }}
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

            <form onSubmit={handleAddDocument} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                  {errorMsg}
                </div>
              )}

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
                  className="w-full px-3 py-2 border border-gray-205 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
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
                  Unggah File Dokumen
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setUploadedFile(e.target.files[0]);
                      }
                    }}
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
                  onClick={() => {
                    updateQuery({ modal: "" });
                    setErrorMsg("");
                  }}
                  disabled={uploading}
                  className="flex-1 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                >
                  {uploading ? "Mengunggah..." : "Simpan Dokumen"}
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
