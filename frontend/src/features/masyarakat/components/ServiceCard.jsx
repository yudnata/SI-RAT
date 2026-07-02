const TAG_STYLES = {
  KALING: "border border-blue-500 text-blue-600",
  "KALING SAJA": "border border-blue-500 text-blue-600",
  KELURAHAN: "border border-amber-500 text-amber-600",
  KEPENDUDUKAN: "border border-teal-500 text-teal-650",
  "SOSIAL & EKONOMI": "border border-emerald-500 text-emerald-600",
  PERIZINAN: "border border-purple-500 text-purple-650",
  UMUM: "border border-gray-300 text-gray-500",
};

const ServiceCard = ({ service, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(service)}
      className="w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 group flex items-center gap-3.5 relative min-h-[102px]"
    >
      {/* Sisi Kiri: Icon tanpa bg */}
      <div className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0">
        {service.icon}
      </div>

      {/* Divider Vertikal */}
      <div className="h-10 w-px bg-gray-100 group-hover:bg-blue-100 transition-colors flex-shrink-0" />

      {/* Sisi Kanan: Teks, Nama Surat, Badges */}
      <div className="flex-1 min-w-0 pr-8 space-y-1.5">
        <h3 className="text-[13px] font-extrabold text-gray-800 leading-snug group-hover:text-blue-700 transition-colors">
          {service.name}
        </h3>

        <div className="flex flex-wrap gap-1.5">
          {service.tags.map((tag) => (
            <span
              key={tag}
              className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${TAG_STYLES[tag] ?? "border border-gray-300 text-gray-500"} bg-transparent`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Pojok Kanan Tengah: Arrow (Vertically Centered) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-blue-600 transition-all transform group-hover:translate-x-0.5">
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
      </div>
    </button>
  );
};

export default ServiceCard;
