import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import Article from "./pages/Article";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Talk from "./pages/Talk";
import "./styles/global.css";

function Layout() {
  return (
    <div className="page">
      <Link to="/" className="avatar" aria-label="Home">
        <img src="/avatar.jpg" alt="" width="32" height="32" />
      </Link>
      <main>
        {/* The tabs share one Home element, so switching tabs keeps the header in place */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/writing" element={<Home />} />
          <Route path="/talks" element={<Home />} />
          <Route path="/oss" element={<Home />} />
          <Route path="/about" element={<Home />} />
          <Route path="/posts" element={<Navigate to="/writing" replace />} />
          <Route path="/essays" element={<Navigate to="/writing" replace />} />
          <Route path="/talks/:slug" element={<Talk />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/:section/:slug" element={<Article />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

const rootEl = document.getElementById("root");
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
