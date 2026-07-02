/**
 * Topbar - Shared top navigation bar used across ALL roles.
 *
 * Props:
 * - `user`         : object - { name, role, avatarUrl? }
 * - `notifCount`   : number - Notification count badge (0 = no badge)
 * - `onNotifClick` : fn     - Callback when bell icon is clicked
 * - `onProfileClick`: fn    - Callback when user avatar/name is clicked
 */
const Topbar = ({ user, notifCount = 0, onNotifClick, onProfileClick }) => {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-end px-6 gap-4 flex-shrink-0">
      {/* Notification bell */}
      <button
        onClick={onNotifClick}
        className="relative p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
        aria-label="Notifikasi"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        {notifCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        )}
      </button>

      {/* User profile */}
      <button
        onClick={onProfileClick}
        className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        aria-label="Profil pengguna"
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
        )}
        <div className="text-left hidden sm:block">
          <p className="text-sm font-semibold text-gray-700 leading-tight">
            {user?.name ?? "Pengguna"}
          </p>
          {user?.role && (
            <p className="text-xs text-gray-400 leading-tight">{user.role}</p>
          )}
        </div>
      </button>
    </header>
  );
};

export default Topbar;
