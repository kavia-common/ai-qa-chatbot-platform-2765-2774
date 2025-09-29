import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { theme } from "./theme";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import { useAuth } from "./context/AuthContext";

const Global = createGlobalStyle`
  body {
    margin: 0;
    background: ${theme.colors.background};
    color: ${theme.colors.text};
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  }
  * { box-sizing: border-box; }
`;

function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// PUBLIC_INTERFACE
export default function AppRouter() {
  return (
    <ThemeProvider theme={theme}>
      <Global />
      <BrowserRouter>
        <Header />
        <main style={{ minHeight: "calc(100vh - 64px - 56px)", padding: "16px" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/chat" element={<RequireAuth><ChatPage /></RequireAuth>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}
