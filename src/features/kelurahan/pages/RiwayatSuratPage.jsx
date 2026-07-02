import { useState, useEffect, useMemo } from "react";
import { api } from "../../../utils/api.js";

const RiwayatSuratPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");

  const fetchHistory = async () => {
    try {
      const response = await api.get("/submissions/kelurahan/history");
      const mapped = (response.data.submissions || []).map((item) => {
        const kalingEntry = item.timeline.find(t => t.action === "DIVERIFIKASI_KALING");
        return {
          id: item.id,
          name: item.user.namaLengkap,
          nik: item.user.nik,
          service: item.service.name,
          origin: kalingEntry ? `Banjar Tegal (Kaling: ${item.assignedKaling?.namaLengkap || 'I Made Herman'})` : "Langsung (Tanpa Kaling)",
          date: new Date(item.updatedAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }),
          status: item.status, // SELESAI or DITOLAK
        };
      });
      setHistory(mapped);
    } catch (err) {
      console.error("Gagal mengambil riwayat kelurahan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDownload = async (id) => {
    try {
      const response = await api.get(`/submissions/${id}/download`);
      if (response.data && response.data.url) {
        window.open(response.data.url, "_blank");
      } else {
        alert("Dokumen tidak ditemukan!");
      }
    } catch (err) {
      alert(err.message || "Gagal mengunduh berkas.");
    }
  };

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nik.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "Semua Status" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [history, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const selesai = history.filter(s => s.status === "SELESAI").length;
    const ditolak = history.filter(s => s.status === "DITOLAK").length;
    return { selesai, ditolak };
  }, [history]);

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">
          Riwayat Validasi Kelurahan
        </h1>
        <p className="text-xs text-gray-400 mt-0.5 font-medium">
          Daftar seluruh keputusan validasi TTE dan tanda tangan basah yang telah diproses oleh Kelurahan.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Total Selesai (Diterbitkan)
          </p>
          <p className="text-2xl font-extrabold text-gray-900">{stats.selesai}</p>
          <p className="text-[10px] text-green-500 font-bold">✓ Terbit Berhasil</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Total Ditolak
          </p>
          <p className="text-2xl font-extrabold text-gray-900">{stats.ditolak}</p>
          <p className="text-[10px] text-red-500 font-bold">✗ Berkas Tidak Valid</p>
        </div>
      </div>

      {/* Main Table card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-5">
        {/* Controls row */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-50 pb-4">
          <div className="flex gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Cari nama atau NIK..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-650 bg-white"
            >
              <option>Semua Status</option>
              <option value="SELESAI">SELESAI</option>
              <option value="DITOLAK">DITOLAK</option>
            </select>
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-xs text-gray-400 font-medium">
              Memuat data riwayat kelurahan...
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Nama Warga</th>
                  <th className="px-6 py-4">Jenis Surat</th>
                  <th className="px-6 py-4">Asal Kaling / Banjar</th>
                  <th className="px-6 py-4">Tanggal Selesai</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {filteredHistory.map((item, idx) => {
                  const badgeStyle =
                    item.status === "SELESAI"
                      ? "border-emerald-500 text-emerald-600 bg-emerald-50/10"
                      : "border-red-500 text-red-650 bg-red-50/10";
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
                          <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
                            {item.nik}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-semibold">
                        {item.service}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{item.origin}</td>
                      <td className="px-6 py-4 text-gray-400">{item.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wide ${badgeStyle}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${item.status === "SELESAI" ? "bg-green-500" : "bg-red-500"}`}
                          />
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {item.status === "SELESAI" && (
                          <button
                            onClick={() => handleDownload(item.id)}
                            className="inline-flex items-center justify-center p-2 border border-gray-250 rounded-lg text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                            aria-label="Unduh Dokumen"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredHistory.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      Tidak ada data riwayat keputusan yang ditemukan.
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

export default RiwayatSuratPage;
