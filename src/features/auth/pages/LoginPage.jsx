import { useState } from "react";
import { Link } from "react-router-dom";
import AuthSidePanel from "../components/AuthSidePanel";
import { api } from "../../../utils/api.js";

const LoginPage = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setErrorMsg("Harap isi semua field!");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await api.post("/auth/login", { identifier, password });
      const { user, accessToken } = response.data;
      
      localStorage.setItem("sirat_token", accessToken);
      localStorage.setItem("sirat_user", JSON.stringify(user));

      // Map role to lowercase to match frontend route keys
      let role = "masyarakat";
      if (user.role === "KALING") role = "kaling";
      if (user.role === "KELURAHAN") role = "kelurahan";
      if (user.role === "SUPER_ADMIN") role = "admin";

      onLoginSuccess?.(role);
    } catch (err) {
      setErrorMsg(err.message || "Gagal masuk, periksa kembali NIK/Email dan Password Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-5xl flex rounded-2xl shadow-2xl overflow-hidden bg-white">
        {/* Left panel — reusable component */}
        <AuthSidePanel
          title={
            <>
              Layanan Administrasi
              <br />
              Denpasar
            </>
          }
          description="Sistem korespondensi modern yang menghubungkan warga dengan birokrasi pemerintahan desa secara cepat, transparan, dan aman."
        />

        {/* Right panel — login form */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-12">
          {/* Mobile branding */}
          <p className="block md:hidden text-blue-600 font-bold text-lg mb-6">
            SI-RAT
          </p>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
            Selamat Datang Kembali
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Silakan masuk untuk mengakses layanan surat-menyurat digital Anda.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                {errorMsg}
              </div>
            )}

            {/* Identifier */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1.5"
                htmlFor="identifier"
              >
                Login Menggunakan NIK/Email/No. Telepon
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
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Contoh: 3273000000000001"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="login-password"
                >
                  Kata Sandi
                </label>
                <Link
                  to="/dashboard/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Lupa Password?
                </Link>
              </div>
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
                  type={showPassword ? "text" : "password"}
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
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
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 border-gray-300 rounded cursor-pointer accent-blue-600"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-sm text-gray-600 cursor-pointer"
              >
                Ingat saya di perangkat ini
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="btn-login"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 text-white font-bold rounded-xl shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] text-sm"
            >
              {loading ? "Memproses..." : "Masuk"}
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



          {/* To register */}
          <p className="mt-7 text-center text-sm text-gray-500">
            Belum punya akun?{" "}
            <Link
              to="/dashboard/register"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-400">
        © 2026 Digital Government Services. All rights reserved.
      </div>
    </div>
  );
};

export default LoginPage;
