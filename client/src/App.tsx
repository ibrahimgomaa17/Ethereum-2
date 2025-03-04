import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import Settings from "./pages/admin/Settings";
import UserManagement from "./pages/admin/UserManagement";
import AssetManagement from "./pages/admin/AssetManagement";
import Header from "./components/Header";
import { useState } from "react";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

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
      <div className="flex flex-col items-stretch min-h-screen min-w-screen">
        {/* <Header token={token} user={user} onLogout={handleLogout} /> */}
        <main className="flex flex-row items-stretch justify-center min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={token && user?.userRole == 'Admin' ? <Dashboard token={token} user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} >

              <Route path="" element={<AdminDashboard />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="asset-management" element={<AssetManagement />} />
              <Route path="settings" element={<Settings />} />

              <Route path="user" element={token && user?.userRole != 'Admin' ? <UserDashboard /> : <Navigate to="/login" />}>
                {/* <Route path="home" element={<AdminDashboard />} />
                <Route path="user-management" element={<UserManagement />} />
                <Route path="asset-management" element={<AssetManagement />} />
                <Route path="settings" element={<Settings />} /> */}
              </Route>

            </Route>
          </Routes>
        </main>

      </div>
    </>
  );
}

export default App;
