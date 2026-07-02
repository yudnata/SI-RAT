/**
 * Sidebar - Shared sidebar component used across ALL roles.
 *
 * Props:
 * - `appName`   : string       - App/brand name shown at the top (default: "SI-RAT")
 * - `navItems`  : array        - Array of { id, label, icon } for the main navigation
 * - `activePage`: string       - Currently active page ID
 * - `onNavigate`: function     - Callback when a nav item is clicked
 * - `bottomItems`: array (opt) - Extra nav items shown at the bottom (e.g. Pengaturan)
 */
const Sidebar = ({
  navItems = [],
  bottomItems = [],
  activePage,
  onNavigate,
}) => {
  const NavButton = ({ item }) => {
    const isActive = activePage === item.id;
    return (
      <button
        key={item.id}
        onClick={() => onNavigate(item.id)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left
          ${
            isActive
              ? "bg-blue-50 text-blue-700"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`flex-shrink-0 ${isActive ? "text-blue-600" : "text-gray-400"}`}
          >
            {item.icon}
          </span>
          <span className="leading-tight truncate">{item.label}</span>
        </div>
      </button>
    );
  };

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
      {/* Brand / Logo - Balanced with Topbar height (h-14) */}
      <div className="h-14 px-6 border-b border-gray-100 flex items-center flex-shrink-0">
        <span className="text-blue-600 font-extrabold text-[15px] tracking-wider uppercase">
          SI-RAT
        </span>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavButton key={item.id} item={item} />
        ))}
      </nav>

      {/* Bottom items (e.g. Pengaturan, Logout) */}
      {bottomItems.length > 0 && (
        <div className="px-3 pb-5 border-t border-gray-100 pt-3 space-y-1">
          {bottomItems.map((item) => (
            <NavButton key={item.id} item={item} />
          ))}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
