import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiLogin, apiLogout, apiRegister } from "../services/api";

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function register({ username, email, password }) {
    setLoading(true);
    setError("");
    try {
      await apiRegister({ username, email, password });
      // Immediately log in after register
      await login({ username, password });
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function login({ username, password }) {
    setLoading(true);
    setError("");
    try {
      await apiLogin({ username, password });
      setUser({ username });
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await apiLogout();
    } catch {
      // ignore errors on logout
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      setUser(null);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) localStorage.setItem("authUser", JSON.stringify(user));
  }, [user]);

  const value = useMemo(
    () => ({ user, loading, error, register, login, logout, setError }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
