import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../../utils/api.js";

const ManajemenStafPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [stafList, setStafList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const searchQuery = searchParams.get("q") || "";
  const filterRole = searchParams.get("role") || "All";
  const isModalOpen = searchParams.get("modal") === "add";

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("Kelurahan");
  const [formArea, setFormArea] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formConfirmPassword, setFormConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const fetchStaff = async () => {
    try {
      const response = await api.get("/admin/staff");
      const mapped = (response.data.staff || []).map((s) => ({
        id: s.id,
        name: s.namaLengkap,
        email: s.email,
        role: s.role === "KALING" ? "Kaling" : "Kelurahan",
        area: s.area,
        status: s.isActive ? "Aktif" : "Nonaktif",
      }));
      setStafList(mapped);
    } catch (err) {
      console.error("Gagal mengambil data staf:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const updateQuery = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    navigate({ search: next.toString() }, { replace: true });
  };

  const handleAddStaf = async (e) => {
    e.preventDefault();
    if (!formName || !formEmail || !formArea || !formPassword) return;

    if (formPassword !== formConfirmPassword) {
      setPasswordError("Ulangi password tidak cocok!");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const mappedRole = formRole === "Kaling" ? "KALING" : "KELURAHAN";
      await api.post("/admin/staff", {
        namaLengkap: formName,
        email: formEmail,
        role: mappedRole,
        area: formArea,
        password: formPassword,
      });

      updateQuery({ modal: "" });
      // Reset Form
      setFormName("");
      setFormEmail("");
      setFormRole("Kelurahan");
      setFormArea("");
      setFormPassword("");
      setFormConfirmPassword("");
      setPasswordError("");

      fetchStaff();
    } catch (err) {
      setErrorMsg(err.message || "Gagal membuat akun staf.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.patch(`/admin/staff/${id}/status`);
      fetchStaff();
    } catch (err) {
      alert(err.message || "Gagal mengubah status staf.");
    }
  };

  const deleteStaf = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus akun staf ini?")) {
      try {
        await api.delete(`/admin/staff/${id}`);
        fetchStaff();
      } catch (err) {
        alert(err.message || "Gagal menghapus staf.");
      }
    }
  };

  const filteredStaf = useMemo(() => {
    return stafList.filter((staf) => {
      const matchesSearch =
        staf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staf.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staf.area.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = filterRole === "All" || staf.role === filterRole;

      return matchesSearch && matchesFilter;
    });
  }, [stafList, searchQuery, filterRole]);

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">
            Manajemen Staf & Pengguna
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Kelola hak akses dan akun administrasi Lurah (Kelurahan) serta
            Kepala Lingkungan (Kaling).
          </p>
        </div>
        <button
          onClick={() => updateQuery({ modal: "add" })}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
        >
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Tambah Akun Staf
        </button>
      </div>

      {/* Control row */}
      <div className="flex gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:w-96 shadow-sm rounded-lg">
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
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Cari nama, email, atau wilayah..."
            value={searchQuery}
            onChange={(e) => updateQuery({ q: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-350 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        {/* Dropdown Role */}
        <select
          value={filterRole}
          onChange={(e) => updateQuery({ role: e.target.value })}
          className="px-4 py-2.5 bg-white border border-gray-205 rounded-lg text-xs font-semibold text-gray-650 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="All">Semua Role</option>
          <option value="Kelurahan">Kelurahan</option>
          <option value="Kaling">Kaling</option>
        </select>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-xs text-gray-400 font-medium">
              Memuat data staf...
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Nama Staf</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Wilayah Tugas</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {filteredStaf.map((item) => {
                  const badgeStyle =
                    item.status === "Aktif"
                      ? "border-emerald-500 text-emerald-600 bg-emerald-50/10"
                      : "border-red-500 text-red-650 bg-red-50/10";
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-7 h-7 border border-slate-300 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {item.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="font-semibold text-gray-800">
                          {item.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-500">
                        {item.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.role === "Kelurahan"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {item.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{item.area}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wide ${badgeStyle}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.status === "Aktif" ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => toggleStatus(item.id)}
                            className="px-2.5 py-1.5 border border-gray-200 rounded text-[9px] font-bold text-gray-600 hover:bg-gray-50"
                          >
                            {item.status === "Aktif" ? "Deaktifkan" : "Aktifkan"}
                          </button>
                          <button
                            onClick={() => deleteStaf(item.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-all"
                            aria-label="Hapus Akun"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredStaf.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      Tidak ada akun staf yang cocok dengan pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Add Staf */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 flex flex-col gap-4 relative animate-scaleIn">
            <button
              onClick={() => {
                updateQuery({ modal: "" });
                setErrorMsg("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
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

            <div>
              <h3 className="text-base font-bold text-gray-900">
                Tambah Akun Staf Baru
              </h3>
              <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                Buat kredensial admin baru untuk kelurahan atau kepala lingkungan setempat.
              </p>
            </div>

            <form onSubmit={handleAddStaf} className="space-y-3.5">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                  {errorMsg}
                </div>
              )}
              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                  {passwordError}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-gray-750 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: I Made Herman"
                  className="w-full px-3 py-2 border border-gray-255 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-750 mb-1">
                  Alamat Email (Username Login)
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="contoh.staf@sirat.go.id"
                  className="w-full px-3 py-2 border border-gray-255 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-750 mb-1">
                    Role Jabatan
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-255 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    <option>Kelurahan</option>
                    <option>Kaling</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-750 mb-1">
                    Wilayah / Banjar Tugas
                  </label>
                  <input
                    type="text"
                    value={formArea}
                    onChange={(e) => setFormArea(e.target.value)}
                    placeholder="Contoh: Banjar Tegal"
                    className="w-full px-3 py-2 border border-gray-255 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-750 mb-1">
                  Password Baru
                </label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3 py-2 border border-gray-255 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-750 mb-1">
                  Ulangi Password Baru
                </label>
                <input
                  type="password"
                  value={formConfirmPassword}
                  onChange={(e) => setFormConfirmPassword(e.target.value)}
                  placeholder="Masukkan kembali password"
                  className="w-full px-3 py-2 border border-gray-255 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    updateQuery({ modal: "" });
                    setErrorMsg("");
                  }}
                  disabled={submitting}
                  className="flex-1 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-350 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                >
                  {submitting ? "Membuat..." : "Simpan Kredensial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManajemenStafPage;
