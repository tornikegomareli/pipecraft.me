import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import TweaksPanel from "./components/TweaksPanel";
import { ThemeProvider } from "./hooks/useTheme";
import About from "./pages/About";
import Article from "./pages/Article";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Talk from "./pages/Talk";
import Talks from "./pages/Talks";
import "./styles/global.css";

function Layout() {
  return (
    <div className="layout">
      <div className="wrap">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/talks" element={<Talks />} />
          <Route path="/talks/:slug" element={<Talk />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/:section/:slug" element={<Article />} />
        </Routes>
      </div>
      <Footer />
      <TweaksPanel />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
