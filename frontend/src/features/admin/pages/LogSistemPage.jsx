import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const DUMMY_LOGS = [
  {
    id: 1,
    timestamp: "2026-06-18 19:58:32",
    type: "success",
    category: "VALIDASI",
    executor: "Lurah Renon",
    detail: "Menyetujui Surat Keterangan Domisili a.n Rahmat Hidayat (3275***)",
  },
  {
    id: 2,
    timestamp: "2026-06-18 19:12:04",
    type: "info",
    category: "USER_MGMT",
    executor: "Super Admin",
    detail:
      "Membuat akun Kepala Lingkungan baru (Bpk. Herman) untuk Banjar Anyar Renon",
  },
  {
    id: 3,
    timestamp: "2026-06-18 18:44:19",
    type: "success",
    category: "VERIFIKASI",
    executor: "Kaling Banjar Kelod",
    detail: "Memverifikasi kelengkapan akun warga baru a.n Ni Luh Putu Lestari",
  },
  {
    id: 4,
    timestamp: "2026-06-18 16:30:10",
    type: "warning",
    category: "LAYANAN",
    executor: "Lurah Renon",
    detail:
      'Mengubah berkas persyaratan Surat Keterangan Tidak Mampu (SKTM) - menambahkan "Foto Rumah"',
  },
  {
    id: 5,
    timestamp: "2026-06-18 15:22:15",
    type: "danger",
    category: "SECURITY",
    executor: "System Gateway",
    detail:
      "Gagal login berkali-kali terdeteksi dari IP 182.1.22.94 untuk user lurah.sanur",
  },
  {
    id: 6,
    timestamp: "2026-06-18 14:15:02",
    type: "info",
    category: "SYSTEM",
    executor: "System Scheduler",
    detail:
      "Backup database otomatis harian berhasil diselesaikan dan diunggah ke storage cloud",
  },
  {
    id: 7,
    timestamp: "2026-06-18 12:05:00",
    type: "warning",
    category: "USER_MGMT",
    executor: "Super Admin",
    detail: "Menonaktifkan sementara akun kaling Bpk. Joko (Banjar Kaja)",
  },
];

const LogSistemPage = () => {
  const [logs] = useState(DUMMY_LOGS);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const filterType = searchParams.get("type") || "All";

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

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.executor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterType === "All" || log.type === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">
          Log Aktivitas & Audit Sistem
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Lacak semua aktivitas administrasi, perubahan konfigurasi, serta
          kejadian keamanan secara real-time.
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
            value={searchQuery}
            onChange={(e) => updateQuery({ q: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg text-xs transition-all text-gray-800"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => updateQuery({ type: "All" })}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all border ${
              filterType === "All"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => updateQuery({ type: "success" })}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all border ${
              filterType === "success"
                ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Success
          </button>
          <button
            onClick={() => updateQuery({ type: "info" })}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all border ${
              filterType === "info"
                ? "bg-blue-50 text-blue-700 border-blue-250"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Info
          </button>
          <button
            onClick={() => updateQuery({ type: "warning" })}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all border ${
              filterType === "warning"
                ? "bg-amber-50 text-amber-700 border-amber-250"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Warning
          </button>
          <button
            onClick={() => updateQuery({ type: "danger" })}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all border ${
              filterType === "danger"
                ? "bg-red-50 text-red-700 border-red-250"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Danger
          </button>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                <th className="px-5 py-4 w-40">Waktu</th>
                <th className="px-5 py-4 w-28">Kategori</th>
                <th className="px-5 py-4 w-44">Pelaku</th>
                <th className="px-5 py-4">Detail Aktivitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium font-mono">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-4 text-gray-450 text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded-md text-[9px] font-bold uppercase tracking-wider ${
                          log.type === "success"
                            ? "border-emerald-500 text-emerald-700"
                            : log.type === "info"
                              ? "border-blue-500 text-blue-700"
                              : log.type === "warning"
                                ? "border-amber-500 text-amber-700"
                                : "border-red-500 text-red-700"
                        }`}
                      >
                        {log.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-900 font-semibold font-sans">
                      {log.executor}
                    </td>
                    <td className="px-5 py-4 text-gray-650 font-sans leading-normal">
                      {log.detail}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-5 py-12 text-center text-gray-400 font-bold font-sans"
                  >
                    Tidak ada log audit ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LogSistemPage;
