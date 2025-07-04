import React, { useEffect, useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import DrawingPage from "./components/DrawingPage";
import Leaderboard from "./components/Leaderboard";
import { getUser, setUser, removeUser } from "./utils/userUtils";
import { ThemeToggleButton } from "./components/ThemeToggle";
import Toast from "./components/Toast";

// PUBLIC_INTERFACE
function AppRoutes() {
  const [theme, setTheme] = useState("light");
  const [toast, setToast] = useState(null);

  // Sync theme with CSS variables
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Auth: Store user in localStorage/session
  const [user, setUserState] = useState(getUser);

  const handleLogin = (username) => {
    setUser(username);
    setUserState(username);
  };

  const handleLogout = () => {
    removeUser();
    setUserState(null);
  };

  // Toast API for child components via React Context could be used, but for sample keep local
  const showToast = useCallback((msg, type = "info", duration = 2100) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  return (
    <div className="App">
      <ThemeToggleButton theme={theme} setTheme={setTheme} />
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} onLogout={handleLogout} showToast={showToast} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/add-drawing"
          element={
            user ? (
              <DrawingPage user={user} showToast={showToast} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/leaderboard"
          element={
            user ? (
              <Leaderboard user={user} showToast={showToast} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="*"
          element={
            <div style={{ marginTop: 60, color: "#ffb300", fontWeight: 600 }}>
              Oops! Page not found.
            </div>
          }
        />
      </Routes>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
