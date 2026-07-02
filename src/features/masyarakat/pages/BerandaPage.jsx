import { useState, useEffect } from "react";
import { api } from "../../../utils/api.js";

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

const BerandaPage = ({ user }) => {
  const [stats, setStats] = useState({ total: 0, processing: 0, completed: 0 });
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await api.get("/submissions?limit=100");
        const list = response.data || [];
        
        const total = list.length;
        const processing = list.filter(s => ["DIPROSES", "VERIFIKASI_KALING", "VERIFIKASI_KELURAHAN"].includes(s.status)).length;
        const completed = list.filter(s => s.status === "SELESAI").length;
        setStats({ total, processing, completed });

        // Find latest active submission
        const active = list.find(s => ["DIPROSES", "VERIFIKASI_KALING", "VERIFIKASI_KELURAHAN"].includes(s.status));
        if (active) {
          // Construct timeline steps
          const steps = [];
          
          // Step 1: Diajukan (Masyarakat)
          const diajukan = active.timeline.find(t => t.action === "DIAJUKAN");
          steps.push({
            label: "Permohonan Dikirim",
            date: diajukan ? new Date(diajukan.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "Selesai",
            note: "Berhasil diserahkan secara digital",
            status: "done",
          });

          // Step 2: Kaling (if required)
          if (active.service.needsKaling) {
            const kalingDone = active.timeline.find(t => t.action === "DIVERIFIKASI_KALING");
            const isPendingKaling = active.status === "VERIFIKASI_KALING";
            steps.push({
              label: "Verifikasi Kepala Lingkungan",
              date: kalingDone ? new Date(kalingDone.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : (isPendingKaling ? "Sedang Berjalan" : null),
              note: kalingDone ? `Disetujui oleh Kaling ${kalingDone.actor.namaLengkap}` : (isPendingKaling ? "Menunggu verifikasi Kepala Lingkungan setempat" : "Belum diproses"),
              status: kalingDone ? "done" : (isPendingKaling ? "active" : "pending"),
            });
          }

          // Step 3: Kelurahan (if required)
          if (active.service.needsKelurahan) {
            const kelurahanDone = active.timeline.find(t => t.action === "DIVALIDASI_KELURAHAN");
            const isPendingKelurahan = active.status === "VERIFIKASI_KELURAHAN";
            steps.push({
              label: "Validasi Kelurahan",
              date: kelurahanDone ? new Date(kelurahanDone.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : (isPendingKelurahan ? "Sedang Berjalan" : null),
              note: kelurahanDone ? "Selesai divalidasi dan ditandatangani" : (isPendingKelurahan ? "Menunggu tanda tangan dan validasi Kelurahan" : "Belum diproses"),
              status: kelurahanDone ? "done" : (isPendingKelurahan ? "active" : "pending"),
            });
          }

          // Step 4: Selesai
          steps.push({
            label: "Selesai",
            date: active.status === "SELESAI" ? new Date(active.updatedAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : null,
            note: active.status === "SELESAI" ? "Surat resmi siap diunduh" : "Surat hasil akhir",
            status: active.status === "SELESAI" ? "completed" : "pending",
          });

          setActiveSubmission({
            id: active.submissionNumber,
            type: active.service.name,
            estimasiSelesai: "1-2 Hari Kerja",
            steps,
          });
        } else {
          setActiveSubmission(null);
        }
      } catch (err) {
        console.error("Gagal memuat stats beranda:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Halo, {user?.namaLengkap || "Warga"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Pantau status pengajuan surat dan dokumen kependudukan Anda di sini.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-6">
        <StatCard
          label="Total Pengajuan"
          value={stats.total}
          sub="Riwayat pengajuan surat"
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
          value={stats.processing}
          sub="Sedang diproses petugas"
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
          value={stats.completed}
          sub="Dokumen siap unduh"
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
        <h2 className="text-sm font-bold text-gray-800 mb-4">Pengajuan Aktif Terkini</h2>
        
        {loading ? (
          <p className="text-xs text-gray-400">Memuat data pengajuan aktif...</p>
        ) : activeSubmission ? (
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Left: type & estimasi */}
            <div className="bg-gray-50 rounded-xl p-4 flex-shrink-0 w-full sm:w-48">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">
                JENIS SURAT
              </p>
              <p className="text-sm font-bold text-gray-800 leading-snug">
                {activeSubmission.type}
              </p>
              <div className="mt-4">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">
                  NOMOR PENGAJUAN
                </p>
                <p className="text-xs font-mono text-gray-650">
                  {activeSubmission.id}
                </p>
              </div>
            </div>

            {/* Right: timeline */}
            <div className="flex-1 space-y-0">
              {activeSubmission.steps.map((s, idx) => (
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
                    {idx < activeSubmission.steps.length - 1 && (
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-xs text-gray-400 font-medium">Tidak ada pengajuan aktif saat ini.</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Semua permohonan surat Anda telah selesai atau dibatalkan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BerandaPage;
