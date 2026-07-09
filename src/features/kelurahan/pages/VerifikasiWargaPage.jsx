import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../../utils/api.js";

const INDO_WORDS = [
  'kucing', 'anjing', 'pohon', 'bunga', 'rumah', 'jalan', 'mobil', 'sepeda',
  'gunung', 'laut', 'pantai', 'sungai', 'danau', 'langit', 'bintang', 'bulan',
  'matahari', 'awan', 'hujan', 'angin', 'tanah', 'batu', 'pasir', 'api',
  'air', 'es', 'kayu', 'besi', 'emas', 'perak', 'kertas', 'buku',
  'pena', 'pensil', 'meja', 'kursi', 'pintu', 'jendela', 'dinding', 'atap',
  'kamar', 'dapur', 'taman', 'pasar', 'sekolah', 'kantor', 'toko', 'sawah',
  'hutan', 'kebun', 'burung', 'ikan', 'kupu', 'gajah', 'singa', 'harimau',
  'kuda', 'sapi', 'kambing', 'ayam', 'bebek', 'kelinci', 'monyet', 'tupai'
];

const generatePassphrase = () => {
  const count = Math.floor(Math.random() * 3) + 4; // 4 to 6 words
  const words = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * INDO_WORDS.length);
    words.push(INDO_WORDS[randomIndex]);
  }
  return words.join('-');
};

const VerifikasiWargaPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const selectedItemId = searchParams.get("item");

  const [shouldSendEmail, setShouldSendEmail] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");

  useEffect(() => {
    setGeneratedPassword("");
    setShouldSendEmail(true);
  }, [selectedItemId]);

  const fetchQueue = async () => {
    try {
      const response = await api.get("/kelurahan/warga");
      const mapped = (response.data.warga || []).map((w) => ({
        id: w.id,
        name: w.namaLengkap,
        gender: w.jenisKelamin || "Laki-laki",
        age: 28,
        nik: w.nik,
        rt: w.domisili || "Banjar Tegal",
        email: w.email || "-",
        noWhatsapp: w.noWhatsapp || "-",
        ktpUrl: w.ktpUrl || null,
        date: new Date(w.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        status: w.isVerified ? "Disetujui" : "Menunggu",
      }));
      setList(mapped);
    } catch (err) {
      console.error("Gagal mengambil antrean verifikasi warga:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
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

  const handleApprove = async (wargaId) => {
    try {
      const payload = { isVerified: true };
      if (shouldSendEmail && generatedPassword) {
        payload.password = generatedPassword;
      }
      await api.patch(`/kelurahan/warga/${wargaId}/verify`, payload);
      setToast("Akun warga berhasil diverifikasi dan diaktifkan.");
      setTimeout(() => setToast(null), 4000);
      updateQuery({ item: "" });
      setGeneratedPassword("");
      setShouldSendEmail(true);
      fetchQueue();
    } catch (err) {
      alert(err.message || "Gagal memverifikasi akun.");
    }
  };

  const handleReject = async (wargaId) => {
    try {
      await api.patch(`/kelurahan/warga/${wargaId}/verify`, { isVerified: false });
      setToast("Akun warga ditolak.");
      setTimeout(() => setToast(null), 4000);
      updateQuery({ item: "" });
      fetchQueue();
    } catch (err) {
      alert(err.message || "Gagal menolak akun.");
    }
  };

  const selectedWarga = useMemo(() => {
    return list.find((item) => String(item.id) === String(selectedItemId)) || null;
  }, [list, selectedItemId]);

  const stats = useMemo(() => {
    const waiting = list.filter(w => w.status === "Menunggu").length;
    const verified = list.filter(w => w.status === "Disetujui").length;
    return { waiting, verified, total: list.length };
  }, [list]);

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-xs font-bold">{toast}</p>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">
          Verifikasi Akun Warga
        </h1>
        <p className="text-xs text-gray-400 mt-0.5 font-medium">
          Daftar seluruh akun warga yang mendaftar dan membutuhkan verifikasi profil NIK agar bisa mengajukan surat.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menunggu Verifikasi
          </p>
          <p className="text-2xl font-extrabold text-gray-900">{stats.waiting}</p>
          <p className="text-[10px] text-gray-400">Butuh keputusan segera</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Diverifikasi
          </p>
          <p className="text-2xl font-extrabold text-gray-900">{stats.verified}</p>
          <p className="text-[10px] text-green-500 font-bold">✓ Akun Aktif</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Total Warga Terdaftar
          </p>
          <p className="text-2xl font-extrabold text-gray-900">{stats.total}</p>
          <p className="text-[10px] text-gray-400">Terdaftar di SI-RAT</p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-50 pb-4">
          <h2 className="text-sm font-bold text-gray-800">
            Daftar Antrean Verifikasi
          </h2>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-xs text-gray-400 font-medium">
              Memuat data antrean verifikasi warga...
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Nama Warga</th>
                  <th className="px-6 py-4">NIK</th>
                  <th className="px-6 py-4">Banjar / Lingkungan</th>
                  <th className="px-6 py-4">Tanggal Daftar</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {list.map((item, idx) => {
                  const badgeStyle =
                    item.status === "Disetujui"
                      ? "border-green-500 text-green-600 bg-green-50/10"
                      : "border-amber-500 text-amber-600 bg-amber-50/10";
                  return (
                    <tr
                      key={item.id || idx}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">
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
                            {item.gender}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-500">
                        {item.nik}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{item.rt}</td>
                      <td className="px-6 py-4 text-gray-400">{item.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wide ${badgeStyle}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.status === "Disetujui" ? "bg-green-500" : "bg-amber-500"
                            }`}
                          />
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            updateQuery({ item: item.id });
                          }}
                          className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold transition-all"
                        >
                          {item.status === "Menunggu" ? "Verifikasi" : "Lihat Detail"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {list.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      Tidak ada akun warga yang mendaftar saat ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Review Verifikasi */}
      {selectedWarga && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 flex flex-col gap-4 relative animate-scaleIn">
            <button
              onClick={() => {
                updateQuery({ item: "" });
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div>
              <h3 className="text-base font-bold text-gray-900">
                Review Verifikasi Akun
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Periksa keabsahan data NIK dan berkas identitas pemohon sebelum memberikan persetujuan akun.
              </p>
            </div>

            {/* Profile Info */}
            <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-transparent">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 border border-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                  {selectedWarga.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">
                    {selectedWarga.name}
                  </h4>
                  <p className="text-[10px] text-gray-400">
                    {selectedWarga.gender} — Terdaftar pada {selectedWarga.date}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                <div>
                  <span className="text-gray-400 block">Nomor Induk Kependudukan (NIK)</span>
                  <span className="font-mono font-semibold text-gray-700">{selectedWarga.nik}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Wilayah Banjar / Lingkungan</span>
                  <span className="font-semibold text-gray-700">{selectedWarga.rt}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Email</span>
                  <span className="text-gray-700 font-medium">{selectedWarga.email}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">No. WhatsApp</span>
                  <span className="text-gray-700 font-medium">{selectedWarga.noWhatsapp}</span>
                </div>
              </div>

              {/* Foto KTP */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400 block mb-2 font-semibold">Foto KTP</span>
                {selectedWarga.ktpUrl ? (
                  <a href={selectedWarga.ktpUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <img
                      src={selectedWarga.ktpUrl}
                      alt="Foto KTP"
                      className="w-full max-h-48 object-contain rounded-lg border border-gray-200 bg-gray-50 hover:opacity-90 transition-opacity cursor-zoom-in"
                    />
                    <p className="text-[10px] text-blue-500 mt-1 text-center">Klik untuk buka full size</p>
                  </a>
                ) : (
                  <div className="w-full h-24 rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
                    <p className="text-xs text-gray-400">Foto KTP tidak tersedia</p>
                  </div>
                )}
              </div>
            </div>

            {selectedWarga.status === "Menunggu" ? (
              <div className="space-y-4 pt-2">
                {/* Generate password and notify section */}
                <div className="border border-amber-100 bg-amber-50/20 rounded-xl p-3.5 space-y-3 text-left">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 select-none">
                    <input
                      type="checkbox"
                      checked={shouldSendEmail}
                      onChange={(e) => setShouldSendEmail(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                    />
                    Buat Password Baru & Kirim Email Notifikasi
                  </label>

                  {shouldSendEmail && (
                    <div className="space-y-1.5 animate-fadeIn">
                      <span className="text-[10px] text-gray-400 block font-semibold">PASSWORD LOG IN SEMENTARA</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Klik Generate atau isi password manual..."
                          value={generatedPassword}
                          onChange={(e) => setGeneratedPassword(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono font-bold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setGeneratedPassword(generatePassphrase())}
                          className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-lg text-[10px] border border-blue-200 transition-colors shrink-0"
                        >
                          Generate
                        </button>
                      </div>
                      <p className="text-[9px] text-amber-600 leading-normal font-medium">
                        * Password berupa 4-6 kata acak (passphrase) yang dikirim ke email pemohon agar mudah diingat dan aman.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => handleReject(selectedWarga.id)}
                    className="flex-1 py-2 border border-red-200 hover:bg-red-50 text-red-650 rounded-lg text-xs font-bold transition-colors"
                  >
                    Tolak Pendaftaran
                  </button>
                  <button
                    onClick={() => handleApprove(selectedWarga.id)}
                    className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                  >
                    Setujui & Aktifkan Akun
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-2 text-center">
                <span
                  className="inline-flex px-4 py-2 border border-green-300 text-green-700 text-xs font-bold rounded-lg"
                >
                  Status Akun: Diverifikasi & Aktif
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifikasiWargaPage;
