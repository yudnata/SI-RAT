import { useState } from "react";
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

const ROLE_ROUTES = {
  masyarakat: {
    layout: MasyarakatLayout,
    user: DUMMY_USER,
    defaultPage: "beranda",
    pages: {
      beranda: <BerandaPage user={DUMMY_USER} />,
      ajukan: <AjukanSuratPage user={DUMMY_USER} />,
      permohonan: <PermohonanSuratPage user={DUMMY_USER} />,
      dokumen: <DokumenPage user={DUMMY_USER} />,
      settings: (
        <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-xl mx-auto shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Pengaturan Akun
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            Kelola konfigurasi privasi, keamanan, dan notifikasi akun Anda.
          </p>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Halaman ini sekarang memakai route nyata di bawah <code>/dashboard</code>.
            </p>
          </div>
        </div>
      ),
    },
  },
  kaling: {
    layout: KalingLayout,
    user: DUMMY_KALING,
    defaultPage: "dashboard",
    pages: {
      dashboard: true,
      verifikasi: true,
      riwayat: true,
      warga: true,
      settings: (
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
        </div>
      ),
    },
  },
  kelurahan: {
    layout: KelurahanLayout,
    user: DUMMY_LURAH,
    defaultPage: "dashboard",
    pages: {
      dashboard: true,
      "validasi-surat": true,
      "riwayat-surat": true,
      "verifikasi-warga": true,
      settings: (
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
        </div>
      ),
    },
  },
  admin: {
    layout: AdminLayout,
    user: DUMMY_ADMIN,
    defaultPage: "dashboard",
    pages: {
      dashboard: true,
      staf: true,
      layanan: true,
      log: true,
      settings: (
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
        </div>
      ),
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

const DashboardShell = ({ role, pendingList, setPendingList }) => {
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

  if (role === "masyarakat") {
    if (activePage === "beranda") content = <BerandaPage user={DUMMY_USER} />;
    if (activePage === "ajukan") content = <AjukanSuratPage user={DUMMY_USER} />;
    if (activePage === "permohonan") content = <PermohonanSuratPage user={DUMMY_USER} />;
    if (activePage === "dokumen") content = <DokumenPage user={DUMMY_USER} />;
    if (activePage === "settings") {
      content = (
        <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-xl mx-auto shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Pengaturan Akun
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            Kelola konfigurasi privasi, keamanan, dan notifikasi akun Anda.
          </p>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Halaman ini sekarang memakai route nyata di bawah <code>/dashboard</code>.
            </p>
            <button
              type="button"
              onClick={() => navigate("/dashboard/login", { replace: true })}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      );
    }
  }

  if (role === "kaling") {
    if (activePage === "dashboard") {
      content = (
        <DashboardPage
          onNavigate={(id) => navigate(`/dashboard/${role}/${id}`)}
          pendingList={pendingList}
        />
      );
    }
    if (activePage === "verifikasi") {
      content = (
        <PerluVerifikasiPage
          list={pendingList}
          setList={setPendingList}
        />
      );
    }
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
              onClick={() => navigate("/dashboard/login", { replace: true })}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors"
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
              onClick={() => navigate("/dashboard/login", { replace: true })}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors"
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
              onClick={() => navigate("/dashboard/login", { replace: true })}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors"
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
          navigate("/dashboard/login", { replace: true });
          return;
        }
        navigate(`/dashboard/${role}/${id}`);
      }}
      user={config.user}
    >
      {content}
    </Layout>
  );
};

function AppRoutes() {
  const [kalingPendingList, setKalingPendingList] = useState(DUMMY_PENDING);
  const navigate = useNavigate();

  const handleLoginSuccess = (role = "masyarakat") => {
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
      <Route path="/dashboard/:role" element={<DashboardRedirect />} />
      <Route
        path="/dashboard/:role/:page"
        element={
          <DashboardRoute
            pendingList={kalingPendingList}
            setPendingList={setKalingPendingList}
          />
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

function DashboardRoute({ pendingList, setPendingList }) {
  const { role } = useParams();
  return (
    <DashboardShell
      role={role}
      pendingList={pendingList}
      setPendingList={setPendingList}
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
