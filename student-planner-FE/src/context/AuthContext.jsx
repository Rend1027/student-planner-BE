import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  login as apiLogin,
  clearToken,
  getToken,
} from "../api/client";
import { Navigate } from "react-router-dom";


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user + token on first load
  useEffect(() => {
    const token = getToken();

    const raw = localStorage.getItem("user");
    let storedUser = null;

    try {
      if (raw && raw !== "undefined") {
        storedUser = JSON.parse(raw);
      }
    } catch (e) {
      console.error("Invalid user in storage, clearing it...");
      localStorage.removeItem("user");
    }

    if (token && storedUser) {
      setUser(storedUser);
    }

    setLoading(false);
  }, []);

  // ---- LOGIN ----
  async function login(email, password) {
    try {
      setLoading(true);

      // Backend returns ONLY the user object (token already stored)
      const user = await apiLogin(email, password);
      console.log("LOGIN RESPONSE:", user);

      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      // Redirect based on role
      if (user.role === "admin") {
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

export function RequireAdmin({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;

  return children;
}
