/**
 * API util for drawing game backend (REST).
 * Replace baseUrl as needed (use env or config, this uses default FastAPI mock).
 * All call results are Promise-based.
 */
const baseUrl =
  process.env.REACT_APP_API_URL ||
  "http://localhost:8000/api"; // Change as needed

// PUBLIC_INTERFACE
export async function fetchDashboardData() {
  const res = await fetch(`${baseUrl}/drawings`);
  if (!res.ok) throw new Error("Failed to fetch drawings");
  return res.json();
}

// PUBLIC_INTERFACE
export async function fetchTopDrawing() {
  const res = await fetch(`${baseUrl}/drawings/top`);
  if (!res.ok) throw new Error("Failed to fetch top drawing");
  return res.json();
}

// PUBLIC_INTERFACE
export async function submitGuess(drawingId, username, guess) {
  const res = await fetch(`${baseUrl}/guess`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ drawingId, username, guess }),
  });
  if (!res.ok) throw new Error("Guess submission failed");
  return res.json();
}

// PUBLIC_INTERFACE
export async function uploadDrawing(username, prompt, imageDataUrl) {
  // Backend will forward to Firebase Storage, receives PNG base64, prompt, user
  const res = await fetch(`${baseUrl}/drawings/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      prompt,
      imageData: imageDataUrl, // expects dataURL string
    }),
  });
  if (!res.ok) throw new Error("Drawing upload failed");
  return res.json();
}

// PUBLIC_INTERFACE
export async function fetchLeaderboard() {
  const res = await fetch(`${baseUrl}/leaderboard`);
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}
