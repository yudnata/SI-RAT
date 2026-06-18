import { useState } from "react";
import AuthSidePanel from "../components/AuthSidePanel";

const RegisterPage = ({ onNavigateToLogin }) => {
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    namaLengkap: "",
    nik: "",
    email: "",
    noWhatsapp: "",
    password: "",
    domisili: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNavigateToLogin?.();
  };

  const domisiliOptions = [
    "Denpasar Selatan",
    "Denpasar Barat",
    "Denpasar Utara",
    "Denpasar Timur",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 py-8">
      <div className="w-full max-w-5xl flex rounded-2xl shadow-2xl overflow-hidden bg-white">
        {/* Left panel — reusable component */}
        <AuthSidePanel title="Membangun jembatan komunikasi yang transparan antara warga dan pemerintah desa untuk masa depan yang lebih baik." />

        {/* Right panel — register form */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-10">
          {/* Mobile branding */}
          <p className="block md:hidden text-blue-600 font-bold text-lg mb-6">
            SI-RAT
          </p>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
            Daftar Akun Baru
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Satu akun untuk semua kebutuhan layanan publik dan korespondensi
            pemerintah Anda.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Nama Lengkap & NIK */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                  htmlFor="namaLengkap"
                >
                  Nama Lengkap (sesuai KTP)
                </label>
                <input
                  type="text"
                  id="namaLengkap"
                  name="namaLengkap"
                  value={form.namaLengkap}
                  onChange={handleChange}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3.5 py-3 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                  htmlFor="nik"
                >
                  NIK (16 digit)
                </label>
                <input
                  type="text"
                  id="nik"
                  name="nik"
                  value={form.nik}
                  onChange={handleChange}
                  placeholder="Masukkan 16 digit NIK"
                  maxLength={16}
                  className="w-full px-3.5 py-3 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Row 2: Email & No WhatsApp */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                  htmlFor="reg-email"
                >
                  Email
                </label>
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
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  </span>
                  <input
                    type="email"
                    id="reg-email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    className="w-full pl-10 pr-3.5 py-3 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                  htmlFor="noWhatsapp"
                >
                  Nomor WhatsApp
                </label>
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
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                      />
                    </svg>
                  </span>
                  <input
                    type="tel"
                    id="noWhatsapp"
                    name="noWhatsapp"
                    value={form.noWhatsapp}
                    onChange={handleChange}
                    placeholder="0812xxxxxxxx"
                    className="w-full pl-10 pr-3.5 py-3 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Password & Domisili */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                  htmlFor="reg-password"
                >
                  Password
                </label>
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
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  </span>
                  <input
                    type="password"
                    id="reg-password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-3 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                  htmlFor="domisili"
                >
                  Daerah Tempat Tinggal (sesuai KTP)
                </label>
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
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                  </span>
                  <select
                    id="domisili"
                    name="domisili"
                    value={form.domisili}
                    onChange={handleChange}
                    className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Pilih Domisili</option>
                    {domisiliOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Terms & Conditions checkbox */}
            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                id="agreed"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 border-gray-300 rounded cursor-pointer accent-blue-600 flex-shrink-0"
              />
              <label
                htmlFor="agreed"
                className="text-xs text-gray-600 cursor-pointer leading-relaxed"
              >
                Saya menyetujui{" "}
                <a
                  href="#"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Syarat dan Ketentuan
                </a>{" "}
                serta{" "}
                <a
                  href="#"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Kebijakan Privasi
                </a>{" "}
                CivicLink dalam pemrosesan data pribadi saya.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="btn-register"
              disabled={!agreed}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] text-sm mt-1"
            >
              Verifikasi Akun
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
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </button>
          </form>

          {/* To login */}
          <p className="mt-5 text-center text-sm text-gray-500">
            Sudah punya akun?{" "}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Masuk di sini
            </button>
          </p>

          {/* Footer links */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex justify-center gap-6">
            <a
              href="#"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Pusat Bantuan
            </a>
            <a
              href="#"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Panduan Registrasi
            </a>
            <a
              href="#"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Kontak Kami
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-400">
        © 2026 Digital Government Services. All rights reserved.
      </div>
    </div>
  );
};

export default RegisterPage;
