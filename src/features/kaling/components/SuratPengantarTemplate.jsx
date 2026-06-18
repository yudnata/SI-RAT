/**
 * SuratPengantarTemplate.jsx
 * ─────────────────────────────────────────────────────────────
 * Print-ready HTML template for Surat Pengantar Kepala Lingkungan.
 * Rendered in a modal — the user can print directly from the browser.
 */

const SuratPengantarTemplate = ({ data, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const today = new Date();
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const dateStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0 print:hidden">
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              Preview Surat Pengantar
            </h2>
            <p className="text-[10px] text-gray-400">
              Surat ini akan diterbitkan atas nama Kepala Lingkungan
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
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
                  d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12.75h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z"
                />
              </svg>
              Cetak Surat
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
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
          </div>
        </div>

        {/* Surat Content — A4-like */}
        <div className="overflow-y-auto flex-1 p-6 print:p-0">
          <div
            className="bg-white border border-gray-200 rounded-lg mx-auto print:border-0 print:rounded-none"
            style={{
              maxWidth: "210mm",
              minHeight: "297mm",
              padding: "20mm 25mm",
              fontFamily: "Times New Roman, serif",
            }}
          >
            {/* Kop Surat */}
            <div className="text-center border-b-2 border-black pb-3 mb-6">
              <p
                className="text-[10px] font-bold tracking-widest uppercase"
                style={{ fontSize: "10pt" }}
              >
                PEMERINTAH KOTA DENPASAR
              </p>
              <p
                className="text-[10px] font-bold tracking-widest uppercase"
                style={{ fontSize: "10pt" }}
              >
                KECAMATAN DENPASAR SELATAN
              </p>
              <p
                className="font-bold tracking-wide uppercase"
                style={{ fontSize: "14pt" }}
              >
                KELURAHAN PANJER
              </p>
              <p
                className="font-bold tracking-wide uppercase"
                style={{ fontSize: "12pt" }}
              >
                KEPALA LINGKUNGAN / BANJAR {data?.banjar || "TEGAL"}
              </p>
              <p className="text-gray-600" style={{ fontSize: "9pt" }}>
                Jl. Bypass Ngurah Rai No. 1, Denpasar 80225 — Telp. (0361)
                234567
              </p>
            </div>

            {/* Judul Surat */}
            <div className="text-center mb-6">
              <p
                className="font-bold underline uppercase"
                style={{ fontSize: "13pt" }}
              >
                SURAT PENGANTAR
              </p>
              <p style={{ fontSize: "10pt" }}>
                Nomor: {data?.nomorSurat || "070/SP/"}
                {String(today.getMonth() + 1).padStart(2, "0")}/
                {today.getFullYear()}
              </p>
            </div>

            {/* Isi Surat */}
            <div style={{ fontSize: "11pt", lineHeight: "1.8" }}>
              <p className="mb-4">
                Yang bertanda tangan di bawah ini, Kepala Lingkungan / Kelian
                Banjar {data?.banjar || "Tegal"}, Kelurahan Panjer, Kecamatan
                Denpasar Selatan, Kota Denpasar, menerangkan bahwa:
              </p>

              {/* Data Pemohon - Table */}
              <table className="mb-4" style={{ fontSize: "11pt" }}>
                <tbody>
                  <tr>
                    <td
                      className="pr-4 py-1 align-top"
                      style={{ width: "180px" }}
                    >
                      Nama Lengkap
                    </td>
                    <td className="pr-2 py-1 align-top">:</td>
                    <td className="py-1 font-bold uppercase">
                      {data?.nama || "BUDI SANTOSO"}
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-4 py-1 align-top">NIK</td>
                    <td className="pr-2 py-1 align-top">:</td>
                    <td className="py-1">{data?.nik || "3174011204920005"}</td>
                  </tr>
                  <tr>
                    <td className="pr-4 py-1 align-top">Tempat / Tgl. Lahir</td>
                    <td className="pr-2 py-1 align-top">:</td>
                    <td className="py-1">
                      {data?.ttl || "Denpasar, 12 April 1992"}
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-4 py-1 align-top">Jenis Kelamin</td>
                    <td className="pr-2 py-1 align-top">:</td>
                    <td className="py-1">
                      {data?.jenisKelamin || "Laki-laki"}
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-4 py-1 align-top">Agama</td>
                    <td className="pr-2 py-1 align-top">:</td>
                    <td className="py-1">{data?.agama || "Hindu"}</td>
                  </tr>
                  <tr>
                    <td className="pr-4 py-1 align-top">Pekerjaan</td>
                    <td className="pr-2 py-1 align-top">:</td>
                    <td className="py-1">
                      {data?.pekerjaan || "Karyawan Swasta"}
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-4 py-1 align-top">Alamat</td>
                    <td className="pr-2 py-1 align-top">:</td>
                    <td className="py-1">
                      {data?.alamat ||
                        "Jl. Kamboja No. 5, Banjar Tegal, Kel. Panjer, Denpasar Selatan"}
                    </td>
                  </tr>
                </tbody>
              </table>

              <p className="mb-4">
                Adalah benar warga kami yang berdomisili di wilayah Lingkungan /
                Banjar {data?.banjar || "Tegal"}, Kelurahan Panjer. Surat
                pengantar ini diberikan untuk keperluan:
              </p>

              <p
                className="font-bold mb-4 px-4 py-2 border border-gray-400 rounded"
                style={{ fontSize: "12pt" }}
              >
                {data?.keperluan ||
                  data?.jenisSurat ||
                  "Pengurusan Surat Keterangan Domisili"}
              </p>

              <p className="mb-8">
                Demikian surat pengantar ini dibuat dengan sebenar-benarnya
                untuk dapat dipergunakan sebagaimana mestinya.
              </p>
            </div>

            {/* Tanda Tangan */}
            <div className="flex justify-end" style={{ fontSize: "11pt" }}>
              <div className="text-center" style={{ width: "250px" }}>
                <p>Denpasar, {dateStr}</p>
                <p className="font-bold">Kepala Lingkungan / Kelian Banjar</p>
                <div
                  style={{ height: "80px" }}
                  className="flex items-center justify-center"
                >
                  <p className="text-gray-400 text-xs italic">
                    [Tanda Tangan & Stempel]
                  </p>
                </div>
                <p className="font-bold underline uppercase">
                  {data?.namaKaling || "I MADE HERMAN"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuratPengantarTemplate;
