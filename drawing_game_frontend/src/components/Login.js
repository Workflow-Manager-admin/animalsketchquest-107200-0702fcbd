import React, { useState, useRef, useEffect } from "react";
import "../App.css";

/**
 * Login page for anonymous username login.
 * Modern, pastel theme.
 * @param {function} onLogin
 */
 // PUBLIC_INTERFACE
export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setErr("You must enter a username!");
      return;
    }
    setErr("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(username.trim());
    }, 750); // Simulate login
  };

  return (
    <div className="login-bg fade-in">
      <div className="login-card pastel-shadow">
        <div className="login-title">🐾 Animal Sketch Quest</div>
        <div className="login-desc">Enter your username to begin!</div>
        <form onSubmit={handleLogin} autoComplete="off">
          <input
            ref={inputRef}
            className="login-input"
            placeholder="Unique username"
            maxLength={16}
            value={username}
            onChange={e => setUsername(e.target.value.replace(/\s/g, ''))}
            autoFocus
            disabled={loading}
            required
            style={{ background: "#fffbe9", border: "none" }}
          />
          <button
            className="btn pastel"
            type="submit"
            disabled={loading || !username.trim()}
          >
            {loading ? "Logging in..." : "Enter"}
          </button>
        </form>
        {err && <div className="login-err">{err}</div>}
        <div className="login-footer">Modern playful sketch game &copy; 2024</div>
      </div>
      {/* Decorative blobs */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
    </div>
  );
}
