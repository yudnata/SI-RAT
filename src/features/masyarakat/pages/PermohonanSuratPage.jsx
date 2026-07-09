import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../../utils/api.js";

const PermohonanSuratPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const selectedItemId = searchParams.get("item");

  const fetchList = async () => {
    try {
      const response = await api.get("/submissions?limit=100");
      setSubmissions(response.data.submissions || []);
    } catch (err) {
      console.error("Gagal mengambil daftar permohonan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!selectedItemId) {
        setSelectedItem(null);
        return;
      }
      setLoadingDetail(true);
      try {
        const response = await api.get(`/submissions/${selectedItemId}`);
        const active = response.data.submission;
        
        // Map backend timeline to frontend representation
        const steps = [];
        
        // 1. Diajukan
        const diajukan = active.timeline.find(t => t.action === "DIAJUKAN");
        steps.push({
          label: "Permohonan Dikirim",
          date: diajukan ? new Date(diajukan.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "",
          note: diajukan?.note || "Berhasil diserahkan secara digital",
          status: "done",
        });

        // 2. Kaling (if required)
        if (active.service.needsKaling) {
          const kalingDone = active.timeline.find(t => t.action === "DIVERIFIKASI_KALING");
          const kalingRejected = active.timeline.find(t => t.action === "DITOLAK_KALING");
          const isPendingKaling = active.status === "VERIFIKASI_KALING";
          
          let stepStatus = "pending";
          let note = "Menunggu verifikasi Kepala Lingkungan";
          let date = null;
          
          if (kalingDone) {
            stepStatus = "done";
            note = kalingDone.note || `Disetujui oleh Kepala Lingkungan (${active.assignedKaling?.namaLengkap || 'Kaling'})`;
            date = new Date(kalingDone.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
          } else if (kalingRejected) {
            stepStatus = "rejected";
            note = `Ditolak: ${kalingRejected.note}`;
            date = new Date(kalingRejected.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
          } else if (isPendingKaling) {
            stepStatus = "active";
            note = "Sedang diproses oleh Kepala Lingkungan setempat";
          }

          steps.push({
            label: "Verifikasi Kaling",
            date,
            note,
            status: stepStatus,
          });
        }

        // 3. Kelurahan (if required)
        if (active.service.needsKelurahan) {
          const kelurahanDone = active.timeline.find(t => t.action === "DIVALIDASI_KELURAHAN");
          const kelurahanRejected = active.timeline.find(t => t.action === "DITOLAK_KELURAHAN");
          const isPendingKelurahan = active.status === "VERIFIKASI_KELURAHAN";
          
          let stepStatus = "pending";
          let note = "Menunggu validasi Kelurahan";
          let date = null;
          
          if (kelurahanDone) {
            stepStatus = "done";
            note = kelurahanDone.note || `Divalidasi oleh Kelurahan (${active.assignedKelurahan?.namaLengkap || 'Lurah'})`;
            date = new Date(kelurahanDone.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
          } else if (kelurahanRejected) {
            stepStatus = "rejected";
            note = `Ditolak: ${kelurahanRejected.note}`;
            date = new Date(kelurahanRejected.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
          } else if (isPendingKelurahan) {
            stepStatus = "active";
            note = "Sedang diproses & diverifikasi pihak Kelurahan";
          }

          steps.push({
            label: "Validasi Kelurahan",
            date,
            note,
            status: stepStatus,
          });
        }

        // 4. Selesai
        let finalStatus = "pending";
        let finalNote = "Surat hasil akhir";
        let finalDate = null;

        if (active.status === "SELESAI") {
          finalStatus = "completed";
          finalNote = "Surat resmi selesai diterbitkan dan siap diunduh";
          finalDate = new Date(active.updatedAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
        } else if (active.status === "DITOLAK") {
          finalStatus = "rejected";
          const rejectReason = active.timeline.slice().reverse().find(t => t.action.startsWith("DITOLAK"))?.note || "Permohonan tidak memenuhi syarat";
          finalNote = `Ditolak: ${rejectReason}`;
          finalDate = new Date(active.updatedAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
        }

        steps.push({
          label: active.status === "DITOLAK" ? "Ditolak" : "Selesai",
          date: finalDate,
          note: finalNote,
          status: finalStatus,
        });

        setSelectedItem({
          ...active,
          dbId: active.id,
          name: active.service.name,
          id: active.submissionNumber,
          date: new Date(active.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
          timelineSteps: steps,
        });
      } catch (err) {
        console.error("Gagal mengambil detail permohonan:", err);
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchDetail();
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

  const handleDownload = async (id) => {
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

  // Stats calculation
  const stats = useMemo(() => {
    const total = submissions.length;
    const processing = submissions.filter(s => ["DIPROSES", "VERIFIKASI_KALING", "VERIFIKASI_KELURAHAN"].includes(s.status)).length;
    const completed = submissions.filter(s => s.status === "SELESAI").length;
    const rejected = submissions.filter(s => s.status === "DITOLAK").length;
    return [
      { label: "Total Pengajuan", val: total },
      { label: "Diproses", val: processing },
      { label: "Selesai", val: completed },
      { label: "Ditolak", val: rejected },
    ];
  }, [submissions]);

  if (selectedItemId) {
    if (loadingDetail) {
      return (
        <div className="w-full text-center py-20 text-xs text-gray-400 font-medium">
          Memuat rincian permohonan...
        </div>
      );
    }

    if (!selectedItem) {
      return (
        <div className="w-full text-center py-20 text-xs text-gray-400 font-medium">
          Rincian permohonan tidak ditemukan.
          <button onClick={closeDetail} className="block mx-auto mt-2 text-blue-600 font-bold hover:underline">
            Kembali ke Daftar
          </button>
        </div>
      );
    }

    return (
      <div className="w-full space-y-6 pb-8">
        {/* Breadcrumb + Back Button */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={closeDetail}
            className="inline-flex items-center gap-2 self-start px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors"
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
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            Kembali ke Daftar Permohonan
          </button>

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
                {selectedItem.timelineSteps.map((step, idx) => {
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
                        {idx < selectedItem.timelineSteps.length - 1 && (
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
                  <button 
                    onClick={() => handleDownload(selectedItem.dbId)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-colors text-sm"
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
                    Unduh Surat Hasil Akhir (PDF)
                  </button>
                </>
              ) : selectedItem.status === "DITOLAK" ? (
                <div className="flex-1 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl text-center">
                  Permohonan ditolak. Silakan ajukan permohonan baru dengan berkas yang benar.
                </div>
              ) : (
                <div className="flex-1 p-3.5 bg-gray-50 border border-gray-200 text-gray-500 text-xs font-semibold rounded-xl text-center">
                  Permohonan sedang diproses oleh petugas kelurahan/Kaling.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Data Form & Berkas */}
          <div className="space-y-6">
            {/* Data Detail Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">
                Identitas Pemohon
              </h3>
              <div className="space-y-3.5">
                {[
                  { label: "Nama Lengkap", value: selectedItem.user.namaLengkap },
                  { label: "NIK", value: selectedItem.user.nik },
                  { label: "Alamat", value: selectedItem.user.alamat },
                  { label: "Pekerjaan", value: selectedItem.user.pekerjaan },
                ].map((item, idx) => (
                  <div key={idx}>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-xs font-semibold text-gray-700 mt-0.5">
                      {item.value || "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Specific Fields */}
            {Object.keys(selectedItem.formData).length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">
                  Formulir Khusus
                </h3>
                <div className="space-y-3.5">
                  {Object.entries(selectedItem.formData).map(([key, value]) => {
                    // Try to resolve human-readable label
                    const matchedField = selectedItem.service.specificFields?.find(f => f.name === key);
                    const label = matchedField ? matchedField.label : key.replace(/([A-Z])/g, " $1");
                    
                    return (
                      <div key={key}>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider capitalize">
                          {label}
                        </p>
                        <p className="text-xs font-semibold text-gray-700 mt-0.5">
                          {value || "—"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Berkas Lampiran Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">
                Dokumen Lampiran
              </h3>
              <div className="space-y-2.5">
                {selectedItem.documents.length > 0 ? (
                  selectedItem.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between p-2.5 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/10 transition-all group"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 flex-shrink-0 transition-colors">
                          <svg
                            className="w-4.5 h-4.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                            />
                          </svg>
                        </div>
                        <span className="text-xs font-medium text-gray-700 truncate pr-2">
                          {doc.documentLabel}
                        </span>
                      </div>
                      <svg
                        className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0"
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
                  ))
                ) : (
                  <p className="text-[10px] text-gray-400">Tidak ada lampiran berkas khusus.</p>
                )}
              </div>
            </div>
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
        {stats.map((stat) => (
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
        </div>

        {/* List items */}
        {loading ? (
          <div className="text-center py-8 text-xs text-gray-400 font-medium">
            Memuat daftar permohonan...
          </div>
        ) : submissions.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {submissions.map((item) => {
              const badgeClass =
                item.status === "SELESAI"
                  ? "border border-emerald-500 text-emerald-600"
                  : item.status === "DITOLAK"
                    ? "border border-red-500 text-red-650"
                    : "border border-amber-500 text-amber-600";

              return (
                <button
                  key={item.id}
                  onClick={() => updateQuery({ item: item.id })}
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
                        {item.service.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                        ID: {item.submissionNumber} • {new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
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
        ) : (
          <div className="text-center py-12">
            <p className="text-xs text-gray-400 font-medium">Belum ada riwayat permohonan surat.</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Silakan pilih menu Ajukan Surat untuk membuat permohonan baru.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermohonanSuratPage;
