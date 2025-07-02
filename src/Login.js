import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ setToken }) {
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (username, password) => {
    setAuthLoading(true);
    setAuthError("");

    const response = await fetch(
      "https://umang-todobackend.onrender.com/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );
    const data = await response.json();
    setAuthLoading(false);
    if (data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
      navigate("/");
    } else {
      setAuthError(data.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-8 bg-white rounded-lg shadow-lg border border-indigo-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Login to TaskBoard
      </h2>
      {authError && (
        <div className="mb-4 text-center text-rose-600 font-semibold">
          {authError}
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login(username, password);
        }}
      >
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-3 border border-indigo-300 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 border border-indigo-300 rounded w-full mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Password"
        />
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
        >
          {authLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="mt-6 text-center text-gray-700">
        Don't have an account?{" "}
        <Link to="/signup">
          <span className="text-indigo-600 hover:underline font-semibold">
            Sign Up
          </span>
        </Link>
      </div>
    </div>
  );
}
