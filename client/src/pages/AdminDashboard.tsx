import { Outlet, NavLink } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5 space-y-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          <NavLink to="dashboard" className={({ isActive }) => isActive ? "bg-blue-500 p-2 rounded" : "p-2 hover:bg-gray-700 rounded"}>
            Dashboard
          </NavLink>
          <NavLink to="user-management" className={({ isActive }) => isActive ? "bg-blue-500 p-2 rounded" : "p-2 hover:bg-gray-700 rounded"}>
            User Management
          </NavLink>
          <NavLink to="asset-management" className={({ isActive }) => isActive ? "bg-blue-500 p-2 rounded" : "p-2 hover:bg-gray-700 rounded"}>
            Asset Management
          </NavLink>
          <NavLink to="settings" className={({ isActive }) => isActive ? "bg-blue-500 p-2 rounded" : "p-2 hover:bg-gray-700 rounded"}>
            Settings
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet /> {/* This renders the selected admin page */}
      </main>
    </div>
  );
};

export default AdminDashboard;
