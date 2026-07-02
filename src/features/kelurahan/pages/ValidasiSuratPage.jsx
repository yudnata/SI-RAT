import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../../utils/api.js";
import {
  SERVICES,
  getServiceIcon,
} from "../../../data/serviceData.jsx";
import DocumentPreviewModal from "../../../components/DocumentPreviewModal";

const DetailModal = ({ item, service, onClose, onApprove, onReject }) => {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [signatureMethod, setSignatureMethod] = useState("tte"); // 'tte' or 'upload'
  const [passphrase, setPassphrase] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const approveLabel = service.forwardTo
    ? `Validasi & Teruskan`
    : "Validasi & Terbitkan Surat Resmi";

  const handleValidationApprove = async () => {
    if (signatureMethod === "tte" && !passphrase) {
      alert("Harap masukkan Passphrase TTE!");
      return;
    }
    if (signatureMethod === "upload" && !uploadedFile) {
      alert("Harap pilih berkas file tanda tangan basah!");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      if (signatureMethod === "tte") {
        await onApprove(item, { method: "tte", passphrase });
      } else {
        await onApprove(item, { method: "upload", file: uploadedFile });
      }
      onClose();
    } catch (err) {
      setSubmitError(err.message || "Gagal memproses validasi surat.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleValidationReject = async () => {
    if (!rejectReason) {
      alert("Harap isi alasan penolakan!");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      await onReject(item, rejectReason);
      onClose();
    } catch (err) {
      setSubmitError(err.message || "Gagal memproses penolakan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-7 pt-6 pb-4 border-b border-gray-100 flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Validasi Permohonan
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Verifikasi seluruh berkas persyaratan layanan dan tandatangani secara digital
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-7 py-5 space-y-5">
          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
              {submitError}
            </div>
          )}

          {/* Service info */}
          <div className="flex items-center gap-3 border border-blue-200 rounded-xl p-4 bg-transparent">
            <div className="text-blue-600 flex-shrink-0">
              {getServiceIcon(service.id)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-blue-900">
                {service.name}
              </h3>
              <p className="text-[10px] text-blue-600 font-medium mt-0.5">
                {service.flow}
              </p>
            </div>
          </div>

          {/* Data Pemohon */}
          <div className="border border-gray-200 rounded-xl p-5">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
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
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"
                />
              </svg>
              Data Pemohon
            </h4>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
              <div>
                <p className="text-xs text-gray-400">Nama Lengkap</p>
                <p className="font-semibold text-gray-800">{item.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">NIK</p>
                <p className="font-mono text-gray-750">{item.nik}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Tempat / Tgl Lahir</p>
                <p className="text-gray-700">{item.ttl}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Jenis Kelamin</p>
                <p className="text-gray-700">{item.jenisKelamin}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Agama</p>
                <p className="text-gray-700">{item.agama}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Pekerjaan</p>
                <p className="text-gray-700">{item.pekerjaan}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-400">Alamat</p>
                <p className="text-gray-700">{item.alamat}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-400">Keperluan</p>
                <p className="font-semibold text-gray-800">{item.keperluan}</p>
              </div>
            </div>
          </div>

          {/* Dynamic specific fields */}
          {item.formData && Object.keys(item.formData).filter(k => !["tempatLahir", "tanggalLahir", "jenisKelamin", "agama", "pekerjaan", "alamat"].includes(k)).length > 0 && (
            <div className="border border-gray-200 rounded-xl p-5">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                Detail Formulir Layanan
              </h4>
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                {Object.entries(item.formData)
                  .filter(([key]) => !["tempatLahir", "tanggalLahir", "jenisKelamin", "agama", "pekerjaan", "alamat"].includes(key))
                  .map(([key, value]) => {
                    const matchedField = service.specificFields?.find(f => f.name === key);
                    const label = matchedField ? matchedField.label : key.replace(/([A-Z])/g, " $1");
                    return (
                      <div key={key}>
                        <p className="text-xs text-gray-400 capitalize">{label}</p>
                        <p className="font-semibold text-gray-850">{value || "—"}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Dokumen Terlampir */}
          <div className="border border-gray-200 rounded-xl p-5">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
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
                  d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                />
              </svg>
              Dokumen Persyaratan & Bukti Kaling
              <span className="ml-auto text-[9px] font-semibold text-blue-500 normal-case tracking-normal">
                Klik dokumen untuk preview
              </span>
            </h4>
            <div className="space-y-2">
              {item.rawDocuments && item.rawDocuments.map((doc) => {
                const isImg =
                  doc.fileUrl.toLowerCase().endsWith(".jpg") ||
                  doc.fileUrl.toLowerCase().endsWith(".jpeg") ||
                  doc.fileUrl.toLowerCase().endsWith(".png") ||
                  doc.fileUrl.includes("image/upload");
                return (
                  <div
                    key={doc.id}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 flex items-center gap-3 hover:border-blue-300 hover:bg-blue-50/30 transition-all group cursor-pointer"
                    onClick={() => setPreviewDoc(doc.fileUrl)}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0 ${
                        isImg ? "bg-violet-500" : "bg-red-500"
                      }`}
                    >
                      {isImg ? "IMG" : "PDF"}
                    </div>
                    <span className="text-xs font-medium text-gray-700 flex-1 truncate">
                      {doc.documentLabel}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewDoc(doc.fileUrl);
                        }}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 text-[9px] font-bold transition-colors"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Document Preview Modal */}
          {previewDoc && (
            <DocumentPreviewModal
              doc={previewDoc}
              onClose={() => setPreviewDoc(null)}
            />
          )}

          {/* Signature/TTE Box */}
          {!showRejectForm && (
            <div className="border border-amber-200 rounded-xl p-5 bg-amber-50/10">
              <h4 className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">
                Metode Tanda Tangan & Validasi
              </h4>
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="sig_method"
                    value="tte"
                    checked={signatureMethod === "tte"}
                    onChange={() => setSignatureMethod("tte")}
                    className="accent-slate-900"
                  />
                  Tanda Tangan Elektronik (TTE)
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="sig_method"
                    value="upload"
                    checked={signatureMethod === "upload"}
                    onChange={() => setSignatureMethod("upload")}
                    className="accent-slate-900"
                  />
                  Unggah Tanda Tangan Basah
                </label>
              </div>

              {signatureMethod === "tte" ? (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-650">Passphrase TTE Lurah</label>
                  <input
                    type="password"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="Masukkan passphrase sertifikat digital (admin123)"
                    className="w-full px-3 py-2 border border-gray-250 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <p className="text-[10px] text-gray-400">Passphrase standard sistem Kelurahan Panjer adalah `admin123`</p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center relative cursor-pointer hover:bg-gray-50/50">
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setUploadedFile(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                  <span className="text-xs font-semibold text-gray-700">
                    {uploadedFile ? uploadedFile.name : "Pilih file tanda tangan basah (JPG/PNG/PDF)"}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Reject form */}
          {showRejectForm && (
            <div className="border border-red-200 rounded-xl p-5 bg-red-50/50">
              <h4 className="text-xs font-bold text-red-650 uppercase tracking-widest mb-2">
                Alasan Penolakan Validasi
              </h4>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Tuliskan alasan berkas ditolak atau tidak lengkap..."
                className="w-full px-3 py-2.5 border border-red-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
              />
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setShowRejectForm(false)}
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold text-gray-655 border border-gray-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleValidationReject}
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:bg-red-300"
                >
                  {submitting ? "Memproses..." : "Konfirmasi Tolak"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!showRejectForm && (
          <div className="px-7 py-4 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
            <button
              onClick={() => setShowRejectForm(true)}
              disabled={submitting}
              className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-bold text-gray-600 transition-all disabled:opacity-50"
            >
              Tolak Berkas
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleValidationApprove}
                disabled={submitting}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 disabled:bg-slate-400"
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
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {submitting ? "Memproses..." : approveLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ValidasiSuratPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const selectedItemId = searchParams.get("item");
  const activeTab = searchParams.get("tab") || "all";
  const statusFilter = searchParams.get("status") || "Semua Status";
  const searchTerm = searchParams.get("q") || "";

  const fetchList = async () => {
    try {
      const response = await api.get("/submissions/kelurahan/pending");
      const mapped = (response.data.submissions || []).map((item) => {
        const kalingEntry = item.timeline.find(t => t.action === "DIVERIFIKASI_KALING");
        return {
          id: item.id,
          name: item.user.namaLengkap,
          nik: item.user.nik,
          serviceId: item.service.slug,
          origin: kalingEntry ? `Banjar Tegal (Kaling: ${item.assignedKaling?.namaLengkap || 'I Made Herman'})` : "Langsung ke Kelurahan (Tanpa Kaling)",
          date: new Date(item.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }),
          kalingApproved: !!kalingEntry || !item.service.needsKaling,
          kalingName: item.assignedKaling?.namaLengkap || null,
          kalingDate: kalingEntry ? new Date(kalingEntry.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : null,
          ttl: `${item.user.tempatLahir || 'Denpasar'}, ${item.user.tanggalLahir || '1 Januari 1990'}`,
          jenisKelamin: item.user.jenisKelamin || 'Laki-laki',
          agama: item.user.agama || 'Hindu',
          pekerjaan: item.user.pekerjaan || 'Buruh Harian',
          alamat: item.user.alamat || 'Alamat KTP',
          keperluan: item.formData.keperluan || '—',
          rawDocuments: item.documents,
          formData: item.formData,
          service: item.service,
        };
      });
      setList(mapped);
    } catch (err) {
      console.error("Gagal mengambil data validasi kelurahan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
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

  const getService = (serviceId) =>
    SERVICES.find((s) => s.id === serviceId) || {
      name: serviceId,
      flow: "",
      flowSteps: [],
      needsKelurahan: true,
    };

  const handleApprove = async (item, sigData) => {
    const payload = new FormData();
    payload.append("signatureMethod", sigData.method);
    if (sigData.method === "tte") {
      payload.append("passphrase", sigData.passphrase);
    } else {
      payload.append("file", sigData.file);
    }
    payload.append("note", "Disetujui dan divalidasi oleh Lurah Panjer");

    await api.post(`/submissions/${item.id}/kelurahan/approve`, payload, true);
    
    setToast(`Permohonan ${item.name} berhasil divalidasi & diterbitkan.`);
    setTimeout(() => setToast(null), 4000);

    fetchList();
  };

  const handleReject = async (item, reason) => {
    await api.post(`/submissions/${item.id}/kelurahan/reject`, { reason });
    
    setToast(`Permohonan ${item.name} berhasil ditolak.`);
    setTimeout(() => setToast(null), 4000);

    fetchList();
  };

  const selectedItem = list.find((item) => String(item.id) === String(selectedItemId)) || null;

  const filteredList = useMemo(() => {
    return list.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.origin.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "kaling" && item.kalingApproved) ||
        (activeTab === "langsung" && !item.kalingApproved);
      const matchesStatus =
        statusFilter === "Semua Status" ||
        (statusFilter === "Sudah Kaling" && item.kalingApproved) ||
        (statusFilter === "Langsung" && !item.kalingApproved);
      return matchesSearch && matchesTab && matchesStatus;
    });
  }, [list, searchTerm, activeTab, statusFilter]);

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3">
          <svg
            className="w-5 h-5"
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
          <p className="text-xs font-bold">{toast}</p>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">
          Validasi Surat & TTE
        </h1>
        <p className="text-gray-400 text-xs mt-0.5 font-medium">
          Daftar seluruh pengajuan surat yang siap divalidasi oleh Kelurahan menggunakan Sertifikat Digital (TTE).
        </p>
      </div>

      {/* Control row */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 flex-shrink-0">
            {[
              { id: "all", label: "Semua Pengajuan" },
              { id: "kaling", label: "Lewat Kaling" },
              { id: "langsung", label: "Langsung Kelurahan" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => updateQuery({ tab: tab.id })}
                className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all
                  ${
                    activeTab === tab.id
                      ? "border-slate-900 text-gray-900"
                      : "border-transparent text-gray-400 hover:text-gray-650"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Cari nama atau NIK..."
              value={searchTerm}
              onChange={(e) => updateQuery({ q: e.target.value })}
              className="w-full pl-9 pr-3 py-2 border border-gray-250 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      {/* List Main */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-xs text-gray-400 font-medium">
              Memuat data validasi kelurahan...
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Nama Warga</th>
                  <th className="px-6 py-4">Jenis Surat</th>
                  <th className="px-6 py-4">Asal Berkas</th>
                  <th className="px-6 py-4">Tanggal Masuk</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {filteredList.map((item) => {
                  const service = getService(item.serviceId);
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-7 h-7 border border-blue-500 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-600">
                          {item.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="font-semibold text-gray-800">
                          {item.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded border border-gray-300 text-[9px] font-bold text-gray-500 uppercase tracking-wide">
                          {service.name
                            .replace("Surat ", "")
                            .replace("(", "")
                            .replace(")", "")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {item.kalingApproved ? (
                            <svg
                              className="w-3 h-3 text-green-500 flex-shrink-0"
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
                          ) : (
                            <svg
                              className="w-3 h-3 text-amber-500 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"
                              />
                            </svg>
                          )}
                          <span className="text-gray-500 text-[10px]">
                            {item.origin}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{item.date}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => updateQuery({ item: item.id })}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold transition-all"
                        >
                          Validasi
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredList.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      <svg
                        className="w-10 h-10 mx-auto mb-2 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-sm font-bold text-gray-500">
                        Semua Surat Selesai Divalidasi
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Tidak ada surat yang perlu divalidasi saat ini.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          service={getService(selectedItem.serviceId)}
          onClose={() => updateQuery({ item: "" })}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default ValidasiSuratPage;
