import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  KELURAHAN_NAV_ITEMS,
  KELURAHAN_BOTTOM_ITEMS,
} from "../features/kelurahan/kelurahanNav";

/**
 * KelurahanLayout
 * Wraps all Kelurahan pages with the shared Sidebar and Topbar.
 */
const KelurahanLayout = ({ activePage, onNavigate, user, children }) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        appName="SI-RAT"
        navItems={KELURAHAN_NAV_ITEMS}
        bottomItems={KELURAHAN_BOTTOM_ITEMS}
        activePage={activePage}
        onNavigate={onNavigate}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar user={{ ...user, role: "Admin Portal" }} notifCount={1} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default KelurahanLayout;
