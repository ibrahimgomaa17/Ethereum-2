import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { useState } from "react";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import AssetManagement from "./pages/admin/AssetManagement";

function App() {
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [user, setUser] = useState(
    token ? JSON.parse(localStorage.getItem("user") || "{}") : null
  );

  const handleLogin = (token: string, user: any) => {
    localStorage.setItem("jwtToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    debugger
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
        <main className="flex flex-row items-stretch justify-center min-h-screen">
          <Routes>
            <Route path="/" element={<Home token={token} user={user} onLogout={handleLogout} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={token && user?.userRole == 'Admin' ? <Dashboard  token={token} user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} >

              <Route path="" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="asset-management" element={<AssetManagement />} />

            </Route>
          </Routes>
        </main>

      </div>
    </>
  );
}

export default App;
