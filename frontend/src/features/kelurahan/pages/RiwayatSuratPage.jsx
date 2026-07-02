import { useState } from "react";

const DUMMY_HISTORY = [
  {
    name: "I Gede Wirawan",
    nik: "5171010506790004",
    service: "Surat Keterangan Ahli Waris",
    origin: "Banjar Anyar (Kaling: I Ketut Darma)",
    date: "22 Okt 2026, 15:45 WIB",
    status: "SELESAI",
  },
  {
    name: "Siti Lestari",
    nik: "327508410589004",
    service: "Surat Pengantar Nikah",
    origin: "Banjar Tegal",
    date: "20 Okt 2026, 09:15 WIB",
    status: "DITOLAK",
  },
  {
    name: "Putu Rahayu",
    nik: "327508210375002",
    service: "Surat Keterangan Tidak Mampu (SKTM)",
    origin: "Banjar Kaja",
    date: "18 Okt 2026, 16:45 WIB",
    status: "SELESAI",
  },
  {
    name: "Dewi Ratna Sari",
    nik: "327508550792003",
    service: "Surat Keterangan Kematian",
    origin: "Banjar Kelod",
    date: "15 Okt 2026, 11:30 WIB",
    status: "SELESAI",
  },
  {
    name: "Komang Ayu Lestari",
    nik: "327508780195001",
    service: "Surat Keterangan Domisili",
    origin: "Banjar Anyar",
    date: "12 Okt 2026, 14:00 WIB",
    status: "SELESAI",
  },
  {
    name: "Ni Made Suparmi",
    nik: "327508550390005",
    service: "Surat Keterangan Masih Hidup",
    origin: "Langsung (Tanpa Kaling)",
    date: "10 Okt 2026, 10:30 WIB",
    status: "SELESAI",
  },
];

const RiwayatSuratPage = () => {
  const [list] = useState(DUMMY_HISTORY);

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">
          Riwayat Verifikasi Surat
        </h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Total Selesai
          </p>
          <p className="text-2xl font-extrabold text-gray-900">1,248</p>
          <p className="text-[10px] text-green-500 font-bold">↑ 12%</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Total Ditolak
          </p>
          <p className="text-2xl font-extrabold text-gray-900">42</p>
          <p className="text-[10px] text-red-500 font-bold">↓ 3%</p>
        </div>
      </div>

      {/* Main Table card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-5">
        {/* Controls row */}
        <div className="flex gap-4 items-center justify-between border-b border-gray-50 pb-4">
          <div className="flex gap-3">
            <div className="flex items-center border border-gray-200 rounded-lg px-2.5 bg-white">
              <span className="text-[10px] text-gray-400 mr-2">📅</span>
              <input
                type="text"
                defaultValue="01 Jan 2024 - 31 Jan 2024"
                className="border-0 focus:ring-0 text-xs py-1.5 w-48 text-gray-600 focus:outline-none"
              />
            </div>
            <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 bg-white">
              <option>Semua Kaling / Banjar</option>
            </select>
          </div>

          <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Unduh Laporan
          </button>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Nama Warga</th>
                <th className="px-6 py-4">Jenis Surat</th>
                <th className="px-6 py-4">Kaling / Banjar Asal</th>
                <th className="px-6 py-4">Tanggal Selesai</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
              {list.map((item, idx) => {
                const badgeStyle =
                  item.status === "SELESAI"
                    ? "border-emerald-500 text-green-600"
                    : "border-red-500 text-red-650";
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
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                          NIK: {item.nik}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-semibold">
                      {item.service}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded border border-gray-350 text-gray-600 font-bold text-[9px] uppercase tracking-wide">
                        {item.origin}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{item.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wide ${badgeStyle}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded transition-all">
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
          <span>Menampilkan 1-6 dari 1,290 entri</span>
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
            <span className="px-2 py-1 flex items-end">...</span>
            <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-500">
              323
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

export default RiwayatSuratPage;
