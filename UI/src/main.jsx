import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Login from "./pages/Login.jsx";
import { ThemeProvider } from "./contexts/ThemeProvider.jsx";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Register from "./pages/Register.jsx";
import FYP from "./pages/fyp.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/fyp" element={<FYP />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
