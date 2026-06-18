const DUMMY_QUEUE = [
  {
    name: "Rahmat Hidayat",
    nik: "3275012304880002",
    service: "SKTM Pendidikan",
    status: "Menunggu",
  },
  {
    name: "Lina Marlina",
    nik: "3275014506920005",
    service: "Surat Domisili",
    status: "Menunggu",
  },
];

const DUMMY_ACTIVITIES = [
  { service: "SKTM Disetujui", detail: "Oleh Admin - 2 mnt lalu" },
];

const DUMMY_URGENT = [
  {
    priority: "PRIORITAS TINGGI",
    time: "10 Menit lalu",
    title: "Surat Keterangan Tidak Mampu",
    name: "Bpk. Ahmad Suherman (Banjar Anyar)",
  },
  {
    priority: "REGULER",
    time: "2 jam lalu",
    title: "Surat Kematian",
    name: "Kel. Ibu Sartika (Banjar Kelod)",
  },
  {
    priority: "REGULER",
    time: "3 jam lalu",
    title: "Pindah Domisili",
    name: "Sdr. Rizky Pratama (Banjar Kaja)",
  },
];

const StatCard = ({ label, value, sub, type }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {label}
          </span>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">{value}</p>
        </div>
        {sub && (
          <span
            className={`text-[10px] font-extrabold px-1.5 py-0.5 border rounded ${type === "alert" ? "text-red-600 border-red-400" : "text-gray-500 border-gray-300"}`}
          >
            {sub}
          </span>
        )}
      </div>
    </div>
  );
};

const KelurahanDashboardPage = ({ onNavigate }) => {
  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">
          Dashboard Admin Kelurahan
        </h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Menunggu Validasi"
          value="24"
          sub="+12%"
          type="alert"
        />
        <StatCard label="Selesai Hari Ini" value="156" sub="Selesai" />
        <StatCard label="Total Warga Terdaftar" value="12.482" />
      </div>

      {/* Layout grid columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (2/3 width) */}
        <div className="md:col-span-2 space-y-6">
          {/* Trend Chart Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">
                Tren Pengajuan Surat
              </h3>
              <select className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded text-[10px] font-bold text-gray-500 bg-white">
                <option>7 Hari Terakhir</option>
              </select>
            </div>

            {/* SVG line chart representation */}
            <div className="w-full h-44 relative bg-gray-50/50 rounded-lg border border-gray-100 flex items-end p-4">
              <svg
                className="w-full h-full absolute inset-0 p-4"
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,35 Q15,25 30,30 T60,15 T90,5 T100,2"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M0,35 Q15,25 30,30 T60,15 T90,5 T100,2 L100,40 L0,40 Z"
                  fill="url(#gradient)"
                  opacity="0.1"
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="w-full flex justify-between text-[8px] font-bold text-gray-400 z-10 pt-24 mt-8">
                {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Antrean Verifikasi Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-800">
              Antrean Verifikasi
            </h3>
            <div className="flex gap-2">
              <div className="relative flex-1 shadow-sm rounded-lg">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-3.5 h-3.5 text-gray-400"
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
                  placeholder="Cari NIK atau Nama..."
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-500 hover:bg-gray-50">
                <svg
                  className="w-3 h-3"
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
                Filter
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="px-5 py-3">Pemohon</th>
                    <th className="px-5 py-3">Layanan</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                  {DUMMY_QUEUE.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <p className="font-semibold text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                          {item.nik}
                        </p>
                      </td>
                      <td className="px-5 py-3">{item.service}</td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded border border-amber-500 text-[9px] font-bold text-amber-600 uppercase tracking-wide">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => onNavigate("validasi-surat")}
                          className="p-1 text-gray-400 hover:text-blue-600 rounded transition-all"
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-6">
          {/* Aktivitas Terkini Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-800">
              Aktivitas Terkini
            </h3>
            <div className="space-y-3">
              {DUMMY_ACTIVITIES.map((act, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mt-0.5 flex-shrink-0">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">
                      {act.service}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {act.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Validasi Mendesak Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">
                Validasi Mendesak
              </h3>
              <button
                onClick={() => onNavigate("validasi-surat")}
                className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-3">
              {DUMMY_URGENT.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-gray-100 rounded-lg p-3 hover:border-gray-200 transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className={`text-[8px] font-bold uppercase tracking-wider ${item.priority === "PRIORITAS TINGGI" ? "text-red-600" : "text-gray-400"}`}
                    >
                      {item.priority}
                    </span>
                    <span className="text-[8px] text-gray-400 font-mono">
                      {item.time}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-800 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KelurahanDashboardPage;
