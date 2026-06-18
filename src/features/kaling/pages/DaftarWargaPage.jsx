import { useNavigate, useSearchParams } from "react-router-dom";

const DUMMY_CITIZENS = [
  {
    name: "Aditya Wijaya",
    relation: "Kepala Keluarga",
    nik: "327501**********",
    house: "Blok A / 12",
    status: "Tetap",
    job: "Pegawai Negeri Sipil",
  },
  {
    name: "Siti Lestari",
    relation: "Istri",
    nik: "327501**********",
    house: "Blok A / 12",
    status: "Tetap",
    job: "Wiraswasta",
  },
  {
    name: "Bambang Kusumo",
    relation: "Kepala Keluarga",
    nik: "327502**********",
    house: "Blok B / 05",
    status: "Kontrak",
    job: "Karyawan Swasta",
  },
  {
    name: "Rina Nuraini",
    relation: "Kepala Keluarga",
    nik: "327501**********",
    house: "Blok C / 21",
    status: "Tetap",
    job: "Guru",
  },
  {
    name: "Fajar Ardiansyah",
    relation: "Anggota Keluarga",
    nik: "327501**********",
    house: "Blok A / 04",
    status: "Kontrak",
    job: "Mahasiswa",
  },
  {
    name: "Fajar Ardiansyah",
    relation: "Anggota Keluarga",
    nik: "327501**********",
    house: "Blok A / 04",
    status: "Kontrak",
    job: "Mahasiswa",
  },
  {
    name: "Fajar Ardiansyah",
    relation: "Anggota Keluarga",
    nik: "327501**********",
    house: "Blok A / 04",
    status: "Kontrak",
    job: "Mahasiswa",
  },
  {
    name: "Fajar Ardiansyah",
    relation: "Anggota Keluarga",
    nik: "327501**********",
    house: "Blok A / 04",
    status: "Kontrak",
    job: "Mahasiswa",
  },
];

const DaftarWargaPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const routeSearch = searchParams.get("q") || "";
  const routeStatus = searchParams.get("status") || "Semua Status";

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

  const filteredCitizens = DUMMY_CITIZENS.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(routeSearch.toLowerCase()) ||
      item.job.toLowerCase().includes(routeSearch.toLowerCase());
    const matchesStatus =
      routeStatus === "Semua Status" || item.status === routeStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-extrabold text-gray-900">
          Riwayat Verifikasi
        </h1>{" "}
        {/* Matching screenshot title exactly */}
        {/* Search bar inside header space if needed, wait, in screenshot the search bar is actually inside a card row */}
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
            value={routeSearch}
            onChange={(e) => updateQuery({ q: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Dropdown status */}
        <select
          value={routeStatus}
          onChange={(e) => updateQuery({ status: e.target.value })}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option>Semua Status</option>
          <option>Tetap</option>
          <option>Kontrak</option>
        </select>

        {/* Filter lanjut */}
        <button className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
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
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A50.065 50.065 0 0112 3z"
            />
          </svg>
          Filter Lanjut
        </button>
      </div>

      {/* Main card table */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">NIK (Terproteksi)</th>
                <th className="px-6 py-4">No. Rumah</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Pekerjaan</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
              {filteredCitizens.map((item, idx) => {
                const statusStyle =
                  item.status === "Tetap"
                    ? "bg-slate-50 text-slate-700"
                    : "bg-gray-100 text-gray-500";
                return (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">
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
                          {item.relation}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-500">
                      {item.nik}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{item.house}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${statusStyle}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{item.job}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded transition-all">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
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
          <span>Menampilkan {filteredCitizens.length} dari 248 warga</span>
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
              50
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

export default DaftarWargaPage;
