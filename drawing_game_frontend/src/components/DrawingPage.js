import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { animalPrompts } from "../utils/animalPrompts";
import { uploadDrawing } from "../utils/api";
import "../App.css";

/**
 * Add Drawing workflow
 * - Shows random prompt (spinning wheel), large canvas, 45s timer.
 * - Uploads image on submit. 
 * - Playful, pastel, modern.
 * @param {string} user
 * @param {function} showToast
 */
// PUBLIC_INTERFACE
export default function DrawingPage({ user, showToast }) {
  const [prompt, setPrompt] = useState("");
  const [timer, setTimer] = useState(45);
  const [canvasReady, setCanvasReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [drawData, setDrawData] = useState(null);
  const canvasRef = useRef();
  const contextRef = useRef();
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState([]);
  const navigate = useNavigate();

  // Pick animal prompt on mount
  useEffect(() => {
    const idx = Math.floor(Math.random() * animalPrompts.length);
    setPrompt(animalPrompts[idx]);
    // Small spinning "wheel" effect
    setTimeout(() => setCanvasReady(true), 1200);
  }, []);

  // Countdown Timer
  useEffect(() => {
    if (!canvasReady || submitting) return;
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, canvasReady, submitting]);

  // Setup canvas for mouse/touch drawing
  useEffect(() => {
    if (!canvasReady) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#1976d2";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    contextRef.current = ctx;
  }, [canvasReady]);

  // Mouse/touch drawing handlers
  const startDraw = (x, y) => {
    setDrawing(true);
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setPoints((pts) => [...pts, [{ x, y }]]);
  };
  const draw = (x, y) => {
    if (!drawing) return;
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
    setPoints((pts) => {
      if (pts.length) {
        pts[pts.length - 1].push({ x, y });
      }
      return pts;
    });
  };
  const stopDraw = () => setDrawing(false);

  // Undo: Remove last stroke
  const handleUndo = () => {
    if (!points.length) return;
    const newPoints = points.slice(0, -1);
    redrawFromPoints(newPoints);
    setPoints(newPoints);
  };
  // Redraw entire canvas from array of points
  const redrawFromPoints = (pts) => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#1976d2";
    pts.forEach((stroke) => {
      if (!stroke || !stroke.length) return;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; ++i) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    });
  };

  const handleSubmit = async () => {
    if (!points.length) {
      showToast("Draw something before submitting!", "error");
      return;
    }
    setSubmitting(true);
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");
    try {
      await uploadDrawing(user, prompt, dataUrl);
      showToast("Drawing uploaded!", "success");
      setTimeout(() => navigate("/dashboard"), 900);
    } catch (e) {
      showToast("Failed to upload drawing.", "error");
      setSubmitting(false);
    }
  };

  // Early quit or timer out
  useEffect(() => {
    if (timer === 0) {
      handleSubmit();
    }
    // eslint-disable-next-line
  }, [timer]);

  return (
    <div className="drawing-bg">
      <div className="drawing-header">
        <button className="btn small" onClick={() => navigate("/dashboard")}>
          &larr; Back
        </button>
        <div className="drawing-title">Add Your Drawing</div>
      </div>
      <div className="drawing-main">
        <div className="prompt-spin-c">
          {!canvasReady ? (
            <div className="prompt-wheel">
              <div className="wheel-spin">
                {Array(16)
                  .fill(0)
                  .map((_, i) => (
                    <span key={i}>{animalPrompts[Math.floor(Math.random() * animalPrompts.length)]}</span>
                  ))}
              </div>
            </div>
          ) : (
            <div className="prompt-box fade-in">
              <span>
                Your sketch: <span className="prompt-text">{prompt}</span>
              </span>
            </div>
          )}
        </div>
        <div className="canvas-c">
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="drawing-canvas"
            tabIndex={0}
            style={{ background: "#fffbe9", borderRadius: 22, boxShadow: "0 3px 16px #ffecb330", cursor: canvasReady ? "crosshair" : "not-allowed" }}
            onMouseDown={canvasReady ? (e) => {
              const rect = e.target.getBoundingClientRect();
              startDraw(e.clientX - rect.left, e.clientY - rect.top);
            } : null}
            onMouseMove={canvasReady ? (e) => {
              if (!drawing) return;
              const rect = e.target.getBoundingClientRect();
              draw(e.clientX - rect.left, e.clientY - rect.top);
            } : null}
            onMouseUp={canvasReady ? stopDraw : null}
            onMouseLeave={canvasReady ? stopDraw : null}
            onTouchStart={canvasReady ? (e) => {
              const rect = e.target.getBoundingClientRect();
              const touch = e.touches[0];
              startDraw(touch.clientX - rect.left, touch.clientY - rect.top);
            } : null}
            onTouchMove={canvasReady ? (e) => {
              if (!drawing) return;
              const rect = e.target.getBoundingClientRect();
              const touch = e.touches[0];
              draw(touch.clientX - rect.left, touch.clientY - rect.top);
            } : null}
            onTouchEnd={canvasReady ? stopDraw : null}
            disabled={!canvasReady}
          />
          <div className="canvas-actions">
            <button className="btn small pastel" disabled={!canvasReady || !points.length || submitting} onClick={handleUndo}>
              Undo
            </button>
            <span className="timer">
              <span
                className={
                  "timer-numbers " + (timer <= 10 ? "warning" : "ok")
                }
              >
                ⏰ {timer}
              </span>
              <span className="timer-label">sec</span>
            </span>
            <button
              className="btn small accent"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting
                ? "Uploading..."
                : timer === 0
                ? "Submitting..."
                : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
