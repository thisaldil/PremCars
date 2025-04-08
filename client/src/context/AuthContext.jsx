import React, { useEffect, useState, createContext, useContext } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(undefined);

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ email: decoded.email || "admin" }); // fallback
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("adminToken");
        setIsAuthenticated(false);
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("adminToken", data.token);
        const decoded = jwtDecode(data.token);
        setUser({ email: decoded.email || "admin" });
        setIsAuthenticated(true);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export { AuthProvider, useAuth };
