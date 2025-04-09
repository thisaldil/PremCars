import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAuthenticated(true);
        setUser({ id: decoded.id }); // we only get ID from token
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("adminToken");
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("adminToken", token);
    const decoded = jwtDecode(token);
    setIsAuthenticated(true);
    setUser({ id: decoded.id });
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
