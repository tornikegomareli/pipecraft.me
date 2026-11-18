import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Link, Navigate, Outlet, Route, Routes } from "react-router-dom";
import Article from "./pages/Article";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Talk from "./pages/Talk";
import "./styles/global.css";

// Articles and talks read in one narrow column
function Page() {
  return (
    <div className="page">
      <Link to="/" className="avatar" aria-label="Home">
        <img src="/avatar.jpg" alt="" width="32" height="32" />
      </Link>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* The filters share one Home element, so switching keeps the intro in place */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apps" element={<Home />} />
        <Route path="/oss" element={<Home />} />
        <Route path="/writing" element={<Home />} />
        <Route path="/talks" element={<Home />} />
        <Route path="/about" element={<Navigate to="/" replace />} />
        <Route path="/posts" element={<Navigate to="/writing" replace />} />
        <Route path="/essays" element={<Navigate to="/writing" replace />} />
        <Route element={<Page />}>
          <Route path="/talks/:slug" element={<Talk />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/:section/:slug" element={<Article />} />
        </Route>
      </Routes>
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
