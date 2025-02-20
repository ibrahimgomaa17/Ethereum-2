import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }: { onLogin: (token: string, user: any) => void }) => {
  const [userId, setUserId] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ Import useNavigate for redirection

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, privateKey }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.token, data.user);

        // ✅ Redirect based on user role
        if (data.user.userRole === "Admin") {
          navigate("/admin-dashboard/dashboard"); // Redirect to Admin Dashboard
        } else {
          navigate("/user-dashboard"); // Redirect to User Dashboard
        }
      } else {
        setError(data.error || "Invalid login credentials");
      }
    } catch (error) {
      setError("Failed to connect to the server.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">Login</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-medium mb-2">User ID</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-medium mb-2">Private Key</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Private Key"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
