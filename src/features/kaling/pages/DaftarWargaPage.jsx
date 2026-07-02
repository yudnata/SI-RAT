import { useState, useEffect, useMemo } from "react";
import { api } from "../../../utils/api.js";

const DaftarWargaPage = () => {
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");

  const fetchCitizens = async () => {
    try {
      const response = await api.get("/kaling/warga");
      const mapped = (response.data.warga || []).map((w) => ({
        id: w.id,
        name: w.namaLengkap,
        relation: "Kepala Keluarga", // Default visual mapping
        nik: w.nik ? `${w.nik.substring(0, 6)}**********` : "—",
        house: w.domisili || "Banjar Tegal",
        status: w.isVerified ? "Tetap" : "Kontrak", // Visual representation
        job: w.pekerjaan || "Wiraswasta",
      }));
      setCitizens(mapped);
    } catch (err) {
      console.error("Gagal memuat daftar warga:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizens();
  }, []);

  const filteredCitizens = useMemo(() => {
    return citizens.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.job.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "Semua Status" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [citizens, searchTerm, statusFilter]);

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-extrabold text-gray-900">
          Daftar Warga
        </h1>
      </div>

      {/* Control row */}
      <div className="flex gap-4 items-center">
        {/* Search input */}
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
            placeholder="Cari nama, NIK, atau pekerjaan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        {/* Dropdown status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-205 rounded-lg text-xs font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option>Semua Status</option>
          <option value="Tetap">Tetap (Terverifikasi)</option>
          <option value="Kontrak">Kontrak (Pendatang)</option>
        </select>
      </div>

      {/* Main card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-xs text-gray-400 font-medium">
              Memuat data warga lingkungan...
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Nama Warga</th>
                  <th className="px-6 py-4">Hubungan Keluarga</th>
                  <th className="px-6 py-4">NIK</th>
                  <th className="px-6 py-4">Banjar / Rumah</th>
                  <th className="px-6 py-4">Status Tinggal</th>
                  <th className="px-6 py-4">Pekerjaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {filteredCitizens.map((item, idx) => (
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
                      <span className="font-semibold text-gray-800">
                        {item.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{item.relation}</td>
                    <td className="px-6 py-4 font-mono text-gray-450">{item.nik}</td>
                    <td className="px-6 py-4 text-gray-500">{item.house}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-widest border
                          ${
                            item.status === "Tetap"
                              ? "border-emerald-500 text-emerald-600 bg-emerald-50/20"
                              : "border-amber-500 text-amber-600 bg-amber-50/20"
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{item.job}</td>
                  </tr>
                ))}
                {filteredCitizens.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      Tidak ada data warga yang cocok dengan filter pencarian.
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

export default DaftarWargaPage;
