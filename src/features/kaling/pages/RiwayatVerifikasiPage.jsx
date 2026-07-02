import { useState, useEffect, useMemo } from "react";
import { api } from "../../../utils/api.js";

const RiwayatVerifikasiPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [serviceFilter, setServiceFilter] = useState("Semua Jenis");

  const fetchHistory = async () => {
    try {
      const response = await api.get("/submissions/kaling/history");
      const mapped = (response.data.submissions || []).map((item) => {
        const isApproved = !["DITOLAK", "DITOLAK_KALING"].includes(item.status);
        return {
          id: item.id,
          name: item.user.namaLengkap,
          block: item.user.domisili || "Banjar Tegal",
          service: item.service.name,
          date: new Date(item.updatedAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }),
          status: isApproved ? "Disetujui" : "Ditolak",
        };
      });
      setHistory(mapped);
    } catch (err) {
      console.error("Gagal mengambil riwayat verifikasi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "Semua Status" || item.status === statusFilter;
      const matchesService =
        serviceFilter === "Semua Jenis" || item.service === serviceFilter;
      return matchesSearch && matchesStatus && matchesService;
    });
  }, [history, searchTerm, statusFilter, serviceFilter]);

  // Extract unique service names for select dropdown
  const uniqueServices = useMemo(() => {
    const services = new Set(history.map(item => item.service));
    return ["Semua Jenis", ...Array.from(services)];
  }, [history]);

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">
          Riwayat Verifikasi
        </h1>
        <p className="text-xs text-gray-400 mt-0.5 font-medium">
          Daftar seluruh keputusan permohonan warga yang telah Anda proses.
        </p>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold text-gray-500">
          <div>
            <label className="block mb-1.5">Cari Nama</label>
            <div className="relative">
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
                placeholder="Nama warga..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5">Jenis Surat</label>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
            >
              {uniqueServices.map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1.5">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
            >
              <option>Semua Status</option>
              <option>Disetujui</option>
              <option>Ditolak</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-xs text-gray-400 font-medium">
              Memuat riwayat verifikasi...
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Nama Warga</th>
                  <th className="px-6 py-4">Jenis Surat</th>
                  <th className="px-6 py-4">Tanggal Keputusan</th>
                  <th className="px-6 py-4">Keputusan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {filteredHistory.map((item, idx) => {
                  const badgeStyle =
                    item.status === "Disetujui"
                      ? "border-green-500 text-green-600"
                      : "border-red-500 text-red-650";
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
                            {item.block}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-semibold">
                        {item.service}
                      </td>
                      <td className="px-6 py-4 text-gray-450">{item.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wide ${badgeStyle}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${item.status === "Disetujui" ? "bg-green-500" : "bg-red-500"}`}
                          />
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {filteredHistory.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                      Tidak ada data riwayat keputusan yang cocok dengan filter.
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

export default RiwayatVerifikasiPage;
