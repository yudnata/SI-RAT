import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SERVICES as SHARED_SERVICES } from "../../../data/serviceData.jsx";

const AVAILABLE_REQUIREMENTS = [
  { key: "ktp", label: "KTP (Kartu Tanda Penduduk)" },
  { key: "kk", label: "Kartu Keluarga (KK)" },
  { key: "aktaLahir", label: "Akta Kelahiran" },
  { key: "pasFoto", label: "Pas Foto Resmi" },
  { key: "npwp", label: "NPWP (Nomor Pokok Wajib Pajak)" },
  { key: "pernyataan", label: "Surat Pernyataan (Bermaterai)" },
  { key: "aktaKematian", label: "Akta Kematian Pewaris" },
  { key: "nikah", label: "Surat Nikah / Akta Perkawinan" },
];

// Map shared service data to the admin page format
const buildInitialServices = () =>
  SHARED_SERVICES.map((s, idx) => ({
    id: idx + 1,
    name: s.name,
    category:
      s.tags.find((t) => !["KALING SAJA", "KELURAHAN"].includes(t)) || "Umum",
    requirements: s.requirements,
    requirementKeys: s.requirementKeys || [],
    flow: s.flow,
    active: true,
    needsKaling: s.needsKaling,
    needsKelurahan: s.needsKelurahan,
    forwardTo: s.forwardTo,
  }));

const DUMMY_SERVICES = buildInitialServices();

