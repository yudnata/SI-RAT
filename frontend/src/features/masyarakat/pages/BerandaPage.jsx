const DUMMY_USER = {
  name: "Budi Santoso",
  nik: "3275012304920005",
  kk: "3275009876543210",
};

const ACTIVE_SUBMISSION = {
  id: "PR-2023-0892",
  type: "Surat Keterangan Usaha (SKU)",
  estimasiSelesai: "15 Okt 2023",
  steps: [
    {
      label: "Permohonan Diterima",
      date: "12 Okt, 09:15",
      note: "Berhasil diserahkan",
      status: "done",
    },
    {
      label: "Verifikasi Kepala Lingkungan",
      date: "12 Okt, 14:30",
      note: "Disetujui oleh Bpk. Herman",
      status: "done",
    },
    {
      label: "Proses Administrasi Desa",
      date: "30 menit lalu",
      note: "Sedang diproses oleh petugas kantor desa",
      status: "active",
      warning: "Menunggu tanda tangan digital Kepala Desa",
    },
    {
      label: "Selesai & Unduh",
      date: null,
      note: "Dokumen belum tersedia",
      status: "pending",
    },
  ],
};

const StatCard = ({ label, value, sub, color, icon }) => {
  const colorMap = {
    blue: "text-blue-500",
    orange: "text-orange-500",
    green: "text-emerald-500",
  };
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-start justify-between shadow-sm">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <p className="text-4xl font-extrabold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{sub}</p>
      </div>
      <div
        className={`flex items-center justify-center flex-shrink-0 mt-1 ${colorMap[color]}`}
      >
        {icon}
      </div>
    </div>
  );
};

const BerandaPage = ({ user = DUMMY_USER }) => {
  return (
    <div className="w-full space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Halo, {user.name}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Pantau status pengajuan surat dan dokumen kependudukan Anda di sini.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-6">
        <StatCard
          label="Total Pengajuan"
          value="12"
          sub="Sejak Januari 2023"
          color="blue"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          }
        />
        <StatCard
          label="Dalam Proses"
          value="2"
          sub="1 membutuhkan dokumen"
          color="orange"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          label="Selesai"
          value="10"
          sub="Semua dokumen tersedia"
          color="green"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      {/* Active submission */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-800">Pengajuan Aktif</h2>
          <span className="text-xs text-gray-400 font-medium">
            ID: {ACTIVE_SUBMISSION.id}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-5">
          {/* Left: type & estimasi */}
          <div className="bg-gray-50 rounded-xl p-4 flex-shrink-0 w-full sm:w-48">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">
              JENIS SURAT
            </p>
            <p className="text-sm font-bold text-gray-800 leading-snug">
              {ACTIVE_SUBMISSION.type}
            </p>
            <div className="mt-4">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">
                ESTIMASI SELESAI
              </p>
              <p className="text-sm font-semibold text-gray-700">
                {ACTIVE_SUBMISSION.estimasiSelesai}
              </p>
            </div>
          </div>

          {/* Right: timeline */}
          {/* Right: timeline */}
          <div className="flex-1 space-y-0">
            {ACTIVE_SUBMISSION.steps.map((s, idx) => (
              <div key={idx} className="flex gap-3">
                {/* Icon + line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                    ${s.status === "done" ? "bg-green-500" : s.status === "active" ? "bg-blue-600" : "bg-gray-200"}`}
                  >
                    {s.status === "done" && (
                      <svg
                        className="w-3 h-3 text-white"
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
                    )}
                    {s.status === "active" && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </div>
                  {idx < ACTIVE_SUBMISSION.steps.length - 1 && (
                    <div
                      className={`w-0.5 flex-1 my-1 ${s.status === "done" ? "bg-green-300" : "bg-gray-200"}`}
                      style={{ minHeight: "24px" }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="pb-4">
                  <div className="flex items-baseline gap-2">
                    <p
                      className={`text-sm font-semibold ${s.status === "active" ? "text-blue-700" : s.status === "done" ? "text-gray-800" : "text-gray-400"}`}
                    >
                      {s.label}
                    </p>
                    {s.date && (
                      <span className="text-xs text-gray-400">{s.date}</span>
                    )}
                  </div>
                  {s.note && (
                    <p className="text-xs text-gray-400 mt-0.5">{s.note}</p>
                  )}
                  {s.warning && (
                    <div className="mt-1.5 bg-transparent border border-amber-300 text-amber-700 text-xs px-3 py-1.5 rounded-lg font-medium">
                      {s.warning}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BerandaPage;
