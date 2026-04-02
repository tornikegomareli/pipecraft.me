import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./hooks/useTheme";
import Article from "./pages/Article";
import Home from "./pages/Home";
import "./styles/global.css";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:section/:slug" element={<Article />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
