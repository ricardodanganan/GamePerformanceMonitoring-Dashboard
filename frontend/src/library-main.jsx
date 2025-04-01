import React from "react";
import ReactDOM from "react-dom/client";
import GameLibrary from "./GameLibrary";
import "./GameLibrary.css";

ReactDOM.createRoot(document.getElementById("library-root")).render(
  <React.StrictMode>
    <GameLibrary />
  </React.StrictMode>
);
