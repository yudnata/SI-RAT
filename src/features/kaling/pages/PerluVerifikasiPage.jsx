import { useState, Fragment } from "react";
import {
  SERVICES,
  FLOW_STEP_LABELS,
  getServiceIcon,
} from "../../../data/serviceData.jsx";
import SuratPengantarTemplate from "../components/SuratPengantarTemplate";

// ─────────────────────────────────────────────────────────────────────────────
// Data permohonan yang SEDANG MENUNGGU verifikasi Kaling.
// Surat yang di-approve dan needsKelurahan=true → diteruskan ke Kelurahan.
// CATATAN: SKCK tidak masuk sistem ini per 2025.
// ─────────────────────────────────────────────────────────────────────────────
const DUMMY_PENDING = [
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

// ─── Detail Modal Component ─────────────────────────────────────────────────────
const DetailModal = ({ item, service, onClose, onApprove, onReject }) => {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [signedFile, setSignedFile] = useState(null);
  const [showUploadError, setShowUploadError] = useState(false);

  const handleApprove = () => {
    if (!signedFile) {
      setShowUploadError(true);
      return;
    }
    onApprove(item, service.needsKelurahan);
  };

  if (showTemplate) {
    return (
      <SuratPengantarTemplate
        data={{
          nama: item.name,
          nik: item.nik,
          ttl: item.ttl,
          jenisKelamin: item.jenisKelamin,
          agama: item.agama,
          pekerjaan: item.pekerjaan,
          alamat: item.alamat,
          keperluan: item.keperluan,
          jenisSurat: service.name,
        }}
        onClose={() => setShowTemplate(false)}
      />
    );
  }

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
              Detail Permohonan
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Verifikasi data dan dokumen warga sebelum menyetujui
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
                <p className="font-mono text-gray-700">{item.nik}</p>
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
              Dokumen Terlampir
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {(item.docs || []).map((doc) => (
                <div
                  key={doc}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4 text-blue-500 flex-shrink-0"
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
                  <span className="text-xs font-medium text-gray-700 truncate">
                    {doc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Alur Pemrosesan */}
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
                  d="M3.75 12h16.5m0 0L14.25 6m6 6l-6 6"
                />
              </svg>
              Alur Pemrosesan
            </h4>
            <div className="flex items-center flex-wrap gap-1.5">
              {(service.flowSteps || []).map((step, i, arr) => (
                <Fragment key={step}>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold ${
                      step === "kaling"
                        ? "border border-amber-300 text-amber-700 bg-transparent"
                        : "border border-blue-200 text-blue-700 bg-transparent"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-extrabold ${
                        step === "kaling"
                          ? "bg-amber-500 text-white"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {i + 1}
                    </span>
                    {FLOW_STEP_LABELS[step] || step}
                    {step === "kaling" && (
                      <span className="text-[8px] ml-0.5">(Anda)</span>
                    )}
                  </span>
                  {i < arr.length - 1 && (
                    <svg
                      className="w-3 h-3 text-gray-400 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  )}
                </Fragment>
              ))}
            </div>
            {service.needsKelurahan && (
              <p className="text-[10px] text-blue-600 font-medium mt-2">
                ※ Setelah Anda setujui, surat pengantar akan diteruskan ke{" "}
                <strong>Kelurahan</strong> untuk proses selanjutnya.
              </p>
            )}
            {!service.needsKelurahan && (
              <p className="text-[10px] text-green-600 font-medium mt-2">
                ✓ Surat ini selesai di tingkat Lingkungan. Anda dapat langsung
                menerbitkan surat pengantar.
              </p>
            )}
          </div>

          {/* Unggah Surat Pengantar Hasil Tanda Tangan */}
          {!showRejectForm && (
            <div
              className={`border rounded-xl p-5 transition-all ${
                showUploadError && !signedFile
                  ? "border-red-300 bg-transparent"
                  : "border-amber-200 bg-transparent"
              }`}
            >
              <h4
                className={`text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5 ${
                  showUploadError && !signedFile
                    ? "text-red-600"
                    : "text-amber-700"
                }`}
              >
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
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Unggah Surat Pengantar Tanda Tangan Kaling
              </h4>
              <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">
                Cetak draft surat pengantar melalui tombol{" "}
                <strong>Preview Surat</strong> di bawah, bubuhkan tanda tangan
                basah & cap stempel, lalu foto/scan dan unggah di bawah ini
                sebagai bukti persetujuan fisik sebelum diteruskan.
              </p>

              <div
                className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center bg-transparent hover:bg-amber-50/5 transition-colors cursor-pointer relative ${
                  showUploadError && !signedFile
                    ? "border-red-300"
                    : "border-amber-200"
                }`}
              >
                <input
                  type="file"
                  onChange={(e) => {
                    setSignedFile(e.target.files[0]);
                    setShowUploadError(false);
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <svg
                  className={`w-8 h-8 mb-1 ${
                    showUploadError && !signedFile
                      ? "text-red-400"
                      : "text-amber-500"
                  }`}
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
                <span className="text-xs font-semibold text-gray-700 text-center px-2">
                  {signedFile
                    ? signedFile.name
                    : "Pilih file Surat Pengantar yang sudah ditandatangani"}
                </span>
                <span className="text-[9px] text-gray-400 mt-0.5">
                  PNG, JPG, atau PDF (Maks. 5MB)
                </span>
              </div>
              {showUploadError && !signedFile && (
                <p className="text-[10px] text-red-600 font-bold mt-2 flex items-center gap-1">
                  ⚠ Wajib mengunggah surat pengantar yang ditandatangani sebelum
                  menyetujui.
                </p>
              )}
            </div>
          )}

          {/* Reject form (conditionally shown) */}
          {showRejectForm && (
            <div className="border border-red-200 rounded-xl p-5 bg-red-50/50">
              <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">
                Alasan Penolakan
              </h4>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Jelaskan alasan penolakan permohonan ini..."
                className="w-full px-3 py-2.5 border border-red-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-white transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    onReject(item);
                    onClose();
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Konfirmasi Tolak
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!showRejectForm && (
          <div className="px-7 py-4 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
            <button
              onClick={() => setShowTemplate(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
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
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Preview Surat
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setShowRejectForm(true)}
                className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-bold text-gray-600 transition-all"
              >
                Tolak
              </button>
              <button
                onClick={handleApprove}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
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
                {service.needsKelurahan
                  ? "Setujui & Teruskan ke Kelurahan"
                  : "Setujui & Terbitkan Surat"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ──────────────────────────────────────────────────────────────────
const PerluVerifikasiPage = ({ list, setList }) => {
  const [localList, setLocalList] = useState(DUMMY_PENDING);
  const activeList = list !== undefined ? list : localList;
  const activeSetList = setList !== undefined ? setList : setLocalList;

  const [selectedItem, setSelectedItem] = useState(null);
  const [toast, setToast] = useState(null);

  const getService = (serviceId) =>
    SERVICES.find((s) => s.id === serviceId) || {
      name: serviceId,
      flow: "",
      flowSteps: [],
      needsKelurahan: true,
    };

  const handleApprove = (item, forwarded) => {
    activeSetList((prev) => prev.filter((p) => p.id !== item.id));
    setSelectedItem(null);
    const msg = forwarded
      ? `Permohonan ${item.name} disetujui & diteruskan ke Kelurahan`
      : `Surat Pengantar untuk ${item.name} berhasil diterbitkan`;
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleReject = (item) => {
    activeSetList((prev) => prev.filter((p) => p.id !== item.id));
    setSelectedItem(null);
    setToast(`Permohonan ${item.name} telah ditolak`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-bounce">
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
          Perlu Verifikasi
        </h1>
        <p className="text-gray-400 text-xs mt-0.5">
          Daftar permohonan warga yang menunggu verifikasi Anda sebagai Kepala
          Lingkungan.
        </p>
      </div>

      {/* Main card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-50 pb-4">
          <h2 className="text-sm font-bold text-gray-800">Daftar Permohonan</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-lg text-[10px] font-bold text-gray-600 transition-colors">
              Filter
            </button>
            <button className="px-3 py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-lg text-[10px] font-bold text-gray-600 transition-colors">
              Urutkan
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Warga</th>
                <th className="px-6 py-4">Jenis Surat</th>
                <th className="px-6 py-4">Tanggal Masuk</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
              {activeList.map((item) => {
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
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {item.block}
                        </p>
                      </div>
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
                      <p className="text-gray-700">{item.date}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold transition-all"
                      >
                        Verifikasi
                      </button>
                    </td>
                  </tr>
                );
              })}
              {activeList.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
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
                      Semua Permohonan Selesai
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Tidak ada permohonan yang perlu diverifikasi saat ini.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-semibold text-gray-400">
          <span>Menampilkan {activeList.length} permohonan</span>
          <div className="flex gap-1">
            <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-500">
              &lt;
            </button>
            <button className="w-7 h-7 flex items-center justify-center bg-slate-900 text-white rounded">
              1
            </button>
            <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-500">
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          service={getService(selectedItem.serviceId)}
          onClose={() => setSelectedItem(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default PerluVerifikasiPage;
