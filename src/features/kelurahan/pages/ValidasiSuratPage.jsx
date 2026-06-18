import { useState, Fragment } from "react";
import {
  SERVICES,
  FLOW_STEP_LABELS,
  getServiceIcon,
} from "../../../data/serviceData.jsx";

// ─────────────────────────────────────────────────────────────────────────────
// Data ini mewakili surat yang SUDAH diverifikasi Kaling dan diteruskan ke
// Kelurahan untuk validasi final. Alur: Masyarakat → Kaling ✓ → Kelurahan
// Serta surat langsung ke Kelurahan (tanpa Kaling) seperti Masih Hidup.
//
// CATATAN: SKCK tidak masuk. Per 2025 langsung ke Polres/Polsek.
// ─────────────────────────────────────────────────────────────────────────────
const DUMMY_PENDING_LETTERS = [
  {
    id: 1,
    name: "Made Suarsana",
    nik: "5171010202870009",
    serviceId: "sktm",
    origin: "Banjar Tegal (Kaling: I Made Herman)",
    date: "23 Okt 2026, 14:05",
    kalingApproved: true,
    kalingName: "I Made Herman",
    kalingDate: "23 Okt 2026, 17:30",
    ttl: "Gianyar, 2 Februari 1987",
    jenisKelamin: "Laki-laki",
    agama: "Hindu",
    pekerjaan: "Buruh Harian",
    alamat:
      "Jl. Pulau Galang No. 7, Banjar Tegal, Kel. Panjer, Denpasar Selatan",
    keperluan: "Pengajuan beasiswa pendidikan anak ke SMA Negeri",
    docs: [
      "KTP_MadeSuarsana.jpg",
      "KK_MadeSuarsana.pdf",
      "SuratPernyataanKurangMampu_Materai.pdf",
      "SuratPengantar_KalingTegal.pdf",
    ],
  },
  {
    id: 2,
    name: "Siti Halimah",
    nik: "5171014306920005",
    serviceId: "domisili",
    origin: "Banjar Anyar (Kaling: I Ketut Darma)",
    date: "24 Okt 2026, 10:40",
    kalingApproved: true,
    kalingName: "I Ketut Darma",
    kalingDate: "24 Okt 2026, 13:00",
    ttl: "Surabaya, 3 Juni 1992",
    jenisKelamin: "Perempuan",
    agama: "Islam",
    pekerjaan: "Ibu Rumah Tangga",
    alamat:
      "Jl. Pulau Saelus Gg. II No. 4, Banjar Anyar, Kel. Panjer, Denpasar Selatan",
    keperluan: "Pendaftaran sekolah anak ke SD Negeri setempat",
    docs: [
      "KTP_SitiHalimah.jpg",
      "KK_SitiHalimah.pdf",
      "SuratPengantar_KalingAnyar.pdf",
    ],
  },
  {
    id: 3,
    name: "I Gede Wirawan",
    nik: "5171010506790004",
    serviceId: "waris",
    origin: "Banjar Anyar (Kaling: I Ketut Darma)",
    date: "22 Okt 2026, 09:30",
    kalingApproved: true,
    kalingName: "I Ketut Darma",
    kalingDate: "22 Okt 2026, 15:00",
    ttl: "Denpasar, 5 Juni 1979",
    jenisKelamin: "Laki-laki",
    agama: "Hindu",
    pekerjaan: "Wiraswasta",
    alamat:
      "Jl. Pulau Bungin No. 4, Banjar Anyar, Kel. Panjer, Denpasar Selatan",
    keperluan: "Pengurusan warisan tanah peninggalan ayah",
    docs: [
      "KTP_IGedeWirawan.jpg",
      "KK_IGedeWirawan.pdf",
      "AktaKematian_Pewaris.pdf",
      "SuratPernyataanAhliWaris_Materai.pdf",
      "SuratPengantar_KalingAnyar.pdf",
    ],
  },
  {
    id: 4,
    name: "Ni Luh Putu Ayu",
    nik: "5171016712500001",
    serviceId: "masih_hidup",
    origin: "Langsung ke Kelurahan (Tanpa Kaling)",
    date: "25 Okt 2026, 10:00",
    kalingApproved: false,
    kalingName: null,
    kalingDate: null,
    ttl: "Denpasar, 27 Desember 1950",
    jenisKelamin: "Perempuan",
    agama: "Hindu",
    pekerjaan: "Pensiunan",
    alamat: "Jl. Diponegoro No. 15, Kel. Panjer, Denpasar Selatan",
    keperluan:
      "Pencairan dana pensiun bulanan (tidak bisa Kaling, usia lanjut)",
    docs: ["KTP_NiLuhPutuAyu.jpg", "KK_NiLuhPutuAyu.pdf"],
  },
];

