import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  KALING_NAV_ITEMS,
  KALING_BOTTOM_ITEMS,
} from "../features/kaling/kalingNav";

/**
 * KalingLayout
 * Wraps all Kepala Lingkungan pages with the shared Sidebar and Topbar.
 */
const KalingLayout = ({ activePage, onNavigate, user, children }) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        appName="SI-RAT"
        navItems={KALING_NAV_ITEMS}
        bottomItems={KALING_BOTTOM_ITEMS}
        activePage={activePage}
        onNavigate={onNavigate}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar user={{ ...user, role: "Neighborhood Head" }} notifCount={1} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default KalingLayout;
