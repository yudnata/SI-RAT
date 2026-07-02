import { useState, useEffect } from "react";
import { api } from "../../../utils/api.js";

const StatCard = ({ label, value, sub, icon, trendUp }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between shadow-sm">
      <div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </span>
        <p className="text-2xl font-extrabold text-gray-900 mt-1">{value}</p>
        {sub && (
          <p
            className={`text-[10px] font-semibold mt-1.5 flex items-center gap-1 ${trendUp ? "text-emerald-650" : "text-gray-400"}`}
          >
            {trendUp ? "▲" : ""} {sub}
          </p>
        )}
      </div>
      <div className="text-blue-600 flex items-center justify-center mt-1">
        {icon}
      </div>
    </div>
  );
};

const AdminDashboardPage = ({ onNavigate }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [serverStatus] = useState({
    cpu: 14,
    memory: 42,
    uptime: "18d 4h 12m",
    api: "14ms",
    db: "Connected",
  });

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/dashboard/stats");
      setStats(response.data);
    } catch (err) {
      console.error("Gagal memuat statistik admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">
          Dashboard Super Admin
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Pantau performa infrastruktur server, log sistem, dan ringkasan aktivitas staf.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-gray-400 font-medium">
          Memuat data statistik admin...
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              label="Total Warga Terdaftar"
              value={stats?.users?.masyarakat || 0}
              sub="Masyarakat Aktif"
              trendUp={true}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
            <StatCard
              label="Total Staf & Kaling"
              value={stats?.users?.staff || 0}
              sub="Petugas Aktif"
              trendUp={false}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />
            <StatCard
              label="Total Pengajuan"
              value={stats?.submissions?.total || 0}
              sub="Transaksi Masuk"
              trendUp={true}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
            <StatCard
              label="Surat Selesai Proses"
              value={stats?.submissions?.completed || 0}
              sub="Terbit Tervalidasi"
              trendUp={true}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          <div className="space-y-6">
            {/* Status & Kesehatan Server */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-800">
                Status & Kesehatan Server
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">
                    Load CPU
                  </span>
                  <p className="text-lg font-extrabold text-blue-600 mt-1">
                    {serverStatus.cpu}%
                  </p>
                  <div className="w-full bg-gray-200 h-1 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${serverStatus.cpu}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">
                    Penggunaan RAM
                  </span>
                  <p className="text-lg font-extrabold text-indigo-600 mt-1">
                    {serverStatus.memory}%
                  </p>
                  <div className="w-full bg-gray-200 h-1 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${serverStatus.memory}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">
                    Uptime Server
                  </span>
                  <p className="text-xs font-extrabold text-gray-700 mt-2">
                    {serverStatus.uptime}
                  </p>
                  <span className="inline-block mt-2 w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">
                    Latency API Gateway
                  </span>
                  <p className="text-lg font-extrabold text-emerald-600 mt-1">
                    {serverStatus.api}
                  </p>
                  <span className="text-[9px] text-gray-400">Sangat Cepat</span>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center col-span-2 sm:col-span-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">
                    Koneksi Database
                  </span>
                  <p className="text-xs font-extrabold text-emerald-650 mt-2">
                    {serverStatus.db}
                  </p>
                  <span className="text-[9px] text-gray-400">PostgreSQL Cloud</span>
                </div>
              </div>
            </div>

            {/* Quick system activity logs */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-800">
                  Aktivitas & Audit Trail Terbaru
                </h3>
                <button
                  onClick={() => onNavigate("log")}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
                >
                  Lihat Selengkapnya
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {(stats?.recentLogs || []).map((log) => {
                  let logType = "info";
                  if (log.action.includes("SUCCESS") || log.action.includes("APPROVE") || log.action.includes("CREATE")) {
                    logType = "success";
                  } else if (log.action.includes("REJECT") || log.action.includes("DELETE") || log.action.includes("FAIL")) {
                    logType = "danger";
                  } else if (log.action.includes("UPDATE") || log.action.includes("WARN")) {
                    logType = "warning";
                  }

                  const formatLogDetails = (action, details) => {
                    if (!details) return action;
                    if (typeof details === "string") return details;
                    switch (action) {
                      case "USER_LOGIN":
                        return `Login berhasil sebagai ${details.role || "user"}`;
                      case "USER_REGISTER":
                        return `Registrasi akun baru berhasil`;
                      case "SUBMISSION_CREATED":
                        return `Mengajukan permohonan surat baru (${details.serviceSlug || ""})`;
                      case "SUBMISSION_KALING_APPROVED":
                        return `Menyetujui permohonan surat (diverifikasi Kaling)`;
                      case "SUBMISSION_KALING_REJECTED":
                        return `Menolak permohonan surat (Kaling): ${details.reason || ""}`;
                      case "SUBMISSION_KELURAHAN_VALIDATED":
                        return `Menandatangani/validasi surat (Kelurahan)`;
                      case "SUBMISSION_KELURAHAN_REJECTED":
                        return `Menolak permohonan surat (Kelurahan): ${details.reason || ""}`;
                      default:
                        return Object.entries(details)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ") || action;
                    }
                  };

                  return (
                    <div
                      key={log.id}
                      className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            logType === "success"
                              ? "bg-emerald-500"
                              : logType === "warning"
                                ? "bg-amber-500"
                                : logType === "danger"
                                  ? "bg-red-500"
                                  : "bg-blue-500"
                          }`}
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-800">
                            {log.action}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {formatLogDetails(log.action, log.details)} oleh{" "}
                            <span className="font-semibold text-gray-500">
                              {log.actor ? `${log.actor.namaLengkap} (${log.actor.role})` : "Sistem"}
                            </span>
                          </p>
                        </div>
                      </div>
                      <span className="text-[9px] text-gray-400 font-medium whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleTimeString("id-ID")}
                      </span>
                    </div>
                  );
                })}
                {(!stats?.recentLogs || stats.recentLogs.length === 0) && (
                  <p className="text-xs text-gray-400 text-center py-4">
                    Belum ada log audit terbaru.
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
