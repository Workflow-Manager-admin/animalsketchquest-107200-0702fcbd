/**
 * Use localStorage or sessionStorage to persist a logged-in user.
 */

// PUBLIC_INTERFACE
export function setUser(username) {
  localStorage.setItem("drawinggame-user", username);
}

// PUBLIC_INTERFACE
export function getUser() {
  return localStorage.getItem("drawinggame-user");
}

// PUBLIC_INTERFACE
export function removeUser() {
  localStorage.removeItem("drawinggame-user");
}
