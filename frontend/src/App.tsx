import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { useState } from "react";
import { Login } from "./pages/Login";

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
        <main className="flex flex-row items-stretch justify-center min-h-screen">
          <Routes>
            <Route path="/" element={<Home token={token} user={user} onLogout={handleLogout} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

      </div>
    </>
  );
}

export default App;
