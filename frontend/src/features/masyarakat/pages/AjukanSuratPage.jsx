import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ServiceCard from "../components/ServiceCard";
import SubmissionModal from "../components/SubmissionModal";
import { SERVICES, getServiceIcon } from "../../../data/serviceData.jsx";

const AjukanSuratPage = ({ user }) => {
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "Semua";
  const searchTerm = searchParams.get("q") || "";
  const selectedServiceId = searchParams.get("service");

  // Enrich SERVICES with their icon components for rendering
  const enrichedServices = useMemo(
    () =>
      SERVICES.map((s) => ({
        ...s,
        icon: getServiceIcon(s.id),
      })),
    [],
  );

  const selectedService = useMemo(
    () =>
      selectedServiceId
        ? enrichedServices.find((service) => service.id === selectedServiceId)
        : null,
    [enrichedServices, selectedServiceId],
  );

  const filteredServices = enrichedServices.filter((service) => {
    const matchesSearch = service.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === "Semua" ||
      service.tags.some((tag) => tag.toUpperCase() === activeTab.toUpperCase());
    return matchesSearch && matchesTab;
  });

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

  const handleSuccess = () => {
    setShowToast(true);
    updateQuery({ service: "", step: "" });
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <div className="w-full space-y-6 pb-8 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-bounce">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <div>
            <p className="text-xs font-bold">Pengajuan Berhasil Dikirim!</p>
            <p className="text-[10px] opacity-90">
              Silakan pantau status di menu Permohonan Surat Saya.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">
          Ajukan Surat Permohonan
        </h1>
        <p className="text-gray-400 text-xs mt-0.5">
          Pilih jenis layanan administrasi yang Anda butuhkan untuk memulai
          pengajuan dokumen baru.
        </p>
      </div>

      {/* Search & Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center border-b border-gray-100 pb-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            "Semua",
            "Kaling Saja",
            "Kelurahan",
            "Kependudukan",
            "Sosial & Ekonomi",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => updateQuery({ tab, service: "" })}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200
                ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
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
            placeholder="Cari layanan surat..."
            value={searchTerm}
            onChange={(e) => updateQuery({ q: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={(selected) =>
                updateQuery({ service: selected.id, step: "1" })
              }
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <svg
            className="w-12 h-12 text-gray-300 mx-auto mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 0h18a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
          <h3 className="text-sm font-bold text-gray-700">
            Layanan Tidak Ditemukan
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Coba gunakan kata kunci lain atau pilih kategori yang berbeda.
          </p>
        </div>
      )}

      {/* Submission Modal Component */}
      {selectedService && (
        <SubmissionModal
          key={selectedService.id}
          service={selectedService}
          user={user}
          onClose={() => updateQuery({ service: "", step: "" })}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default AjukanSuratPage;
