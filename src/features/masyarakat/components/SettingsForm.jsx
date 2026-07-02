import { useState } from "react";
import { api } from "../../../utils/api.js";

const SettingsForm = ({ currentUser, setCurrentUser }) => {
  const [form, setForm] = useState({
    noWhatsapp: currentUser?.noWhatsapp || "",
    alamat: currentUser?.alamat || "",
    tempatLahir: currentUser?.tempatLahir || "",
    tanggalLahir: currentUser?.tanggalLahir || "",
    jenisKelamin: currentUser?.jenisKelamin || "Laki-laki",
    agama: currentUser?.agama || "Hindu",
    pekerjaan: currentUser?.pekerjaan || "",
    domisili: currentUser?.domisili || "",
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await api.put("/users/profile", form);
      const updatedUser = response.data.user;
      
      localStorage.setItem("sirat_user", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      setSuccessMsg("Profil Anda berhasil diperbarui!");
    } catch (err) {
      setErrorMsg(err.message || "Gagal memperbarui profil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-2xl mx-auto shadow-sm space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Pengaturan Profil</h2>
        <p className="text-xs text-gray-400">
          Perbarui informasi pribadi Anda. Kolom identitas kependudukan terkunci untuk keamanan.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {successMsg && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-lg">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {/* NIK (Readonly) */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">NIK (Terkunci)</label>
            <input
              type="text"
              value={currentUser?.nik || ""}
              readOnly
              className="w-full px-3 py-2 border border-gray-250 rounded-lg text-xs bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Nama Lengkap (Readonly) */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Nama Lengkap (Terkunci)</label>
            <input
              type="text"
              value={currentUser?.namaLengkap || ""}
              readOnly
              className="w-full px-3 py-2 border border-gray-250 rounded-lg text-xs bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Email (Readonly) */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Email (Terkunci)</label>
            <input
              type="text"
              value={currentUser?.email || ""}
              readOnly
              className="w-full px-3 py-2 border border-gray-250 rounded-lg text-xs bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nomor WhatsApp</label>
            <input
              type="text"
              name="noWhatsapp"
              value={form.noWhatsapp}
              onChange={handleChange}
              placeholder="0812xxxxxxxx"
              className="w-full px-3 py-2 border border-gray-205 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tempat Lahir */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Tempat Lahir</label>
            <input
              type="text"
              name="tempatLahir"
              value={form.tempatLahir}
              onChange={handleChange}
              placeholder="Denpasar"
              className="w-full px-3 py-2 border border-gray-205 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tanggal Lahir */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Tanggal Lahir</label>
            <input
              type="date"
              name="tanggalLahir"
              value={form.tanggalLahir}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-205 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Jenis Kelamin</label>
            <select
              name="jenisKelamin"
              value={form.jenisKelamin}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-205 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option>Laki-laki</option>
              <option>Perempuan</option>
            </select>
          </div>

          {/* Agama */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Agama</label>
            <select
              name="agama"
              value={form.agama}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-205 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"].map(a => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Pekerjaan */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Pekerjaan</label>
            <input
              type="text"
              name="pekerjaan"
              value={form.pekerjaan}
              onChange={handleChange}
              placeholder="Karyawan Swasta"
              className="w-full px-3 py-2 border border-gray-205 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Domisili (Readonly / Locked) */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Domisili (Terkunci)</label>
            <input
              type="text"
              value={form.domisili}
              readOnly
              className="w-full px-3 py-2 border border-gray-250 rounded-lg text-xs bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Alamat */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Alamat Lengkap</label>
          <textarea
            name="alamat"
            value={form.alamat}
            onChange={handleChange}
            rows={2}
            placeholder="Jl. Merdeka No. 10, Banjar Tegal"
            className="w-full px-3 py-2 border border-gray-205 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-350 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsForm;
