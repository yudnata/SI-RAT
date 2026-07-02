import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../../utils/api.js";

const VerifikasiWargaPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const selectedItemId = searchParams.get("item");

  const fetchQueue = async () => {
    try {
      const response = await api.get("/kelurahan/warga");
      const mapped = (response.data.warga || []).map((w) => ({
        id: w.id,
        name: w.namaLengkap,
        gender: w.jenisKelamin || "Laki-laki",
        age: 28, // Default visual fallback
        nik: w.nik,
        rt: w.domisili || "Banjar Tegal",
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
      await api.patch(`/kelurahan/warga/${wargaId}/verify`, { isVerified: true });
      setToast("Akun warga berhasil diverifikasi dan diaktifkan!");
      setTimeout(() => setToast(null), 4000);
      updateQuery({ item: "" });
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
                  <span className="text-gray-400 block">
                    Nomor Induk Kependudukan (NIK)
                  </span>
                  <span className="font-mono font-semibold text-gray-700">
                    {selectedWarga.nik}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">
                    Wilayah Banjar / Lingkungan
                  </span>
                  <span className="font-semibold text-gray-700">
                    {selectedWarga.rt}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 block">Alamat KTP</span>
                  <span className="text-gray-700 font-medium">
                    Banjar {selectedWarga.rt}, Kelurahan Panjer, Denpasar Selatan, Bali
                  </span>
                </div>
              </div>
            </div>

            {selectedWarga.status === "Menunggu" ? (
              <div className="flex gap-2.5 pt-2">
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
