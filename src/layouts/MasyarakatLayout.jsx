import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  MASYARAKAT_NAV_ITEMS,
  MASYARAKAT_BOTTOM_ITEMS,
} from "../features/masyarakat/masyarakatNav";

/**
 * MasyarakatLayout
 * Wraps all Masyarakat pages with the shared Sidebar and Topbar.
 * Passes Masyarakat-specific nav items to the generic Sidebar.
 */
const MasyarakatLayout = ({ activePage, onNavigate, user, children }) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        appName="CivicLink"
        navItems={MASYARAKAT_NAV_ITEMS}
        bottomItems={MASYARAKAT_BOTTOM_ITEMS}
        activePage={activePage}
        onNavigate={onNavigate}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar user={{ ...user, role: "Masyarakat" }} notifCount={1} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default MasyarakatLayout;
