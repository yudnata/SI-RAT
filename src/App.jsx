import { useState } from "react";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import KelurahanLayout from "./layouts/KelurahanLayout";
import KelurahanDashboardPage from "./features/kelurahan/pages/KelurahanDashboardPage";
import ValidasiSuratPage from "./features/kelurahan/pages/ValidasiSuratPage";
import RiwayatSuratPage from "./features/kelurahan/pages/RiwayatSuratPage";
import VerifikasiWargaPage from "./features/kelurahan/pages/VerifikasiWargaPage";
import MasyarakatLayout from "./layouts/MasyarakatLayout";
import KalingLayout from "./layouts/KalingLayout";
import AdminLayout from "./layouts/AdminLayout";
import BerandaPage from "./features/masyarakat/pages/BerandaPage";
import AjukanSuratPage from "./features/masyarakat/pages/AjukanSuratPage";
import PermohonanSuratPage from "./features/masyarakat/pages/PermohonanSuratPage";
import DokumenPage from "./features/masyarakat/pages/DokumenPage";
import DashboardPage from "./features/kaling/pages/DashboardPage";
import PerluVerifikasiPage from "./features/kaling/pages/PerluVerifikasiPage";
import RiwayatVerifikasiPage from "./features/kaling/pages/RiwayatVerifikasiPage";
import DaftarWargaPage from "./features/kaling/pages/DaftarWargaPage";
import AdminDashboardPage from "./features/admin/pages/AdminDashboardPage";
import ManajemenStafPage from "./features/admin/pages/ManajemenStafPage";
import ManajemenLayananPage from "./features/admin/pages/ManajemenLayananPage";
import LogSistemPage from "./features/admin/pages/LogSistemPage";
import { DUMMY_PENDING } from "./data/kalingPendingData";

const DUMMY_USER = {
  name: "Budi Santoso",
  nik: "3275012304920005",
  kk: "3275009876543210",
  role: "Masyarakat",
};

const DUMMY_KALING = {
  name: "Bpk. Herman",
  role: "Neighborhood Head",
};

const DUMMY_LURAH = {
  name: "Lurah Menteng",
  role: "Admin Portal",
};

const DUMMY_ADMIN = {
  name: "Super Admin",
  role: "Super Admin",
};

function App() {
  const [page, setPage] = useState("login");
  const [kalingPendingList, setKalingPendingList] = useState(DUMMY_PENDING);

  const handleLoginSuccess = (role = "masyarakat") => {
    if (role === "kaling") {
      setPage("kaling-dashboard");
    } else if (role === "kelurahan") {
      setPage("kelurahan-dashboard");
    } else if (role === "admin") {
      setPage("admin-dashboard");
    } else {
      setPage("masyarakat-beranda");
    }
  };

  const handleLogout = () => {
    setPage("login");
  };

  // ─── MASYARAKAT ROLE ───
  if (page.startsWith("masyarakat-")) {
    const activePage = page.replace("masyarakat-", "");

    return (
      <MasyarakatLayout
        activePage={activePage}
        onNavigate={(id) => {
          if (id === "logout") {
            handleLogout();
          } else {
            setPage(`masyarakat-${id}`);
          }
        }}
        user={DUMMY_USER}
      >
        {activePage === "beranda" && <BerandaPage user={DUMMY_USER} />}
        {activePage === "ajukan" && <AjukanSuratPage user={DUMMY_USER} />}
        {activePage === "permohonan" && (
          <PermohonanSuratPage user={DUMMY_USER} />
        )}
        {activePage === "dokumen" && <DokumenPage user={DUMMY_USER} />}
        {activePage === "pengaturan" && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-xl mx-auto shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Pengaturan Akun
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Kelola konfigurasi privasi, keamanan, dan notifikasi akun Anda.
            </p>
            <div className="space-y-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors"
              >
                Keluar dari Akun (Logout)
              </button>
            </div>
          </div>
        )}
      </MasyarakatLayout>
    );
  }

  // ─── KEPALA LINGKUNGAN ROLE ───
  if (page.startsWith("kaling-")) {
    const activePage = page.replace("kaling-", "");

    return (
      <KalingLayout
        activePage={activePage}
        onNavigate={(id) => {
          if (id === "logout") {
            handleLogout();
          } else {
            setPage(`kaling-${id}`);
          }
        }}
        user={DUMMY_KALING}
      >
        {activePage === "dashboard" && (
          <DashboardPage
            onNavigate={(id) => setPage(`kaling-${id}`)}
            pendingList={kalingPendingList}
          />
        )}
        {activePage === "verifikasi" && (
          <PerluVerifikasiPage
            list={kalingPendingList}
            setList={setKalingPendingList}
          />
        )}
        {activePage === "riwayat" && <RiwayatVerifikasiPage />}
        {activePage === "warga" && <DaftarWargaPage />}
        {activePage === "settings" && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-xl mx-auto shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Pengaturan Kaling
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Konfigurasi panel kontrol Kepala Lingkungan.
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </KalingLayout>
    );
  }

  // ─── KELURAHAN ROLE ───
  if (page.startsWith("kelurahan-")) {
    const activePage = page.replace("kelurahan-", "");

    return (
      <KelurahanLayout
        activePage={activePage}
        onNavigate={(id) => {
          if (id === "logout") {
            handleLogout();
          } else {
            setPage(`kelurahan-${id}`);
          }
        }}
        user={DUMMY_LURAH}
      >
        {activePage === "dashboard" && (
          <KelurahanDashboardPage
            onNavigate={(id) => setPage(`kelurahan-${id}`)}
          />
        )}
        {activePage === "validasi-surat" && <ValidasiSuratPage />}
        {activePage === "riwayat-surat" && <RiwayatSuratPage />}
        {activePage === "verifikasi-warga" && <VerifikasiWargaPage />}
        {activePage === "settings" && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-xl mx-auto shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Pengaturan Kelurahan
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Konfigurasi panel kontrol Kepala Kelurahan.
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </KelurahanLayout>
    );
  }

  // ─── SUPER ADMIN ROLE ───
  if (page.startsWith("admin-")) {
    const activePage = page.replace("admin-", "");

    return (
      <AdminLayout
        activePage={activePage}
        onNavigate={(id) => {
          if (id === "logout") {
            handleLogout();
          } else {
            setPage(`admin-${id}`);
          }
        }}
        user={DUMMY_ADMIN}
      >
        {activePage === "dashboard" && (
          <AdminDashboardPage onNavigate={(id) => setPage(`admin-${id}`)} />
        )}
        {activePage === "staf" && <ManajemenStafPage />}
        {activePage === "layanan" && <ManajemenLayananPage />}
        {activePage === "log" && <LogSistemPage />}
        {activePage === "settings" && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-xl mx-auto shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Pengaturan Admin
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Konfigurasi kontrol sistem global dan hak akses.
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </AdminLayout>
    );
  }

  return (
    <>
      {page === "login" ? (
        <LoginPage
          onNavigateToRegister={() => setPage("register")}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <RegisterPage onNavigateToLogin={() => setPage("login")} />
      )}
    </>
  );
}

export default App;
