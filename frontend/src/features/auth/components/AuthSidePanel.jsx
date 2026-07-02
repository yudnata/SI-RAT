import govtIllustration from "../../../assets/govt_illustration.png";

/**
 * AuthSidePanel - Reusable left panel component shared by Login & Register pages.
 * Accepts `title`, `subtitle`, and `description` as props for per-page customization.
 */
const AuthSidePanel = ({ title, subtitle, description }) => {
  return (
    <div className="hidden md:flex flex-col justify-between w-2/5 bg-gradient-to-br from-blue-700 to-blue-900 p-10 relative overflow-hidden">
      {/* Decorative circle rings */}
      <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full border-[40px] border-white/10"></div>
      <div className="absolute bottom-[-80px] left-[-40px] w-72 h-72 rounded-full border-[50px] border-white/10"></div>

      {/* Branding */}
      <div className="relative z-10 flex items-center gap-2">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
          <svg
            className="w-4 h-4 text-blue-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"
            />
          </svg>
        </div>
        <span className="text-white font-extrabold text-lg tracking-wider">
          SI-RAT
        </span>
      </div>

      {/* Main headline */}
      <div className="relative z-10 mt-6">
        {subtitle && (
          <p className="text-blue-200 text-xs font-semibold tracking-widest uppercase mb-3">
            {subtitle}
          </p>
        )}
        <h1 className="text-white text-3xl font-extrabold leading-snug">
          {title}
        </h1>
        {description && (
          <p className="text-blue-200 text-sm mt-4 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Illustration card */}
      <div className="relative z-10 my-6">
        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
          <img
            src={govtIllustration}
            alt="Ilustrasi Administrasi Pemerintah"
            className="w-full h-44 object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Feature badges */}
      <div className="relative z-10 space-y-3">
        {["Layanan Resmi & Terenkripsi", "Proses Cepat & Responsif"].map(
          (feature) => (
            <div key={feature} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-3 h-3 text-white"
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
              </div>
              <span className="text-white text-sm">{feature}</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default AuthSidePanel;
