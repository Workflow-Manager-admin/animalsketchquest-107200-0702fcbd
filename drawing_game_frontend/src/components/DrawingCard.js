import React, { useState } from "react";
import { submitGuess } from "../utils/api";
import "../App.css";

// PUBLIC_INTERFACE
export default function DrawingCard({
  drawing,
  user,
  showToast,
  updateDashboard,
}) {
  const [guess, setGuess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const alreadyGuessed =
    drawing.guessers?.some((g) => g.username === user) ||
    drawing.author === user;

  const handleGuess = async (e) => {
    e.preventDefault();
    if (!guess.trim()) return;
    setSubmitting(true);
    try {
      const res = await submitGuess(drawing.id, user, guess.trim());
      setGuess("");
      showToast(res.msg, res.correct ? "success" : "error");
      setTimeout(updateDashboard, 700); // refresh
    } catch (e) {
      showToast("Failed to submit guess!", "error");
    }
    setSubmitting(false);
  };

  const wrongGuesses =
    drawing.guessers?.filter(
      (g) => g.username === user && !g.correct
    ) || [];

  return (
    <div className={`drawing-card pastel-shadow ${alreadyGuessed ? "guessed" : ""}`}>
      <img
        src={drawing.imgUrl}
        className="drawing-image"
        alt={drawing.prompt + "-drawing"}
      />
      <div className="drawing-meta">
        <div className="drawing-prompt">
          <b>Prompt:</b> <i>{drawing.prompt.replace(/./g, "●")}</i>
        </div>
        <div className="drawing-author">
          by <b>{drawing.author}</b>
        </div>
      </div>
      <form className="guess-form" onSubmit={handleGuess} autoComplete="off">
        <input
          className="guess-input"
          placeholder="Enter your guess"
          value={guess}
          disabled={alreadyGuessed || submitting}
          maxLength={32}
          onChange={(e) => setGuess(e.target.value)}
          style={{ background: "#f5f8fe", border: "1px solid #ffecb3" }}
        />
        <button
          className="btn small pastel"
          type="submit"
          disabled={alreadyGuessed || !guess.trim() || submitting}
        >
          Guess
        </button>
      </form>
      {wrongGuesses.length > 0 && (
        <div className="wrong-guess-list">
          <small>Wrong guesses: </small>
          {wrongGuesses.map((g, i) => (
            <span key={i} className="wrong-guess">
              {g.guess}
            </span>
          ))}
        </div>
      )}
      {alreadyGuessed && (
        <div className="guessed-banner">You already tried ({drawing.correctGuessers?.includes(user) ? "Correct!" : "Wrong"})</div>
      )}
    </div>
  );
}
