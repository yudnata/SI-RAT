import { useState } from "react";

const DUMMY_HISTORY = [
  {
    name: "IVAN FROM CHINA",
    block: "Blok A No. 12",
    service: "Surat Pengantar KTP",
    date: "12 Okt 2023, 14:20",
    status: "Disetujui",
  },
  {
    name: "Siti Pertiwi",
    block: "Blok C No. 04",
    service: "Domisili Usaha",
    date: "11 Okt 2023, 09:15",
    status: "Ditolak",
  },
  {
    name: "Bambang Pamungkas",
    block: "Blok B No. 22",
    service: "Izin Keramaian",
    date: "10 Okt 2023, 16:45",
    status: "Disetujui",
  },
  {
    name: "Dewi Wahyuni",
    block: "Blok D No. 01",
    service: "Keterangan Pindah",
    date: "09 Okt 2023, 11:30",
    status: "Disetujui",
  },
  {
    name: "Rizky Kurniawan",
    block: "Blok A No. 05",
    service: "Surat Keterangan Kematian",
    date: "08 Okt 2023, 10:05",
    status: "Ditolak",
  },
  {
    name: "Rizky Kurniawan",
    block: "Blok A No. 05",
    service: "Surat Keterangan Kematian",
    date: "08 Okt 2023, 10:05",
    status: "Ditolak",
  },
  {
    name: "Rizky Kurniawan",
    block: "Blok A No. 05",
    service: "Surat Keterangan Kematian",
    date: "08 Okt 2023, 10:05",
    status: "Ditolak",
  },
];

const RiwayatVerifikasiPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");

  const filteredHistory = DUMMY_HISTORY.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "Semua Status" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">
          Riwayat Verifikasi
        </h1>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold text-gray-500">
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
                className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5">Jenis Surat</label>
            <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option>Semua Jenis</option>
              <option>Surat Pengantar KTP</option>
              <option>Domisili Usaha</option>
              <option>Izin Keramaian</option>
              <option>Keterangan Pindah</option>
              <option>Surat Keterangan Kematian</option>
            </select>
          </div>

          <div>
            <label className="block mb-1.5">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option>Semua Status</option>
              <option>Disetujui</option>
              <option>Ditolak</option>
            </select>
          </div>

          <div>
            <label className="block mb-1.5">Rentang Tanggal</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Nama Warga</th>
                <th className="px-6 py-4">Jenis Surat</th>
                <th className="px-6 py-4">Tanggal Selesai</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
              {filteredHistory.map((item, idx) => {
                const badgeStyle =
                  item.status === "Disetujui"
                    ? "border-green-500 text-green-600"
                    : "border-red-500 text-red-600";
                return (
                  <tr
                    key={idx}
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
                    <td className="px-6 py-4 text-gray-400">{item.date}</td>
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
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all">
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
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-semibold text-gray-400">
          <span>Menampilkan {filteredHistory.length} dari 128 permohonan</span>
          <div className="flex gap-1">
            <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-500">
              &lt;
            </button>
            <button className="w-7 h-7 flex items-center justify-center bg-slate-900 text-white rounded">
              1
            </button>
            <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-500">
              2
            </button>
            <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-500">
              3
            </button>
            <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-500">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiwayatVerifikasiPage;
