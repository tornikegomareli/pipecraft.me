import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Article from "./pages/Article";
import Home from "./pages/Home";
import Oss from "./pages/Oss";
import Projects from "./pages/Projects";
import Talk from "./pages/Talk";
import Talks from "./pages/Talks";
import Writing from "./pages/Writing";
import "./styles/global.css";

function Layout() {
  return (
    <div className="layout">
      <div className="wrap">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/writing" element={<Writing />} />
            <Route path="/posts" element={<Navigate to="/writing" replace />} />
            <Route path="/essays" element={<Navigate to="/writing" replace />} />
            <Route path="/talks" element={<Talks />} />
            <Route path="/talks/:slug" element={<Talk />} />
            <Route path="/oss" element={<Oss />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/:section/:slug" element={<Article />} />
          </Routes>
        </main>
      </div>
      <Footer />
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
