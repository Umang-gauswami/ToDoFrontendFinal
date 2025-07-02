import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const BACKEND_URL = "https://umang-todobackend.onrender.com";

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setTasks([]);
  };

  const addTask = async (text) => {
    if (!text.trim()) return;
    const response = await fetch(`${BACKEND_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text, status: "pending", priority: "medium" }),
    });
    const newTask = await response.json();
    setTasks([...tasks, newTask]);
  };

  const deleteTask = async (id) => {
    await fetch(`${BACKEND_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const updateTaskStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
    const response = await fetch(`${BACKEND_URL}/tasks/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    const updatedTask = await response.json();
    setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
  };

  const updateTaskPriority = async (id, newPriority) => {
    const response = await fetch(`${BACKEND_URL}/tasks/${id}/priority`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ priority: newPriority }),
    });
    const updatedTask = await response.json();
    setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
  };

  const filteredTasks = tasks.filter(
    (task) =>
      (filterStatus === "all" || task.status === filterStatus) &&
      (filterPriority === "all" || task.priority === filterPriority)
  );

  const MainApp = () => (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-indigo-100">
      <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold tracking-wide">TaskBoard</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 rounded-full font-semibold transition"
        >
          Logout
        </button>
      </nav>
      <main className="flex-1 p-8 max-w-4xl mx-auto w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTask(e.target[0].value);
            e.target[0].value = "";
          }}
          className="mb-8 flex flex-col md:flex-row gap-4 justify-center"
        >
          <input
            type="text"
            className="p-4 border border-indigo-300 rounded-lg w-full md:w-2/3 shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Add your task here..."
          />
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition"
          >
            Add Task
          </button>
        </form>

        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-center">
          <select
            onChange={(e) => setFilterStatus(e.target.value)}
            value={filterStatus}
            className="p-3 border border-indigo-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select
            onChange={(e) => setFilterPriority(e.target.value)}
            value={filterPriority}
            className="p-3 border border-indigo-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <ul className="space-y-4">
          {filteredTasks.map((task) => (
            <li
              key={task._id}
              className="p-4 bg-white border border-indigo-200 rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex-1">
                <span className="text-lg text-indigo-800 font-medium">
                  {task.text}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  ({task.status}, {task.priority})
                </span>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  onClick={() => updateTaskStatus(task._id, task.status)}
                  className={`px-3 py-1 rounded-full font-semibold ${
                    task.status === "pending"
                      ? "bg-yellow-400 text-yellow-900"
                      : "bg-green-400 text-green-900"
                  }`}
                >
                  {task.status === "pending" ? "Mark Complete" : "Mark Pending"}
                </button>
                <select
                  value={task.priority}
                  onChange={(e) => updateTaskPriority(task._id, e.target.value)}
                  className="p-2 border border-indigo-300 rounded-lg"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-full"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
      <footer className="bg-indigo-600 text-white p-4 text-center">
        © 2025 TaskBoard App
      </footer>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={token ? <MainApp /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
