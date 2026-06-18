import { useState } from "react";

const DUMMY_STAF = [
  {
    id: 1,
    name: "Lurah Renon",
    email: "lurah.renon@civiclink.id",
    role: "Kelurahan",
    area: "Kelurahan Renon",
    status: "Aktif",
  },
  {
    id: 2,
    name: "Bpk. Herman",
    email: "herman.kaling@civiclink.id",
    role: "Kaling",
    area: "Banjar Anyar Renon",
    status: "Aktif",
  },
  {
    id: 3,
    name: "Lurah Sanur",
    email: "lurah.sanur@civiclink.id",
    role: "Kelurahan",
    area: "Kelurahan Sanur",
    status: "Aktif",
  },
  {
    id: 4,
    name: "Ibu Ratna",
    email: "ratna.kaling@civiclink.id",
    role: "Kaling",
    area: "Banjar Tegal Sanur",
    status: "Aktif",
  },
  {
    id: 5,
    name: "Bpk. Joko",
    email: "joko.kaling@civiclink.id",
    role: "Kaling",
    area: "Banjar Kaja Renon",
    status: "Nonaktif",
  },
];

const ManajemenStafPage = () => {
  const [stafList, setStafList] = useState(DUMMY_STAF);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("Kelurahan");
  const [formArea, setFormArea] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formConfirmPassword, setFormConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleAddStaf = (e) => {
    e.preventDefault();
    if (!formName || !formEmail || !formArea || !formPassword) return;

    if (formPassword !== formConfirmPassword) {
      setPasswordError("Ulangi password tidak cocok!");
      return;
    }

    const newStaf = {
      id: Date.now(),
      name: formName,
      email: formEmail,
      role: formRole,
      area: formArea,
      status: "Aktif",
    };

    setStafList([newStaf, ...stafList]);
    setIsModalOpen(false);

    // Reset Form
    setFormName("");
    setFormEmail("");
    setFormRole("Kelurahan");
    setFormArea("");
    setFormPassword("");
    setFormConfirmPassword("");
    setPasswordError("");
  };

  const toggleStatus = (id) => {
    setStafList(
      stafList.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: item.status === "Aktif" ? "Nonaktif" : "Aktif",
          };
        }
        return item;
      }),
    );
  };

  const deleteStaf = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus akun staf ini?")) {
      setStafList(stafList.filter((item) => item.id !== id));
    }
  };

  const filteredStaf = stafList.filter((staf) => {
    const matchesSearch =
      staf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staf.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staf.area.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterRole === "All" || staf.role === filterRole;

    return matchesSearch && matchesFilter;
  });

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
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg text-xs transition-all shadow-md"
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
          Tambah Staf Baru
        </button>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
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
            placeholder="Cari nama staf, email, atau wilayah tugas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg text-xs transition-all text-gray-800"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setFilterRole("All")}
            className={`px-3 py-2 text-[10px] font-bold rounded-lg transition-all border ${
              filterRole === "All"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterRole("Kelurahan")}
            className={`px-3 py-2 text-[10px] font-bold rounded-lg transition-all border ${
              filterRole === "Kelurahan"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Kelurahan
          </button>
          <button
            onClick={() => setFilterRole("Kaling")}
            className={`px-3 py-2 text-[10px] font-bold rounded-lg transition-all border ${
              filterRole === "Kaling"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Kaling
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Staf</th>
                <th className="px-6 py-4">Peran (Role)</th>
                <th className="px-6 py-4">Wilayah Penugasan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
              {filteredStaf.length > 0 ? (
                filteredStaf.map((staf) => (
                  <tr
                    key={staf.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{staf.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {staf.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-wide ${
                          staf.role === "Kelurahan"
                            ? "border-purple-500 text-purple-700"
                            : "border-amber-500 text-amber-700"
                        }`}
                      >
                        {staf.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{staf.area}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(staf.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide transition-all border ${
                          staf.status === "Aktif"
                            ? "border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                            : "border-red-500 text-red-700 hover:bg-red-50"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${staf.status === "Aktif" ? "bg-emerald-500" : "bg-red-500"}`}
                        />
                        {staf.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => toggleStatus(staf.id)}
                        className="text-[10px] font-bold text-gray-400 hover:text-blue-600 transition-all"
                      >
                        Ubah Status
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => deleteStaf(staf.id)}
                        className="text-[10px] font-bold text-red-400 hover:text-red-600 transition-all"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-400 font-bold"
                  >
                    Tidak ada data staf ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">
                Tambah Akun Staf Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStaf} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: I Wayan Sudarta"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Email Staf
                </label>
                <input
                  type="email"
                  required
                  placeholder="Contoh: wayan.kaling@civiclink.id"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Peran / Role
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-gray-700"
                  >
                    <option value="Kelurahan">Kelurahan</option>
                    <option value="Kaling">Kaling</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Wilayah Tugas
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      formRole === "Kelurahan"
                        ? "Kel. Renon"
                        : "Banjar Anyar Renon"
                    }
                    value={formArea}
                    onChange={(e) => setFormArea(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Kata Sandi
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formPassword}
                    onChange={(e) => {
                      setFormPassword(e.target.value);
                      setPasswordError("");
                    }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Ulangi Kata Sandi
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formConfirmPassword}
                    onChange={(e) => {
                      setFormConfirmPassword(e.target.value);
                      setPasswordError("");
                    }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {passwordError && (
                <p className="text-[10px] text-red-600 font-bold mt-1">
                  ⚠ {passwordError}
                </p>
              )}

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-bold text-gray-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all shadow-md"
                >
                  Simpan Akun
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
