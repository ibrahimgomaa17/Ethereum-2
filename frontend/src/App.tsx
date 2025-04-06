// App.tsx
import { LoadingProvider, useLoading } from "@/context/LoadingContext";
import { Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import AssetManagement from "./pages/admin/AdminManagement";
import { LoaderComponent } from "./ui/loader";
import AssetList from "./pages/user/AssetList";
import UserDashboard from "./pages/user/UserDashboard";
import AdminManagement from "./pages/admin/AdminManagement";
import Finder from "./pages/admin/Finder";

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
    <LoadingProvider>
      <AppContent
        token={token}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </LoadingProvider>
  );
}

function AppContent({
  token,
  user,
  onLogin,
  onLogout,
}: {
  token: string | null;
  user: any;
  onLogin: (token: string, user: any) => void;
  onLogout: () => void;
}) {
  const { isLoading } = useLoading(); // Use the loading state

  return (
    <>
      {isLoading && <LoaderComponent />} {/* Conditionally render the loader */}
      <div className="flex flex-col items-stretch min-h-screen min-w-screen">
        <main className="flex flex-row items-stretch justify-center min-h-screen">
          <Routes>
            <Route path="/" element={<Home token={token} user={user} onLogout={onLogout} />} />
            <Route path="/login" element={<Login onLogin={onLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={token && user?.userRole === "Admin" ? <Dashboard token={token} user={user} onLogout={onLogout} /> : <Navigate to="/login" />} >
              <Route path="" element={<AdminDashboard />} />
              <Route path="actions" element={<AdminManagement user={user} />} />
              <Route path="asset-management" element={<AssetManagement user={user} />} />
              <Route path="finder" element={<Finder />} />
            </Route>
            <Route path="/user" element={token && user?.userRole != "Admin" ? <Dashboard token={token} user={user} onLogout={onLogout} /> : <Navigate to="/login" />} >
              <Route path="" element={<UserDashboard />} />
              <Route path="assets" element={<AssetList user={user} />} />
            </Route>
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;