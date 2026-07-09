import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthSidePanel from "../components/AuthSidePanel";
import { api } from "../../../utils/api.js";



/* ---------- Success Modal ---------- */
const SuccessModal = ({ onGoToLogin }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.55)" }}>
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-[fadeInScale_0.25s_ease]">
      {/* Checkmark circle */}
      <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil</h3>
      <p className="text-gray-500 text-sm mb-6 leading-relaxed">
        Akun Anda telah terdaftar dan berkas KTP Anda sedang diproses untuk verifikasi oleh staff kelurahan. Mohon periksa email Anda secara berkala untuk mendapatkan password aktivasi setelah akun disetujui.
      </p>

      <button
        onClick={onGoToLogin}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all duration-200"
      >
        Kembali ke Halaman Login
      </button>
    </div>
  </div>
);

/* ---------- Main Component ---------- */
const RegisterPage = () => {
  const navigate = useNavigate();
  const ktpInputRef = useRef(null);

  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);



  // KTP file state
  const [ktpFile, setKtpFile] = useState(null);
  const [ktpPreview, setKtpPreview] = useState(null);
  const [scanningKtp, setScanningKtp] = useState(false);
  const [ktpExtracted, setKtpExtracted] = useState(false);

  // Camera state & refs
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setErrorMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (err) {
      console.error("Gagal membuka kamera:", err);
      setErrorMsg("Gagal mengakses kamera. Pastikan izin kamera telah diberikan.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const processKtpOcr = async (file) => {
    setScanningKtp(true);
    setKtpExtracted(false);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("ktpFile", file);

      const result = await api.post("/auth/ocr", formData, true /* isMultipart */);
      
      if (result.status === "success" && result.data) {
        const ocrData = result.data;
        setForm((prev) => ({
          ...prev,
          namaLengkap: ocrData.namaLengkap || prev.namaLengkap,
          nik: ocrData.nik || prev.nik,
          tempatLahir: ocrData.tempatLahir || prev.tempatLahir,
          tanggalLahir: ocrData.tanggalLahir || prev.tanggalLahir,
          jenisKelamin: ocrData.jenisKelamin || prev.jenisKelamin,
          agama: ocrData.agama || prev.agama,
          pekerjaan: ocrData.pekerjaan || prev.pekerjaan,
          alamat: ocrData.alamat || prev.alamat,
          kelurahan: ocrData.kelurahan || prev.kelurahan,
          domisili: ocrData.domisili || prev.domisili,
        }));
        setKtpExtracted(true);
      } else {
        setErrorMsg("Gagal mengenali data KTP secara otomatis. Silakan isi form secara manual.");
      }
    } catch (err) {
      console.error("KTP OCR Error:", err);
      setErrorMsg(
        `Fitur OCR otomatis gagal (${err.message || "kesalahan server"}). Silakan isi formulir secara manual.`
      );
    } finally {
      setScanningKtp(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File(
          [blob],
          `ktp_captured_${Date.now()}.jpg`,
          { type: "image/jpeg" }
        );

        setKtpFile(file);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setKtpPreview(dataUrl);
        stopCamera();

        // Memicu OCR pembacaan KTP yang sesungguhnya
        processKtpOcr(file);
      },
      "image/jpeg",
      0.95
    );
  };

  const [form, setForm] = useState({
    namaLengkap: "",
    nik: "",
    email: "",
    noWhatsapp: "",

    kelurahan: "",
    domisili: "",
    alamat: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    agama: "",
    pekerjaan: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleKelurahanChange = (e) => {
    setForm({ ...form, kelurahan: e.target.value, domisili: "" });
  };

  const handleKtpChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!ALLOWED.includes(file.type)) {
      setErrorMsg("Format KTP tidak didukung. Gunakan JPG, PNG, atau PDF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Ukuran file KTP maksimal 5MB.");
      return;
    }

    setKtpFile(file);
    setErrorMsg("");

    // Preview untuk gambar
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setKtpPreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setKtpPreview("pdf");
    }

    // Memicu OCR pembacaan KTP yang sesungguhnya
    processKtpOcr(file);
  };

  const handleClearKtp = () => {
    stopCamera();
    setKtpFile(null);
    setKtpPreview(null);
    setKtpExtracted(false);
    setScanningKtp(false);
    if (ktpInputRef.current) ktpInputRef.current.value = "";
    // Reset data KTP
    setForm((prev) => ({
      ...prev,
      namaLengkap: "",
      nik: "",
      tempatLahir: "",
      tanggalLahir: "",
      jenisKelamin: "",
      agama: "",
      pekerjaan: "",
      alamat: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi frontend
    if (
      !form.namaLengkap ||
      !form.nik ||
      !form.email ||
      !form.noWhatsapp ||

      !form.kelurahan ||
      !form.domisili ||
      !form.alamat ||
      !form.tempatLahir ||
      !form.tanggalLahir ||
      !form.jenisKelamin ||
      !form.agama ||
      !form.pekerjaan
    ) {
      setErrorMsg("Harap lengkapi semua field formulir!");
      return;
    }
    if (form.nik.length !== 16 || !/^\d+$/.test(form.nik)) {
      setErrorMsg("NIK harus tepat 16 digit angka.");
      return;
    }

    if (!ktpFile) {
      setErrorMsg("Foto KTP wajib diunggah untuk verifikasi identitas.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // Kirim sebagai FormData (multipart) karena ada file
      const formData = new FormData();
      formData.append("namaLengkap", form.namaLengkap);
      formData.append("nik", form.nik);
      formData.append("email", form.email);
      formData.append("noWhatsapp", form.noWhatsapp);

      formData.append("kelurahan", form.kelurahan);
      formData.append("domisili", form.domisili);
      formData.append("alamat", form.alamat);
      formData.append("tempatLahir", form.tempatLahir);
      formData.append("tanggalLahir", form.tanggalLahir);
      formData.append("jenisKelamin", form.jenisKelamin);
      formData.append("agama", form.agama);
      formData.append("pekerjaan", form.pekerjaan);
      formData.append("ktpFile", ktpFile);

      await api.post("/auth/register", formData, true /* isMultipart */);
      setShowSuccess(true);
    } catch (err) {
      setErrorMsg(err.message || "Pendaftaran gagal. Pastikan NIK/Email/No. HP belum terdaftar.");
    } finally {
      setLoading(false);
    }
  };

  const kelurahanMapping = {
    "Kelurahan Panjer": ["Banjar Tegal", "Banjar Anyar"],
    "Kelurahan Sesetan": ["Banjar Taman Sari"],
  };

  const inputClass = "w-full px-3.5 py-3 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

  return (
    <>
      {showSuccess && (
        <SuccessModal onGoToLogin={() => navigate("/dashboard/login")} />
      )}

      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 py-8">
        <div className="w-full max-w-5xl h-[90vh] max-h-[850px] flex rounded-2xl shadow-2xl overflow-hidden bg-white">
          {/* Left panel */}
          <AuthSidePanel title="Membangun jembatan komunikasi yang transparan antara warga dan pemerintah desa untuk masa depan yang lebih baik." />

          {/* Right panel */}
          <div className="flex-1 flex flex-col justify-start p-8 md:p-10 overflow-y-auto h-full">
            {/* Mobile branding */}
            <p className="block md:hidden text-blue-600 font-bold text-lg mb-6">SI-RAT</p>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Daftar Akun Baru</h2>
            <p className="text-gray-500 text-sm mb-6">
              Satu akun untuk semua kebutuhan layanan publik dan korespondensi pemerintah Anda.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {errorMsg}
                </div>
              )}

              {/* Row 1: Email & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="reg-email">Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </span>
                    <input
                      type="email" id="reg-email" name="email"
                      value={form.email} onChange={handleChange}
                      placeholder="nama@email.com"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="noWhatsapp">Nomor WhatsApp</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </span>
                    <input
                      type="tel" id="noWhatsapp" name="noWhatsapp"
                      value={form.noWhatsapp} onChange={handleChange}
                      placeholder="0812xxxxxxxx"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
              </div>



              {/* Row 3: Kelurahan & Lingkungan/Banjar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Kelurahan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="kelurahan">
                    Kelurahan (sesuai KTP)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </span>
                    <select
                      id="kelurahan" name="kelurahan"
                      value={form.kelurahan} onChange={handleKelurahanChange}
                      className={`${inputClass} pl-10 pr-8 appearance-none cursor-pointer bg-white`}
                    >
                      <option value="">Pilih Kelurahan</option>
                      {Object.keys(kelurahanMapping).map((kel) => (
                        <option key={kel} value={kel}>{kel}</option>
                      ))}
                    </select>
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Lingkungan/Banjar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="domisili">
                    Banjar / Lingkungan
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    <select
                      id="domisili" name="domisili"
                      value={form.domisili} onChange={handleChange}
                      disabled={!form.kelurahan}
                      className={`${inputClass} pl-10 pr-8 appearance-none cursor-pointer bg-white disabled:bg-gray-50 disabled:cursor-not-allowed`}
                    >
                      <option value="">Pilih Banjar / Lingkungan</option>
                      {form.kelurahan &&
                        kelurahanMapping[form.kelurahan].map((banjar) => (
                          <option key={banjar} value={banjar}>{banjar}</option>
                        ))}
                    </select>
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 4: Upload Foto KTP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Foto KTP <span className="text-red-500">*</span>
                  <span className="ml-1.5 text-xs font-normal text-gray-400">(JPG, PNG, atau PDF · maks. 5MB)</span>
                </label>

                {!ktpFile ? (
                  showCamera ? (
                    /* Video camera container */
                    <div className="border border-gray-200 rounded-xl overflow-hidden bg-black flex flex-col items-center relative animate-fadeInScale">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full max-h-[300px] object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-red-600/80 text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider animate-pulse flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        Kamera Aktif
                      </div>
                      <div className="w-full p-4 bg-gray-900 flex justify-between gap-4">
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={capturePhoto}
                          className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md transition-all cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                          </svg>
                          Ambil Foto KTP
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Selector: Upload File or Take Photo */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Upload file button */}
                      <button
                        type="button"
                        onClick={() => ktpInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl p-5 flex flex-col items-center justify-center gap-2 bg-white transition-all cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                          <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-gray-650 group-hover:text-blue-600 transition-colors">Pilih Berkas KTP</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">Unggah JPG, PNG, atau berkas PDF</p>
                        </div>
                      </button>

                      {/* Camera capture button */}
                      <button
                        type="button"
                        onClick={startCamera}
                        className="border-2 border-dashed border-gray-300 hover:border-emerald-400 rounded-xl p-5 flex flex-col items-center justify-center gap-2 bg-white transition-all cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-emerald-50 flex items-center justify-center transition-colors">
                          <svg className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-gray-650 group-hover:text-emerald-600 transition-colors">Ambil Foto via Kamera</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">Gunakan kamera perangkat secara langsung</p>
                        </div>
                      </button>
                    </div>
                  )
                ) : (
                  /* Preview */
                  <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4 bg-gray-50">
                    {ktpPreview && ktpPreview !== "pdf" ? (
                      <img src={ktpPreview} alt="Preview KTP" className="w-20 h-14 object-cover rounded-lg border border-gray-300 shrink-0" />
                    ) : (
                      <div className="w-20 h-14 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-red-500">PDF</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{ktpFile.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{(ktpFile.size / 1024).toFixed(0)} KB</p>
                      <button
                        type="button"
                        onClick={handleClearKtp}
                        className="mt-1.5 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                      >
                        Hapus & ganti
                      </button>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  </div>
                )}

                <input
                  ref={ktpInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleKtpChange}
                  className="hidden"
                  id="ktp-upload"
                />
              </div>

              {/* SIMULASI PROSES SCANNING (SCANNING OVERLAY) */}
              {scanningKtp && (
                <div className="border border-blue-200 bg-blue-50/20 rounded-xl p-5 flex flex-col items-center justify-center gap-3 animate-pulse">
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="text-xs font-bold text-blue-700 tracking-wider">
                      🔍 Membaca & Mengekstrak Data dari KTP...
                    </span>
                  </div>
                  {/* Laser line scanner animation */}
                  <div className="relative w-full max-w-sm h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full animate-shimmer" />
                  </div>
                </div>
              )}

              {/* DYNAMIC AUTOFILL SECTIONS (Hanya muncul jika sudah discan) */}
              {ktpExtracted && (
                <div className="space-y-4 border border-green-200 bg-green-50/5 rounded-2xl p-5 border-dashed animate-fadeInScale">
                  {/* Success extract message */}
                  <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs font-semibold rounded-xl flex items-start gap-2.5">
                    <span className="text-base leading-none">✨</span>
                    <div className="leading-relaxed">
                      Data KTP berhasil diekstrak secara otomatis! Silakan tinjau dan sesuaikan kembali jika ada kesalahan ketik.
                    </div>
                  </div>

                  {/* Row: Nama Lengkap & NIK */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="namaLengkap">
                        Nama Lengkap (sesuai KTP)
                      </label>
                      <input
                        type="text" id="namaLengkap" name="namaLengkap"
                        value={form.namaLengkap} onChange={handleChange}
                        placeholder="Masukkan nama lengkap"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="nik">
                        NIK (16 digit)
                      </label>
                      <input
                        type="text" id="nik" name="nik"
                        value={form.nik} onChange={handleChange}
                        placeholder="Masukkan NIK" maxLength={16}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Row: Tempat Lahir & Tanggal Lahir */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="tempatLahir">
                        Tempat Lahir (sesuai KTP)
                      </label>
                      <input
                        type="text" id="tempatLahir" name="tempatLahir"
                        value={form.tempatLahir} onChange={handleChange}
                        placeholder="Denpasar"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="tanggalLahir">
                        Tanggal Lahir (sesuai KTP)
                      </label>
                      <input
                        type="date" id="tanggalLahir" name="tanggalLahir"
                        value={form.tanggalLahir} onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Row: Jenis Kelamin & Agama */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="jenisKelamin">
                        Jenis Kelamin
                      </label>
                      <div className="relative">
                        <select
                          id="jenisKelamin" name="jenisKelamin"
                          value={form.jenisKelamin} onChange={handleChange}
                          className={`${inputClass} appearance-none cursor-pointer bg-white`}
                        >
                          <option value="">Pilih Jenis Kelamin</option>
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                        <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="agama">
                        Agama
                      </label>
                      <div className="relative">
                        <select
                          id="agama" name="agama"
                          value={form.agama} onChange={handleChange}
                          className={`${inputClass} appearance-none cursor-pointer bg-white`}
                        >
                          <option value="">Pilih Agama</option>
                          <option value="Hindu">Hindu</option>
                          <option value="Islam">Islam</option>
                          <option value="Kristen Protestan">Kristen Protestan</option>
                          <option value="Katolik">Katolik</option>
                          <option value="Buddha">Buddha</option>
                          <option value="Konghucu">Konghucu</option>
                        </select>
                        <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Row: Pekerjaan & Alamat Lengkap */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="pekerjaan">
                        Pekerjaan (sesuai KTP)
                      </label>
                      <input
                        type="text" id="pekerjaan" name="pekerjaan"
                        value={form.pekerjaan} onChange={handleChange}
                        placeholder="Contoh: Karyawan Swasta"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="alamat">
                        Alamat Lengkap (sesuai KTP)
                      </label>
                      <input
                        type="text" id="alamat" name="alamat"
                        value={form.alamat} onChange={handleChange}
                        placeholder="Contoh: Jl. Palapa No. 10"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Terms checkbox */}
              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox" id="agreed" checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 border-gray-300 rounded cursor-pointer accent-blue-600 shrink-0"
                />
                <label htmlFor="agreed" className="text-xs text-gray-600 cursor-pointer leading-relaxed">
                  Saya menyetujui{" "}
                  <Link to="/dashboard/register/terms" className="text-blue-600 font-medium hover:underline">Syarat dan Ketentuan</Link>{" "}
                  serta{" "}
                  <Link to="/dashboard/register/privacy" className="text-blue-600 font-medium hover:underline">Kebijakan Privasi</Link>{" "}
                  SI-RAT dalam pemrosesan data pribadi saya.
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                id="btn-register"
                disabled={!agreed || loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] text-sm mt-1"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Mendaftarkan Akun...
                  </>
                ) : (
                  <>
                    Daftar & Ajukan Verifikasi
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* To login */}
            <p className="mt-5 text-center text-sm text-gray-500">
              Sudah punya akun?{" "}
              <Link to="/dashboard/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                Masuk di sini
              </Link>
            </p>

            {/* Footer links */}
            <div className="mt-6 pt-5 border-t border-gray-100 flex justify-center gap-6">
              <Link to="/dashboard/help" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Pusat Bantuan</Link>
              <Link to="/dashboard/register/guide" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Panduan Registrasi</Link>
              <Link to="/dashboard/contact" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Kontak Kami</Link>
            </div>
          </div>
        </div>


      </div>
    </>
  );
};

export default RegisterPage;
