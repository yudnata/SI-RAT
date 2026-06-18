import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const DUMMY_CITIZEN_QUEUE = [
  {
    name: "Budi Santoso",
    gender: "Laki-laki",
    age: 32,
    nik: "3275012345678901",
    rt: "Banjar Anyar",
    date: "12 Okt 2023, 09:15",
    status: "Disetujui",
  },
  {
    name: "Siti Maemunah",
    gender: "Perempuan",
    age: 28,
    nik: "3271044410950001",
    rt: "Banjar Tegal",
    date: "11 Okt 2023, 14:40",
    status: "Menunggu",
  },
  {
    name: "Andi Herlambang",
    gender: "Laki-laki",
    age: 45,
    nik: "3271046501780002",
    rt: "Banjar Kaja",
    date: "11 Okt 2023, 10:22",
    status: "Menunggu",
  },
  {
    name: "Dewi Wahyuni",
    gender: "Perempuan",
    age: 22,
    nik: "3271046108910005",
    rt: "Banjar Kelod",
    date: "10 Okt 2023, 16:55",
    status: "Menunggu",
  },
  {
    name: "Rizky Junaedi",
    gender: "Laki-laki",
    age: 38,
    nik: "3271041903840004",
    rt: "Banjar Anyar",
    date: "10 Okt 2023, 11:30",
    status: "Menunggu",
  },
];

const VerifikasiWargaPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [list, setList] = useState(DUMMY_CITIZEN_QUEUE);
  const selectedItemId = searchParams.get("item");
  const selectedIndex = list.findIndex(
    (item) => String(item.id ?? item.nik) === String(selectedItemId),
  );
  const selectedWarga = selectedIndex >= 0 ? list[selectedIndex] : null;

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

  const handleApprove = () => {
    if (selectedIndex === -1) return;
    const updated = [...list];
    updated[selectedIndex].status = "Disetujui";
    setList(updated);
    updateQuery({ item: "" });
  };

  const handleReject = () => {
    if (selectedIndex === -1) return;
    const updated = [...list];
    updated[selectedIndex].status = "Ditolak";
    setList(updated);
    updateQuery({ item: "" });
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">
          Verifikasi Akun Warga
        </h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menunggu Verifikasi
          </p>
          <p className="text-2xl font-extrabold text-gray-900">24</p>
          <p className="text-[10px] text-gray-400">+5 hari ini</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Diverifikasi (Bulan Ini)
          </p>
          <p className="text-2xl font-extrabold text-gray-900">142</p>
          <p className="text-[10px] text-blue-500 font-bold">
            12% dari bulan lalu
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Total Warga Terdaftar
          </p>
          <p className="text-2xl font-extrabold text-gray-900">8,432</p>
          <p className="text-[10px] text-gray-400">Data tervalidasi 88%</p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-50 pb-4">
          <h2 className="text-sm font-bold text-gray-800">
            Daftar Antrean Verifikasi
          </h2>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">Urutkan:</span>
            <select className="px-2.5 py-1 border border-gray-200 rounded text-xs font-bold text-gray-600 focus:outline-none bg-white">
              <option>Terbaru</option>
            </select>
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4">NIK</th>
                <th className="px-6 py-4">Banjar / Lingkungan</th>
                <th className="px-6 py-4">Tanggal Daftar</th>
                <th className="px-6 py-4">Status Verifikasi</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
              {list.map((item, idx) => {
                const badgeStyle =
                  item.status === "Disetujui"
                    ? "border-green-500 text-green-600"
                    : item.status === "Ditolak"
                      ? "border-red-500 text-red-600"
                      : "border-gray-300 text-gray-500";
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
                          {item.gender}, {item.age} Thn
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-500">
                      {item.nik}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{item.rt}</td>
                    <td className="px-6 py-4 text-gray-400">{item.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wide ${badgeStyle}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === "Disetujui"
                              ? "bg-green-500"
                              : item.status === "Ditolak"
                                ? "bg-red-500"
                                : "bg-gray-400"
                          }`}
                        />
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.status === "Menunggu" ? (
                        <button
                          onClick={() => {
                            updateQuery({ item: item.id ?? item.nik });
                          }}
                          className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold transition-all"
                        >
                          Verifikasi
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            updateQuery({ item: item.id ?? item.nik });
                          }}
                          className="p-1 text-gray-400 hover:text-gray-650 rounded transition-all"
                          aria-label="Lihat Detail"
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
                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-semibold text-gray-400">
          <span>Menampilkan 1-5 dari 24 warga</span>
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

      {/* Modal Review Verifikasi */}
      {selectedWarga && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 flex flex-col gap-4 relative animate-scaleIn">
            {/* Close button */}
              <button
              onClick={() => {
                updateQuery({ item: "" });
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div>
              <h3 className="text-base font-bold text-gray-900">
                Review Verifikasi Akun
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Periksa keabsahan data NIK dan berkas identitas pemohon sebelum
                memberikan persetujuan akun.
              </p>
            </div>

            {/* Profile Info */}
            <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-transparent">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 border border-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                  {selectedWarga.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">
                    {selectedWarga.name}
                  </h4>
                  <p className="text-[10px] text-gray-400">
                    {selectedWarga.gender}, {selectedWarga.age} Tahun —
                    Terdaftar pada {selectedWarga.date}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                <div>
                  <span className="text-gray-400 block">
                    Nomor Induk Kependudukan (NIK)
                  </span>
                  <span className="font-mono font-semibold text-gray-700">
                    {selectedWarga.nik}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">
                    Wilayah Banjar / Lingkungan
                  </span>
                  <span className="font-semibold text-gray-700">
                    {selectedWarga.rt}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 block">Alamat KTP</span>
                  <span className="text-gray-700 font-medium">
                    Banjar {selectedWarga.rt}, Kelurahan Panjer, Denpasar
                    Selatan, Bali
                  </span>
                </div>
              </div>
            </div>

            {/* Verification Files */}
            <div className="border border-gray-200 rounded-xl p-4 bg-transparent">
              <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
                Lampiran Berkas Pendaftaran
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-gray-200 rounded-lg p-2.5 flex items-center gap-2 bg-transparent hover:bg-gray-50 transition-colors cursor-pointer">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-gray-700 block truncate">
                      KTP_{selectedWarga.name.replace(/\s+/g, "")}.jpg
                    </span>
                    <span className="text-[9px] text-gray-400">
                      Foto KTP (1.2 MB)
                    </span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-2.5 flex items-center gap-2 bg-transparent hover:bg-gray-50 transition-colors cursor-pointer">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-gray-700 block truncate">
                      KK_{selectedWarga.name.replace(/\s+/g, "")}.pdf
                    </span>
                    <span className="text-[9px] text-gray-400">
                      Scan Kartu Keluarga (2.4 MB)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {selectedWarga.status === "Menunggu" ? (
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={handleReject}
                  className="flex-1 py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg text-xs font-bold transition-colors"
                >
                  Tolak Pendaftaran
                </button>
                <button
                  onClick={handleApprove}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                >
                  Setujui & Aktifkan Akun
                </button>
              </div>
            ) : (
              <div className="pt-2 text-center">
                <span
                  className={`inline-flex px-4 py-2 border text-xs font-bold rounded-lg ${
                    selectedWarga.status === "Disetujui"
                      ? "border-green-300 text-green-700"
                      : "border-red-300 text-red-700"
                  }`}
                >
                  Status Akun: {selectedWarga.status}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifikasiWargaPage;
