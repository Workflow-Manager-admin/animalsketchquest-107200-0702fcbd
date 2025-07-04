import React, { useEffect, useState } from "react";
import DrawingCard from "./DrawingCard";
import { useNavigate } from "react-router-dom";
import { fetchDashboardData, fetchTopDrawing } from "../utils/api";
import "../App.css";

/**
 * Dashboard shows all drawings (grid), top drawing, add button, logout.
 * @param {string} user - current username
 * @param {function} onLogout
 * @param {function} showToast
 */
// PUBLIC_INTERFACE
export default function Dashboard({ user, onLogout, showToast }) {
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topDrawing, setTopDrawing] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchDashboardData(), fetchTopDrawing()])
      .then(([draw, topD]) => {
        setDrawings(draw);
        setTopDrawing(topD);
        setLoading(false);
      })
      .catch(() => {
        setDrawings([]);
        setError("Could not load drawings");
        setLoading(false);
      });
  }, []);

  return (
    <div className="dashboard-bg">
      <div className="dashboard-header">
        <span className="logo">🐾 Animal Sketch Quest</span>
        <div className="dashboard-toolbar">
          <button className="btn small" onClick={() => navigate("/leaderboard")}>
            🏆 Leaderboard
          </button>
          <span className="username-badge">Hi, {user}</span>
          <button className="btn small pastel" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
      <div className="dashboard-main">
        <div className="top-section fade-in">
          <h2>Top Drawing Today</h2>
          {topDrawing ? (
            <div className="top-drawing-card pastel-shadow bounce-in">
              <img
                src={topDrawing.imgUrl}
                alt={topDrawing.prompt}
                className="top-drawing-img"
              />
              <div className="top-drawing-info">
                <div className="top-drawing-prompt">
                  {topDrawing.prompt}
                </div>
                <div className="top-drawing-author">
                  by <b>{topDrawing.author}</b>
                </div>
                <div className="top-drawing-score">
                  {topDrawing.correctGuessers?.length || 0} correct{" "}
                  {topDrawing.correctGuessers?.length === 1 ? "guess" : "guesses"}
                </div>
              </div>
            </div>
          ) : (
            <div className="top-drawing-placeholder">No top drawing yet!</div>
          )}
        </div>
        <div className="add-btn-fab-container">
          <button
            className="add-btn-fab rainbow"
            title="Add a Drawing"
            onClick={() => navigate("/add-drawing")}
          >
            ＋
          </button>
        </div>
        <div className="drawings-section fade-in">
          <h2>All Drawings</h2>
          {loading ? (
            <div className="loading-spinner"></div>
          ) : error ? (
            <div className="error-banner">{error}</div>
          ) : drawings.length ? (
            <div className="drawing-grid">
              {drawings.map((d, idx) => (
                <DrawingCard
                  key={d.id || idx}
                  drawing={d}
                  user={user}
                  showToast={showToast}
                  updateDashboard={() => window.location.reload()}
                />
              ))}
            </div>
          ) : (
            <div className="drawing-none">No drawings yet. Be first to add!</div>
          )}
        </div>
      </div>
    </div>
  );
}
