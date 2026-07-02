import { useState, useEffect, useMemo } from "react";
import { api } from "../../../utils/api.js";

const StatCard = ({ label, value, sub, type }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {label}
          </span>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">{value}</p>
        </div>
        {sub && (
          <span
            className={`text-[10px] font-extrabold px-1.5 py-0.5 border rounded ${type === "alert" ? "text-red-650 border-red-400" : "text-gray-500 border-gray-300"}`}
          >
            {sub}
          </span>
        )}
      </div>
    </div>
  );
};

const KelurahanDashboardPage = ({ onNavigate }) => {
  const [pendingQueue, setPendingQueue] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [wargaCount, setWargaCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch pending validations
      const pendingRes = await api.get("/submissions/kelurahan/pending");
      setPendingQueue(pendingRes.data.submissions || []);

      // 2. Fetch history
      const historyRes = await api.get("/submissions/kelurahan/history");
      setHistoryList(historyRes.data.submissions || []);

      // 3. Fetch warga list to get count
      const wargaRes = await api.get("/kelurahan/warga");
      setWargaCount((wargaRes.data.warga || []).length);
    } catch (err) {
      console.error("Gagal mengambil data dashboard kelurahan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    return {
      pending: pendingQueue.length,
      completed: historyList.filter(h => h.status === "SELESAI").length,
      totalWarga: wargaCount,
    };
  }, [pendingQueue, historyList, wargaCount]);

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">
          Dashboard Admin Kelurahan
        </h1>
        <p className="text-xs text-gray-400 mt-0.5 font-medium">
          Pantau antrean pengajuan surat, histori pelayanan, dan validasi TTE Kelurahan secara real-time.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-gray-400 font-medium">
          Memuat data dashboard kelurahan...
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              label="Menunggu Validasi"
              value={stats.pending}
              sub="TTE Pending"
              type={stats.pending > 0 ? "alert" : "normal"}
            />
            <StatCard label="Total Diselesaikan" value={stats.completed} sub="Terbit" />
            <StatCard label="Total Warga Terdaftar" value={stats.totalWarga} />
          </div>

          {/* Layout grid columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column (2/3 width) */}
            <div className="md:col-span-2 space-y-6">
              {/* Antrean Verifikasi Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-800">
                  Antrean Verifikasi Kelurahan
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                        <th className="px-5 py-3">Pemohon</th>
                        <th className="px-5 py-3">Layanan</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                      {pendingQueue.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-5 py-3">
                            <p className="font-semibold text-gray-800">
                              {item.user?.namaLengkap}
                            </p>
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                              {item.user?.nik}
                            </p>
                          </td>
                          <td className="px-5 py-3 text-gray-600 font-semibold">{item.service?.name}</td>
                          <td className="px-5 py-3">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded border border-amber-500 text-[9px] font-bold text-amber-600 uppercase tracking-wide">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              VERIFIKASI
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <button
                              onClick={() => onNavigate("validasi-surat")}
                              className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-bold text-[10px] transition-all"
                            >
                              Validasi
                            </button>
                          </td>
                        </tr>
                      ))}
                      {pendingQueue.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                            Tidak ada antrean validasi baru.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column (1/3 width) */}
            <div className="space-y-6">
              {/* Aktivitas Terkini Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-800">
                  Aktivitas Pelayanan Terkini
                </h3>
                <div className="space-y-3.5">
                  {historyList.slice(0, 5).map((act) => (
                    <div key={act.id} className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mt-0.5 flex-shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">
                          {act.service?.name} ({act.status})
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          a.n {act.user?.namaLengkap} — {new Date(act.updatedAt).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                  {historyList.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">
                      Belum ada riwayat aktivitas terbaru.
                    </p>
                  )}
                </div>
              </div>

              {/* Validasi Mendesak Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-800">
                    Peringatan Antrean
                  </h3>
                  <button
                    onClick={() => onNavigate("validasi-surat")}
                    className="text-[10px] font-bold text-blue-650 hover:text-blue-800 uppercase tracking-wider"
                  >
                    Lihat Semua
                  </button>
                </div>

                <div className="space-y-3">
                  {pendingQueue.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-100 rounded-lg p-3 hover:border-gray-200 transition-colors bg-amber-50/5"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[8px] font-bold uppercase tracking-wider text-red-600">
                          PRIORITAS TINGGI
                        </span>
                        <span className="text-[8px] text-gray-400 font-mono">
                          {new Date(item.createdAt).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-800 leading-snug">
                        {item.service?.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {item.user?.namaLengkap}
                      </p>
                    </div>
                  ))}
                  {pendingQueue.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">
                      Tidak ada antrean validasi saat ini.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default KelurahanDashboardPage;
