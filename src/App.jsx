import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import { setLogoutCallback } from "./utils/api.js";
import SettingsForm from "./features/masyarakat/components/SettingsForm";
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

const ROLE_ROUTES = {
  masyarakat: {
    layout: MasyarakatLayout,
    defaultPage: "beranda",
    pages: {
      beranda: <BerandaPage />,
      ajukan: <AjukanSuratPage />,
      permohonan: <PermohonanSuratPage />,
      dokumen: <DokumenPage />,
      settings: true,
    },
  },
  kaling: {
    layout: KalingLayout,
    defaultPage: "dashboard",
    pages: {
      dashboard: true,
      verifikasi: true,
      riwayat: true,
      warga: true,
      settings: true,
    },
  },
  kelurahan: {
    layout: KelurahanLayout,
    defaultPage: "dashboard",
    pages: {
      dashboard: true,
      "validasi-surat": true,
      "riwayat-surat": true,
      "verifikasi-warga": true,
      settings: true,
    },
  },
  admin: {
    layout: AdminLayout,
    defaultPage: "dashboard",
    pages: {
      dashboard: true,
      staf: true,
      layanan: true,
      log: true,
      settings: true,
    },
  },
};

const INFO_PAGES = {
  "forgot-password": {
    title: "Atur Ulang Password",
    description:
      "Halaman ini bisa kamu sambungkan ke flow reset password nanti. Untuk sekarang, ini memastikan route-nya sudah valid dan tidak mentok di button kosong.",
  },
  "register/terms": {
    title: "Syarat dan Ketentuan",
    description:
      "Tempat yang pas untuk menampilkan aturan penggunaan layanan dan persetujuan pengguna.",
  },
  "register/privacy": {
    title: "Kebijakan Privasi",
    description:
      "Halaman ini bisa dipakai untuk menjelaskan bagaimana data pribadi diproses dan disimpan.",
  },
  "help": {
    title: "Pusat Bantuan",
    description:
      "Halaman bantuan umum untuk pertanyaan terkait login, registrasi, dan alur layanan.",
  },
  "guide": {
    title: "Panduan Registrasi",
    description:
      "Halaman panduan langkah demi langkah untuk pengguna baru yang ingin mendaftar akun.",
  },
  contact: {
    title: "Kontak Kami",
    description:
      "Halaman kontak untuk pertanyaan teknis, layanan, atau dukungan pengguna.",
  },
};

const InfoPage = ({ title, description }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <p className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-3">
          CivicLink / SI-RAT
        </p>
        <h1 className="text-3xl font-extrabold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500 mt-3 leading-relaxed">
          {description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/login")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-colors"
          >
            Kembali ke Login
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg text-sm transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardShell = ({ role, currentUser, setCurrentUser, setToken }) => {
  const navigate = useNavigate();
  const params = useParams();
  const config = ROLE_ROUTES[role];

  if (!config) {
    return <Navigate to="/dashboard/login" replace />;
  }

  const activePage = params.page || config.defaultPage;

  if (config.pages[activePage] === undefined) {
    return <Navigate to={`/dashboard/${role}/${config.defaultPage}`} replace />;
  }

  const Layout = config.layout;
  let content = null;

  const currentActiveUser = currentUser
    ? { ...currentUser, name: currentUser.namaLengkap }
    : null;

  if (role === "masyarakat") {
    if (activePage === "beranda") content = <BerandaPage />;
    if (activePage === "ajukan") content = <AjukanSuratPage />;
    if (activePage === "permohonan") content = <PermohonanSuratPage />;
    if (activePage === "dokumen") content = <DokumenPage />;
    if (activePage === "settings") {
      content = <SettingsForm currentUser={currentUser} setCurrentUser={setCurrentUser} />;
    }
  }

  if (role === "kaling") {
    if (activePage === "dashboard") {
      content = (
        <DashboardPage
          onNavigate={(id) => navigate(`/dashboard/${role}/${id}`)}
        />
      );
    }
    if (activePage === "verifikasi") content = <PerluVerifikasiPage />;
    if (activePage === "riwayat") content = <RiwayatVerifikasiPage />;
    if (activePage === "warga") content = <DaftarWargaPage />;
    if (activePage === "settings") {
      content = (
        <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-xl mx-auto shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Pengaturan Kaling
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            Konfigurasi panel kontrol Kepala Lingkungan.
          </p>
          <p className="text-sm text-gray-600">
            Route halaman ini juga mengikuti prefix <code>/dashboard</code>.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("sirat_token");
                localStorage.removeItem("sirat_user");
                setToken(null);
                setCurrentUser(null);
                navigate("/dashboard/login", { replace: true });
              }}
              className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      );
    }
  }

  if (role === "kelurahan") {
    if (activePage === "dashboard") {
      content = (
        <KelurahanDashboardPage
          onNavigate={(id) => navigate(`/dashboard/${role}/${id}`)}
        />
      );
    }
    if (activePage === "validasi-surat") content = <ValidasiSuratPage />;
    if (activePage === "riwayat-surat") content = <RiwayatSuratPage />;
    if (activePage === "verifikasi-warga") content = <VerifikasiWargaPage />;
    if (activePage === "settings") {
      content = (
        <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-xl mx-auto shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Pengaturan Kelurahan
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            Konfigurasi panel kontrol Kepala Kelurahan.
          </p>
          <p className="text-sm text-gray-600">
            Route ini juga berada di bawah <code>/dashboard</code>.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("sirat_token");
                localStorage.removeItem("sirat_user");
                setToken(null);
                setCurrentUser(null);
                navigate("/dashboard/login", { replace: true });
              }}
              className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      );
    }
  }

  if (role === "admin") {
    if (activePage === "dashboard") {
      content = (
        <AdminDashboardPage
          onNavigate={(id) => navigate(`/dashboard/${role}/${id}`)}
        />
      );
    }
    if (activePage === "staf") content = <ManajemenStafPage />;
    if (activePage === "layanan") content = <ManajemenLayananPage />;
    if (activePage === "log") content = <LogSistemPage />;
    if (activePage === "settings") {
      content = (
        <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-xl mx-auto shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Pengaturan Admin
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            Konfigurasi kontrol sistem global dan hak akses.
          </p>
          <p className="text-sm text-gray-600">
            Semua halaman admin sekarang konsisten di route <code>/dashboard</code>.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("sirat_token");
                localStorage.removeItem("sirat_user");
                setToken(null);
                setCurrentUser(null);
                navigate("/dashboard/login", { replace: true });
              }}
              className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      );
    }
  }

  return (
    <Layout
      activePage={activePage}
      onNavigate={(id) => {
        if (id === "logout") {
          localStorage.removeItem("sirat_token");
          localStorage.removeItem("sirat_user");
          setToken(null);
          setCurrentUser(null);
          navigate("/dashboard/login", { replace: true });
          return;
        }
        navigate(`/dashboard/${role}/${id}`);
      }}
      user={currentActiveUser}
    >
      {content}
    </Layout>
  );
};

