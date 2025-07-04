import React from "react";
import "../App.css";

// PUBLIC_INTERFACE
export default function Toast({ msg, type }) {
  return (
    <div className={"toast fade-in " + (type ? `toast-${type}` : "")}>
      {msg}
    </div>
  );
}