// ─── Detail Modal ───────────────────────────────────────────────────────────────
const DetailModal = ({ item, service, onClose, onApprove, onReject }) => {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [signatureMethod, setSignatureMethod] = useState("tte"); // 'tte' or 'upload'
  const [passphrase, setPassphrase] = useState("");
  const [isSigned, setIsSigned] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showSigError, setShowSigError] = useState(false);

  const approveLabel = service.forwardTo
    ? `Validasi & Teruskan ke ${service.forwardTo}`
    : "Validasi & Terbitkan Surat Resmi";

  const handleValidationApprove = () => {
    if (signatureMethod === "tte" && !isSigned) {
      setShowSigError(true);
      return;
    }
    if (signatureMethod === "upload" && !uploadedFile) {
      setShowSigError(true);
      return;
    }

    onApprove(item, {
      method: signatureMethod,
      details: signatureMethod === "tte" ? "TTE Lurah Aktif" : uploadedFile,
    });
    onClose();
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
              Detail Validasi Surat
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Verifikasi final dan penerbitan surat resmi Kelurahan
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
            <div className="flex-1">
              <h3 className="text-sm font-bold text-blue-900">
                {service.name}
              </h3>
              <p className="text-[10px] text-blue-600 font-medium mt-0.5">
                {service.flow}
              </p>
            </div>
          </div>

          {/* Kaling Verification Status */}
          {item.kalingApproved ? (
            <div className="border border-green-300 rounded-xl p-4 bg-transparent">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-green-600"
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
                <span className="text-xs font-bold text-green-700 uppercase tracking-wide">
                  Diverifikasi oleh Kepala Lingkungan
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">Nama Kaling:</span>{" "}
                  <span className="font-semibold text-gray-700">
                    {item.kalingName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Tanggal:</span>{" "}
                  <span className="font-semibold text-gray-700">
                    {item.kalingDate}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-green-600 mt-1.5 font-medium">
                Surat pengantar Kaling telah terverifikasi dan terlampir.
              </p>
            </div>
          ) : (
            <div className="border border-amber-300 rounded-xl p-4 bg-transparent">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-amber-600"
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
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                  Permohonan Langsung (Tanpa Kaling)
                </span>
              </div>
              <p className="text-[10px] text-amber-600 mt-1 font-medium">
                Surat ini tidak memerlukan pengantar dari Kepala Lingkungan
                sesuai prosedur.
              </p>
            </div>
          )}

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
                  className={`border rounded-lg px-3 py-2.5 flex items-center gap-2 ${
                    doc.includes("SuratPengantar")
                      ? "border-green-300 bg-transparent"
                      : "border-gray-200"
                  }`}
                >
                  <svg
                    className={`w-4 h-4 flex-shrink-0 ${doc.includes("SuratPengantar") ? "text-green-500" : "text-blue-500"}`}
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
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-gray-700 truncate block">
                      {doc}
                    </span>
                    {doc.includes("SuratPengantar") && (
                      <span className="text-[9px] text-green-600 font-bold">
                        Surat Pengantar Kaling
                      </span>
                    )}
                  </div>
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
              {(service.flowSteps || []).map((step, i, arr) => {
                const isKelurahan = step === "kelurahan";
                const isPast = service.flowSteps.indexOf("kelurahan") > i;
                return (
                  <Fragment key={step}>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold ${
                        isKelurahan
                          ? "border border-amber-300 text-amber-700 bg-transparent"
                          : isPast
                            ? "border border-green-300 text-green-700 bg-transparent"
                            : "border border-blue-200 text-blue-700 bg-transparent"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-extrabold text-white ${
                          isKelurahan
                            ? "bg-amber-500"
                            : isPast
                              ? "bg-green-500"
                              : "bg-blue-600"
                        }`}
                      >
                        {isPast ? "✓" : i + 1}
                      </span>
                      {FLOW_STEP_LABELS[step] || step}
                      {isKelurahan && (
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
                );
              })}
            </div>
            {service.forwardTo && (
              <p className="text-[10px] text-blue-600 font-medium mt-2">
                ※ Setelah Anda validasi, surat akan diteruskan ke{" "}
                <strong>{service.forwardTo}</strong> untuk proses akhir.
              </p>
            )}
            {!service.forwardTo && (
              <p className="text-[10px] text-green-600 font-medium mt-2">
                ✓ Surat ini selesai di tingkat Kelurahan. Anda dapat langsung
                menerbitkan surat keterangan resmi.
              </p>
            )}
          </div>

          {/* Section Penandatanganan & Cap Kelurahan */}
          {!showRejectForm && (
            <div
              className={`border rounded-xl p-5 transition-all ${
                showSigError && !isSigned && !uploadedFile
                  ? "border-red-300 bg-red-50/5"
                  : "border-blue-200 bg-blue-50/5"
              }`}
            >
              <h4
                className={`text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5 ${
                  showSigError && !isSigned && !uploadedFile
                    ? "text-red-600"
                    : "text-blue-700"
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
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.83 17.062a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
                Otorisasi & Tanda Tangan Kelurahan
              </h4>
              <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">
                Pilih metode tanda tangan resmi kelurahan untuk memvalidasi dan
                menerbitkan dokumen ini.
              </p>

              {/* Tab Selector */}
              <div className="flex border-b border-gray-200 mb-4 text-xs font-semibold">
                <button
                  onClick={() => {
                    setSignatureMethod("tte");
                    showSigError && setShowSigError(false);
                  }}
                  className={`pb-2 px-4 border-b-2 transition-all ${
                    signatureMethod === "tte"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Tanda Tangan Elektronik (TTE / BSrE)
                </button>
                <button
                  onClick={() => {
                    setSignatureMethod("upload");
                    showSigError && setShowSigError(false);
                  }}
                  className={`pb-2 px-4 border-b-2 transition-all ${
                    signatureMethod === "upload"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Unggah Dokumen Fisik Ter-TTD
                </button>
              </div>

              {signatureMethod === "tte" ? (
                <div className="space-y-3">
                  <p className="text-[10px] text-gray-500">
                    Sistem akan menyematkan TTE tersertifikasi BSrE berupa QR
                    Code pengaman pada surat resmi warga.
                  </p>
                  {isSigned ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
                      <div className="w-12 h-12 bg-white border border-green-300 rounded flex items-center justify-center font-mono text-[8px] text-green-700 font-bold p-1 text-center leading-none">
                        TTE OK
                        <br />
                        PANJER
                      </div>
                      <div>
                        <p className="text-xs font-bold text-green-800">
                          TTE Berhasil Disematkan
                        </p>
                        <p className="text-[9px] text-green-600">
                          Dokumen akan ditandatangani secara digital atas nama
                          Lurah Panjer.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsSigned(false)}
                        className="ml-auto text-xs text-red-600 hover:underline font-semibold"
                      >
                        Ubah
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="password"
                          placeholder="Masukkan Passphrase TTE Lurah (cth: lurah123)"
                          value={passphrase}
                          onChange={(e) => setPassphrase(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (passphrase.trim()) {
                            setIsSigned(true);
                            setShowSigError(false);
                          } else {
                            setShowSigError(true);
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all"
                      >
                        Sematkan TTE
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[10px] text-gray-500">
                    Pindai surat yang sudah ditandatangani Lurah secara basah
                    dan dicap stempel, lalu unggah format PDF/Gambar di bawah.
                  </p>
                  {uploadedFile ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
                      <svg
                        className="w-8 h-8 text-blue-600"
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
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">
                          {uploadedFile}
                        </p>
                        <p className="text-[9px] text-gray-400">
                          Terunggah • Siap Diterbitkan
                        </p>
                      </div>
                      <button
                        onClick={() => setUploadedFile(null)}
                        className="text-xs text-red-600 hover:underline font-semibold"
                      >
                        Hapus
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-4 flex flex-col items-center justify-center bg-transparent cursor-pointer transition-colors w-full">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setUploadedFile(e.target.files[0].name);
                            setShowSigError(false);
                          }
                        }}
                      />
                      <svg
                        className="w-8 h-8 text-gray-400 mb-2"
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
                      <p className="text-xs font-bold text-gray-600">
                        Klik atau seret file ke sini
                      </p>
                      <p className="text-[9px] text-gray-400 mt-1">
                        PDF, JPG, PNG (Max 5MB)
                      </p>
                    </label>
                  )}
                </div>
              )}

              {showSigError && (
                <p className="text-[10px] text-red-600 font-semibold mt-2">
                  ⚠️ Silakan sematkan TTE Lurah (dengan memasukkan passphrase)
                  atau unggah berkas fisik terlebih dahulu sebelum memvalidasi.
                </p>
              )}
            </div>
          )}

          {/* Reject form */}
          {showRejectForm && (
            <div className="border border-red-200 rounded-xl p-5 bg-red-50/50">
              <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">
                Alasan Penolakan
              </h4>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Jelaskan alasan penolakan surat ini..."
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
          <div className="px-7 py-4 border-t border-gray-100 flex items-center justify-end gap-2 flex-shrink-0">
            <button
              onClick={() => setShowRejectForm(true)}
              className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-bold text-gray-600 transition-all"
            >
              Tolak
            </button>
            <button
              onClick={handleValidationApprove}
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
              {approveLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ──────────────────────────────────────────────────────────────────
const ValidasiSuratPage = () => {
  const [list, setList] = useState(DUMMY_PENDING_LETTERS);
  const [activeTab, setActiveTab] = useState("Semua");
  const [selectedItem, setSelectedItem] = useState(null);
  const [toast, setToast] = useState(null);

  const getService = (serviceId) =>
    SERVICES.find((s) => s.id === serviceId) || {
      name: serviceId,
      flow: "",
      flowSteps: [],
      forwardTo: null,
    };

  const handleApprove = (item, sigData) => {
    const service = getService(item.serviceId);
    setList((prev) => prev.filter((p) => p.id !== item.id));
    const sigType =
      sigData?.method === "tte"
        ? "dengan TTE BSrE"
        : "dengan unggahan surat fisik";
    const msg = service.forwardTo
      ? `Surat ${item.name} divalidasi & diteruskan ke ${service.forwardTo}`
      : `Surat Keterangan untuk ${item.name} berhasil diterbitkan ${sigType}`;
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleReject = (item) => {
    setList((prev) => prev.filter((p) => p.id !== item.id));
    setToast(`Permohonan surat ${item.name} telah ditolak`);
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
        <h1 className="text-xl font-extrabold text-gray-900">Validasi Surat</h1>
        <p className="text-gray-400 text-xs mt-0.5">
          Surat masuk yang sudah diverifikasi Kepala Lingkungan dan siap untuk
          validasi final Kelurahan.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menunggu Validasi
          </p>
          <p className="text-2xl font-extrabold text-gray-900">{list.length}</p>
          <p className="text-[10px] text-gray-400">
            Diperbarui 5 menit yang lalu
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Total Hari Ini
          </p>
          <p className="text-2xl font-extrabold text-gray-900">48</p>
          <p className="text-[10px] text-green-500 font-bold">
            +8% dari kemarin
          </p>
        </div>
      </div>

      {/* Filter and control panel */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-5">
        {/* Controls row */}
        <div className="flex gap-4 items-center">
          <div className="relative w-full md:w-96 shadow-sm rounded-lg">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Cari Surat..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Semua Status</option>
          </select>
          <button className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
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
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A50.065 50.065 0 0112 3z"
              />
            </svg>
            Filter Lanjut
          </button>
        </div>

        {/* Tab filters */}
        <div className="flex gap-2">
          {[`Semua (${list.length})`, "Dari Kaling", "Langsung"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200
                ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Nama Warga</th>
                <th className="px-6 py-4">Jenis Surat</th>
                <th className="px-6 py-4">Asal</th>
                <th className="px-6 py-4">Tanggal Masuk</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
              {list.map((item) => {
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
                        onClick={() => setSelectedItem(item)}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold transition-all"
                      >
                        Validasi
                      </button>
                    </td>
                  </tr>
                );
              })}
              {list.length === 0 && (
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
        </div>

        {/* Footer pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-semibold text-gray-400">
          <span>Menampilkan {list.length} permohonan</span>
          <div className="flex gap-1">
            <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-500">
              &lt;
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

export default ValidasiSuratPage;
