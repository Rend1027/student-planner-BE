import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  apiLogin,
  clearToken,
  getToken,
  saveToken,
} from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user + token on first load
  useEffect(() => {
    const token = getToken();
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // ---- LOGIN ----
  async function login(email, password) {
    try {
      setLoading(true);

      // Backend returns: { user, token }
      const data = await apiLogin(email, password);

      // Save token + user
      saveToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // ---- LOGOUT ----
  function logout() {
    clearToken();
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