function AppRoutes() {
  const [currentUser, setCurrentUser] = useState(() => {
    const cached = localStorage.getItem("sirat_user");
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem("sirat_token");
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Setup API logout hook
    setLogoutCallback(() => {
      localStorage.removeItem("sirat_token");
      localStorage.removeItem("sirat_user");
      setCurrentUser(null);
      setToken(null);
      navigate("/dashboard/login", { replace: true });
    });
  }, [navigate]);

  const handleLoginSuccess = (role = "masyarakat") => {
    const cachedUser = localStorage.getItem("sirat_user");
    const cachedToken = localStorage.getItem("sirat_token");
    if (cachedUser && cachedToken) {
      setCurrentUser(JSON.parse(cachedUser));
      setToken(cachedToken);
    }
    const config = ROLE_ROUTES[role] ?? ROLE_ROUTES.masyarakat;
    navigate(`/dashboard/${role}/${config.defaultPage}`, { replace: true });
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard/login" replace />} />
      <Route
        path="/dashboard"
        element={<Navigate to="/dashboard/login" replace />}
      />
      <Route
        path="/dashboard/login"
        element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
      />
      <Route path="/dashboard/register" element={<RegisterPage />} />
      {Object.entries(INFO_PAGES).map(([path, page]) => (
        <Route
          key={path}
          path={`/dashboard/${path}`}
          element={<InfoPage title={page.title} description={page.description} />}
        />
      ))}
      <Route
        path="/dashboard/:role"
        element={
          token ? <DashboardRedirect /> : <Navigate to="/dashboard/login" replace />
        }
      />
      <Route
        path="/dashboard/:role/:page"
        element={
          token ? (
            <DashboardRoute
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              setToken={setToken}
            />
          ) : (
            <Navigate to="/dashboard/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/dashboard/login" replace />} />
    </Routes>
  );
}

function DashboardRedirect() {
  const { role } = useParams();
  const config = ROLE_ROUTES[role];

  if (!config) {
    return <Navigate to="/dashboard/login" replace />;
  }

  return (
    <Navigate to={`/dashboard/${role}/${config.defaultPage}`} replace />
  );
}

function DashboardRoute({ currentUser, setCurrentUser, setToken }) {
  const { role } = useParams();
  
  // Access control validation: check if the route role matches the authenticated user role
  let expectedRoleKey = "masyarakat";
  if (currentUser?.role === "KALING") expectedRoleKey = "kaling";
  if (currentUser?.role === "KELURAHAN") expectedRoleKey = "kelurahan";
  if (currentUser?.role === "SUPER_ADMIN") expectedRoleKey = "admin";

  if (role !== expectedRoleKey) {
    return <Navigate to={`/dashboard/${expectedRoleKey}`} replace />;
  }

  return (
    <DashboardShell
      role={role}
      currentUser={currentUser}
      setCurrentUser={setCurrentUser}
      setToken={setToken}
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
