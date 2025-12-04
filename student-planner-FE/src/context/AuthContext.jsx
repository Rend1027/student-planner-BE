import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  apiLogin,
  clearToken,
  getToken,
} from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // we’ll store basic user info here
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // On first load, just check if a token exists
  useEffect(() => {
    const token = getToken();
    if (token) {
      // We don’t have a “me” endpoint, so just mark as “logged in”
      setUser({}); 
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    setLoading(true);
    try {
      const data = await apiLogin(email, password); // { user, token }
      setUser(data.user || {});
      navigate("/dashboard");
    } catch (err) {
      throw err; // let the page show the message
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearToken();
    setUser(null);
    navigate("/login");
  }

  const value = {
    user,
    isAuthenticated: !!user && !!getToken(),
    loading,
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
