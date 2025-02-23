import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/admin/Dashboard";
import Settings from "./pages/admin/Settings";
import UserManagement from "./pages/admin/UserManagement";
import AssetManagement from "./pages/admin/AssetManagement";
import Header from "./components/Header";
import { useState } from "react";

function App() {
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [user, setUser] = useState(
    token ? JSON.parse(localStorage.getItem("user") || "{}") : null
  );

  const handleLogin = (token: string, user: any) => {
    localStorage.setItem("jwtToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <>
      <body className="flex flex-col items-stretch min-h-screen min-w-screen">
        <Header token={token} user={user} onLogout={handleLogout} />
        <main className="flex flex-row items-stretch justify-center min-h-[calc(100vh-64px)] bg-gray-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/user-dashboard" element={token ? <UserDashboard /> : <Navigate to="/login" />} />

            {/* ✅ Admin Dashboard with Nested Routes */}
            <Route path="/admin-dashboard" element={token && user?.userRole == 'Admin' ? <AdminDashboard /> : <Navigate to="/login" />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="settings" element={<Settings />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="asset-management" element={<AssetManagement />} />
            </Route>
          </Routes>
        </main>

      </body>
    </>
  );
}

export default App;
