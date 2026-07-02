import { useState, useEffect, useMemo } from "react";
import { api } from "../../../utils/api.js";

const StatCard = ({ label, value, sub, type, icon }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-start justify-between shadow-sm">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-3xl font-extrabold text-gray-900">{value}</p>
        <p className={`text-xs font-medium ${type === "alert" ? "text-red-500" : "text-gray-400"}`}>
          {sub}
        </p>
      </div>
      <div className="flex items-center justify-center flex-shrink-0 mt-1">
        {icon}
      </div>
    </div>
  );
};

const DashboardPage = ({ onNavigate }) => {
  const [pendingQueue, setPendingQueue] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [wargaCount, setWargaCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch pending
      const pendingRes = await api.get("/submissions/kaling/pending");
      const mappedPending = (pendingRes.data.submissions || []).map((s) => ({
        id: s.id,
        name: s.user.namaLengkap,
        nik: s.user.nik,
        serviceName: s.service.name,
        date: new Date(s.createdAt).toLocaleDateString("id-ID", { dateStyle: "medium" }),
      }));
      setPendingQueue(mappedPending);

      // 2. Fetch history
      const historyRes = await api.get("/submissions/kaling/history");
      setHistoryList(historyRes.data.submissions || []);

      // 3. Fetch warga list
      const wargaRes = await api.get("/kaling/warga");
      setWargaCount((wargaRes.data.warga || []).length);
    } catch (err) {
      console.error("Gagal memuat data dashboard kaling:", err);
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
      completed: historyList.length,
      totalWarga: wargaCount,
    };
  }, [pendingQueue, historyList, wargaCount]);

  return (
    <div className="w-full space-y-6 pb-12">
      {loading ? (
        <div className="text-center py-12 text-xs text-gray-400 font-medium">
          Memuat data dashboard kaling...
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              label="Total Warga Lingkungan"
              value={stats.totalWarga}
              sub="Warga terdata di sistem"
              icon={
                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 18M14.214 16.058A9.394 9.394 0 0010 15.14c-2.133 0-4.054.712-5.586 1.918A4.125 4.125 0 001.07 19.57a9.333 9.333 0 008.267 1.058m7.414-16.141a3 3 0 11-5.714 0M12 7a3 3 0 11-6 0" />
                </svg>
              }
            />
            <StatCard
              label="Perlu Verifikasi"
              value={stats.pending}
              sub={stats.pending > 0 ? "Butuh tindakan segera" : "Semua surat selesai"}
              type={stats.pending > 0 ? "alert" : "info"}
              icon={
                <svg
                  className={`w-6 h-6 ${stats.pending > 0 ? "text-red-500 animate-pulse" : "text-gray-400"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
            />
            <StatCard
              label="Selesai Diperiksa"
              value={stats.completed}
              sub="Total riwayat disposisi kaling"
              icon={
                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          {/* Queue Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-800">
                Antrean Verifikasi Terbaru
              </h2>
              <button
                onClick={() => onNavigate("verifikasi")}
                className="text-xs font-bold text-blue-650 hover:text-blue-800 transition-colors"
              >
                Lihat Semua
              </button>
            </div>

            <div className="overflow-x-auto">
              {pendingQueue.length === 0 ? (
                <div className="text-center py-8 text-gray-450 text-xs">
                  <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Tidak ada antrean verifikasi yang tertunda.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Nama Warga</th>
                      <th className="px-6 py-4">Jenis Layanan</th>
                      <th className="px-6 py-4">Tanggal Masuk</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                    {pendingQueue.slice(0, 5).map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {item.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span className="font-semibold text-gray-800">{item.name}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-650 font-semibold">{item.serviceName}</td>
                        <td className="px-6 py-4 text-gray-400">{item.date}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => onNavigate("verifikasi")}
                            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold transition-all"
                          >
                            Verifikasi
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
