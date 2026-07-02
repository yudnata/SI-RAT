import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  ADMIN_NAV_ITEMS,
  ADMIN_BOTTOM_ITEMS,
} from "../features/admin/adminNav";

/**
 * AdminLayout
 * Wraps all Super Admin pages with the shared Sidebar and Topbar.
 */
const AdminLayout = ({ activePage, onNavigate, user, children }) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        appName="SI-RAT"
        navItems={ADMIN_NAV_ITEMS}
        bottomItems={ADMIN_BOTTOM_ITEMS}
        activePage={activePage}
        onNavigate={onNavigate}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar user={{ ...user, role: "Super Admin" }} notifCount={3} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
