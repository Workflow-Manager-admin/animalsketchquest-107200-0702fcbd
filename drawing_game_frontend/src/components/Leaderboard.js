import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLeaderboard } from "../utils/api";
import "../App.css";

// PUBLIC_INTERFACE
export default function Leaderboard({ user, showToast }) {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaderboard()
      .then((b) => {
        setBoard(b || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="leader-bg fade-in">
      <div className="leader-header">
        <button className="btn small" onClick={() => navigate("/dashboard")}>
          &larr; Back
        </button>
        <div className="leader-title">🏆 Leaderboard</div>
      </div>
      <div className="leader-list">
        {loading ? (
          <div className="loading-spinner"></div>
        ) : !board.length ? (
          <div className="leader-empty">Nobody has any correct guesses yet!</div>
        ) : (
          <ol>
            {board.map((u, idx) => (
              <li key={u.username}>
                <span className={"rank-badge rank-" + (idx + 1)}>
                  {idx + 1}
                </span>
                <span className="avatar">{avatarIcon(u.username)}</span>
                <span className="board-user">{u.username}</span>
                <span className="score">{u.score} pts</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

// Simple hash-based avatar icon
function avatarIcon(username) {
  const icons = ["🐻", "🦊", "🐶", "🐵", "🐯", "🐸", "🐼", "🦁", "🐰", "🦉"];
  let hash = 0, i;
  for (i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return icons[Math.abs(hash) % icons.length];
}
