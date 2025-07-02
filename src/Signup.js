import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signup = async (username, password) => {
    setAuthLoading(true);
    setAuthError("");
    setSuccess(false);
    const response = await fetch(
      "https://umang-todobackend.onrender.com/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );
    const data = await response.json();
    setAuthLoading(false);
    if (data.message === "User registered") {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setAuthError(data.message || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-8 bg-white rounded-lg shadow-lg border border-indigo-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Create Your Account
      </h2>
      {authError && (
        <div className="mb-4 text-center text-rose-600 font-semibold">
          {authError}
        </div>
      )}
      {success && (
        <div className="mb-4 text-center text-green-600 font-semibold">
          Registration successful! Redirecting...
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signup(username, password);
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
          disabled={authLoading}
        >
          {authLoading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <div className="mt-6 text-center text-gray-700">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-indigo-600 hover:underline font-semibold"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
