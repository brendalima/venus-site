import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { sincronizaBarra } from "./lib/tema";
import "./styles/global.css";

// Depois do import do CSS: a função lê --bg computado.
sincronizaBarra();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
