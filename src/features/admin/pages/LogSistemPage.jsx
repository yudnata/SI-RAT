import { useState, useEffect, useMemo } from "react";
import { api } from "../../../utils/api.js";

const LogSistemPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  const fetchLogs = async () => {
    try {
      const response = await api.get("/admin/dashboard/logs?limit=100");
      // Logs are paginated in paginated wrapper response.data.results
      const data = response.data.results || response.data.data || [];
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

      const mapped = data.map((log) => {
        // Infer visual type
        let logType = "info";
        if (log.action.includes("SUCCESS") || log.action.includes("APPROVE") || log.action.includes("CREATE")) {
          logType = "success";
        } else if (log.action.includes("REJECT") || log.action.includes("DELETE") || log.action.includes("FAIL")) {
          logType = "danger";
        } else if (log.action.includes("UPDATE") || log.action.includes("WARN")) {
          logType = "warning";
        }

        return {
          id: log.id,
          timestamp: new Date(log.createdAt).toLocaleString("id-ID"),
          type: logType,
          category: log.action,
          executor: log.actor ? `${log.actor.namaLengkap} (${log.actor.role})` : "Sistem",
          detail: formatLogDetails(log.action, log.details),
        };
      });
      setLogs(mapped);
    } catch (err) {
      console.error("Gagal mengambil logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.executor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filterType === "All" || log.type === filterType;

      return matchesSearch && matchesFilter;
    });
  }, [logs, searchTerm, filterType]);

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">
          Log Aktivitas & Audit Sistem
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Lacak semua aktivitas administrasi, perubahan konfigurasi, serta kejadian keamanan secara real-time.
        </p>
      </div>

      {/* Filters and Search Panel */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
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
            placeholder="Cari kata kunci detail log, pelaku, atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-305 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg text-xs transition-all text-gray-800 font-medium"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setFilterType("All")}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all border ${
              filterType === "All"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterType("success")}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all border ${
              filterType === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Sukses
          </button>
          <button
            onClick={() => setFilterType("warning")}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all border ${
              filterType === "warning"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Peringatan
          </button>
          <button
            onClick={() => setFilterType("danger")}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all border ${
              filterType === "danger"
                ? "bg-red-50 text-red-705 border-red-200"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Bahaya
          </button>
        </div>
      </div>

      {/* Main card containing Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-xs text-gray-400 font-medium">
              Memuat data log audit...
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Waktu</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Pelaku</th>
                  <th className="px-6 py-4">Detail Aktivitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-650">
                {filteredLogs.map((log) => {
                  let badgeStyle = "bg-blue-50 text-blue-700 border-blue-100";
                  if (log.type === "success") {
                    badgeStyle = "bg-green-50 text-green-700 border-green-100";
                  } else if (log.type === "warning") {
                    badgeStyle = "bg-amber-50 text-amber-700 border-amber-100";
                  } else if (log.type === "danger") {
                    badgeStyle = "bg-red-50 text-red-700 border-red-100";
                  }

                  return (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-gray-400 font-mono">
                        {log.timestamp}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase tracking-wide ${badgeStyle}`}>
                          {log.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-800">{log.executor}</td>
                      <td className="px-6 py-4 text-gray-500 font-medium leading-relaxed max-w-sm truncate" title={log.detail}>
                        {log.detail}
                      </td>
                    </tr>
                  );
                })}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                      Tidak ada catatan log audit yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogSistemPage;
