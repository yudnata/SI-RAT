/**
 * DocumentPreviewModal.jsx
 * ─────────────────────────────────────────────
 * Preview dokumen warga / surat pengantar Kaling.
 * - Satu tombol Download saja (di toolbar atas)
 * - Tidak ada card-dalam-card
 * - Layout bersih langsung menampilkan konten
 */

const DocumentPreviewModal = ({
  doc,
  onClose,
  isSuratPengantar = false,
  suratData = {},
}) => {
  const isImage =
    doc &&
    (doc.toLowerCase().endsWith(".jpg") ||
      doc.toLowerCase().endsWith(".jpeg") ||
      doc.toLowerCase().endsWith(".png"));

  const today = new Date();
  const months = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember",
  ];
  const dateStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

  const handleDownload = () => {
    const toast = document.createElement("div");
    toast.innerText = `⬇ Mengunduh ${isSuratPengantar ? "SuratPengantar_Kaling.pdf" : doc}...`;
    toast.style.cssText =
      "position:fixed;bottom:24px;right:24px;background:#1e293b;color:white;padding:10px 18px;border-radius:10px;font-size:12px;font-weight:600;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.2)";
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col">

        {/* ── Toolbar ── */}
        <div className="px-6 py-3.5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0 ${
                isSuratPengantar
                  ? "bg-amber-500"
                  : isImage
                    ? "bg-violet-500"
                    : "bg-red-500"
              }`}
            >
              {isSuratPengantar ? "SP" : isImage ? "IMG" : "PDF"}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-gray-900 truncate">
                {isSuratPengantar ? "Surat Pengantar Kepala Lingkungan" : doc}
              </h2>
              <p className="text-[10px] text-gray-400">
                {isSuratPengantar
                  ? "Dokumen resmi diterbitkan oleh Kaling"
                  : isImage
                    ? "Gambar dokumen pendukung"
                    : "Dokumen PDF lampiran"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="overflow-y-auto flex-1 bg-gray-50">
          {isSuratPengantar ? (

            /* Surat Pengantar — full A4 preview */
            <div className="p-6">
              <div
                className="bg-white border border-gray-200 rounded-lg mx-auto shadow-sm"
                style={{
                  maxWidth: "210mm",
                  minHeight: "297mm",
                  padding: "20mm 25mm",
                  fontFamily: "Times New Roman, serif",
                }}
              >
                {/* Kop */}
                <div className="text-center border-b-2 border-black pb-3 mb-6">
                  <p className="font-bold tracking-widest uppercase" style={{ fontSize: "10pt" }}>PEMERINTAH KOTA DENPASAR</p>
                  <p className="font-bold tracking-widest uppercase" style={{ fontSize: "10pt" }}>KECAMATAN DENPASAR SELATAN</p>
                  <p className="font-bold tracking-wide uppercase" style={{ fontSize: "14pt" }}>KELURAHAN PANJER</p>
                  <p className="font-bold tracking-wide uppercase" style={{ fontSize: "12pt" }}>
                    KEPALA LINGKUNGAN / BANJAR {suratData?.banjar || "TEGAL"}
                  </p>
                  <p className="text-gray-600" style={{ fontSize: "9pt" }}>
                    Jl. Bypass Ngurah Rai No. 1, Denpasar 80225 — Telp. (0361) 234567
                  </p>
                </div>

                {/* Judul */}
                <div className="text-center mb-6">
                  <p className="font-bold underline uppercase" style={{ fontSize: "13pt" }}>SURAT PENGANTAR</p>
                  <p style={{ fontSize: "10pt" }}>
                    Nomor: {suratData?.nomorSurat || "070/SP/"}
                    {String(today.getMonth() + 1).padStart(2, "0")}/{today.getFullYear()}
                  </p>
                </div>

                {/* Isi */}
                <div style={{ fontSize: "11pt", lineHeight: "1.8" }}>
                  <p className="mb-4">
                    Yang bertanda tangan di bawah ini, Kepala Lingkungan / Kelian Banjar{" "}
                    {suratData?.banjar || "Tegal"}, Kelurahan Panjer, Kecamatan Denpasar Selatan,
                    Kota Denpasar, menerangkan bahwa:
                  </p>
                  <table className="mb-4" style={{ fontSize: "11pt" }}>
                    <tbody>
                      {[
                        ["Nama Lengkap", <strong className="uppercase">{suratData?.nama || "—"}</strong>],
                        ["NIK", suratData?.nik || "—"],
                        ["Tempat / Tgl. Lahir", suratData?.ttl || "—"],
                        ["Jenis Kelamin", suratData?.jenisKelamin || "—"],
                        ["Agama", suratData?.agama || "—"],
                        ["Pekerjaan", suratData?.pekerjaan || "—"],
                        ["Alamat", suratData?.alamat || "—"],
                      ].map(([label, value]) => (
                        <tr key={label}>
                          <td className="pr-4 py-1 align-top" style={{ width: "180px" }}>{label}</td>
                          <td className="pr-2 py-1 align-top">:</td>
                          <td className="py-1">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <p className="mb-4">
                    Adalah benar warga kami yang berdomisili di wilayah Lingkungan / Banjar{" "}
                    {suratData?.banjar || "Tegal"}, Kelurahan Panjer. Surat pengantar ini
                    diberikan untuk keperluan:
                  </p>
                  <p className="font-bold mb-4 px-4 py-2 border border-gray-400 rounded" style={{ fontSize: "12pt" }}>
                    {suratData?.keperluan || suratData?.jenisSurat || "—"}
                  </p>
                  <p className="mb-8">
                    Demikian surat pengantar ini dibuat dengan sebenar-benarnya untuk dapat
                    dipergunakan sebagaimana mestinya.
                  </p>
                </div>

                {/* TTD */}
                <div className="flex justify-end" style={{ fontSize: "11pt" }}>
                  <div className="text-center" style={{ width: "250px" }}>
                    <p>Denpasar, {dateStr}</p>
                    <p className="font-bold">Kepala Lingkungan / Kelian Banjar</p>
                    <div style={{ height: "80px" }} className="flex items-center justify-center">
                      <p className="text-gray-400 text-xs italic">[Tanda Tangan &amp; Stempel]</p>
                    </div>
                    <p className="font-bold underline uppercase">{suratData?.namaKaling || "I MADE HERMAN"}</p>
                  </div>
                </div>
              </div>
            </div>

          ) : isImage ? (

            /* Gambar — placeholder */
            <div className="flex flex-col items-center justify-center py-16 px-8 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-700">{doc}</p>
                <p className="text-xs text-gray-400 mt-1">Preview gambar tersedia setelah integrasi dengan server</p>
              </div>
              {/* Placeholder image area */}
              <div className="w-full max-w-lg h-64 bg-white border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-400">[ Pratinjau Gambar ]</p>
                  <p className="text-xs text-gray-300 mt-1">Dokumen asli tersimpan di server</p>
                </div>
              </div>
            </div>

          ) : (

            /* PDF — placeholder viewer */
            <div className="flex flex-col items-center justify-center py-12 px-8 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-700">{doc}</p>
                <p className="text-xs text-gray-400 mt-1">Preview tersedia setelah integrasi backend</p>
              </div>

              {/* Mock PDF frame */}
              <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                {/* Browser bar */}
                <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b border-gray-200">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <span className="text-[9px] text-gray-500 font-mono ml-2 truncate flex-1">{doc}</span>
                  <span className="text-[9px] text-gray-400">PDF</span>
                </div>
                {/* Content area */}
                <div className="h-64 flex flex-col items-center justify-center gap-4 px-8 bg-gray-50">
                  <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-gray-400">Pratinjau PDF</p>
                    <p className="text-[10px] text-gray-300 mt-0.5">Halaman 1 dari 1</p>
                  </div>
                  {/* Fake text lines */}
                  <div className="w-full space-y-2">
                    {[75, 55, 85, 50, 65, 40, 70].map((w, i) => (
                      <div key={i} className="h-1.5 bg-gray-200 rounded-full" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