const ManajemenLayananPage = () => {
  const [services, setServices] = useState(DUMMY_SERVICES);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const routeSearchQuery = searchParams.get("q") || "";
  const routeModal = searchParams.get("modal");
  const routeIsModalOpen = routeModal === "add" || routeModal === "edit";

  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Kependudukan");
  const [selectedReqKeys, setSelectedReqKeys] = useState(["ktp", "kk"]);
  const [formFlow, setFormFlow] = useState("Kaling ➔ Kelurahan");

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

  const handleSaveService = (e) => {
    e.preventDefault();
    if (!formName || selectedReqKeys.length === 0) return;

    const reqLabels = selectedReqKeys.map((k) => {
      const match = AVAILABLE_REQUIREMENTS.find((item) => item.key === k);
      return match ? match.label : k;
    });

    if (isEditMode) {
      setServices(
        services.map((s) =>
          s.id === selectedServiceId
            ? {
                ...s,
                name: formName,
                category: formCategory,
                requirements: reqLabels,
                requirementKeys: selectedReqKeys,
                flow: formFlow,
              }
            : s,
        ),
      );
    } else {
      const newService = {
        id: Date.now(),
        name: formName,
        category: formCategory,
        requirements: reqLabels,
        requirementKeys: selectedReqKeys,
        flow: formFlow,
        active: true,
      };
      setServices([newService, ...services]);
    }

    updateQuery({ modal: "", id: "" });
    setIsEditMode(false);
    setSelectedServiceId(null);

    // Reset Form
    setFormName("");
    setFormCategory("Kependudukan");
    setSelectedReqKeys(["ktp", "kk"]);
    setFormFlow("Kaling ➔ Kelurahan");
  };

  const handleEditClick = (service) => {
    setIsEditMode(true);
    setSelectedServiceId(service.id);
    setFormName(service.name);
    setFormCategory(service.category);
    setFormFlow(service.flow);
    setSelectedReqKeys(service.requirementKeys || []);
    updateQuery({ modal: "edit", id: String(service.id) });
  };

  const handleAddNewClick = () => {
    setIsEditMode(false);
    setSelectedServiceId(null);
    setFormName("");
    setFormCategory("Kependudukan");
    setSelectedReqKeys(["ktp", "kk"]);
    setFormFlow("Kaling ➔ Kelurahan");
    updateQuery({ modal: "add", id: "" });
  };

  const toggleActive = (id) => {
    setServices(
      services.map((s) => {
        if (s.id === id) {
          return { ...s, active: !s.active };
        }
        return s;
      }),
    );
  };

  const deleteService = (id) => {
    if (
      confirm(
        "Apakah Anda yakin ingin menghapus layanan surat ini dari katalog?",
      )
    ) {
      setServices(services.filter((s) => s.id !== id));
    }
  };

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(routeSearchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(routeSearchQuery.toLowerCase()),
  );

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">
            Manajemen Layanan & Formulir Surat
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Konfigurasi jenis layanan surat administrasi kependudukan, prasyarat
            berkas, dan alur validasinya.
          </p>
        </div>
        <button
          onClick={handleAddNewClick}
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
          Tambah Layanan
        </button>
      </div>

      {/* Control bar */}
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
            placeholder="Cari jenis surat atau kategori..."
            value={routeSearchQuery}
            onChange={(e) => updateQuery({ q: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg text-xs transition-all text-gray-800"
          />
        </div>
      </div>

      {/* Services List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-md border border-blue-500 text-[9px] font-bold text-blue-600 uppercase tracking-wide">
                      {service.category}
                    </span>
                    <h3 className="text-sm font-extrabold text-gray-900 mt-1">
                      {service.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => toggleActive(service.id)}
                    className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider transition-all ${
                      service.active
                        ? "border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                        : "border-gray-300 text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {service.active ? "Aktif" : "Nonaktif"}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                    Dokumen Persyaratan:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {service.requirements.map((req, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-gray-650 border border-gray-300"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2 text-[10px] text-gray-500 font-semibold">
                  <span className="text-gray-400 uppercase text-[9px] tracking-wider">
                    Alur Validasi:
                  </span>
                  <span className="px-2 py-0.5 border border-indigo-400 text-indigo-650 rounded-md">
                    {service.flow}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2 text-xs">
                <button
                  onClick={() => handleEditClick(service)}
                  className="px-3 py-1.5 border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-lg font-bold text-[10px] transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleActive(service.id)}
                  className="px-3 py-1.5 border border-gray-250 hover:bg-gray-50 rounded-lg font-bold text-[10px] text-gray-500 transition-all"
                >
                  Ubah Status
                </button>
                <button
                  onClick={() => deleteService(service.id)}
                  className="px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg font-bold text-[10px] transition-all"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-400 font-bold">
            Tidak ada layanan surat ditemukan
          </div>
        )}
      </div>

      {/* Add Service Modal */}
      {routeIsModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">
                {isEditMode
                  ? "Edit Layanan Surat"
                  : "Tambah Layanan Surat Baru"}
              </h3>
              <button
                onClick={() => updateQuery({ modal: "", id: "" })}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveService} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Nama Layanan Surat
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Surat Keterangan Beda Nama"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Kategori Layanan
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-gray-700"
                >
                  <option value="Kependudukan">Kependudukan</option>
                  <option value="Ekonomi">Ekonomi</option>
                  <option value="Sosial">Sosial</option>
                  <option value="Kesehatan">Kesehatan</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Alur Validasi
                </label>
                <select
                  value={formFlow}
                  onChange={(e) => setFormFlow(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-gray-700"
                >
                  <option value="Kaling ➔ Kelurahan">Kaling ➔ Kelurahan</option>
                  <option value="Kelurahan Langsung">Kelurahan Langsung</option>
                  <option value="Kaling Langsung">Kaling Langsung</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Dokumen Persyaratan Wajib
                </label>
                <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 border border-gray-200 rounded-lg max-h-[140px] overflow-y-auto">
                  {AVAILABLE_REQUIREMENTS.map((req) => {
                    const isChecked = selectedReqKeys.includes(req.key);
                    return (
                      <label
                        key={req.key}
                        className="flex items-center gap-1.5 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedReqKeys(
                                selectedReqKeys.filter((k) => k !== req.key),
                              );
                            } else {
                              setSelectedReqKeys([...selectedReqKeys, req.key]);
                            }
                          }}
                          className="w-3.5 h-3.5 border-gray-300 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span
                          className="text-[10px] text-gray-750 font-semibold truncate"
                          title={req.label}
                        >
                          {req.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => updateQuery({ modal: "", id: "" })}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-bold text-gray-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all shadow-md"
                >
                  {isEditMode ? "Simpan Perubahan" : "Simpan Layanan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManajemenLayananPage;
