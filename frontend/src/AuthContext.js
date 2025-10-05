import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [full_name, setFullName] = useState(localStorage.getItem('full_name') || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('role');
    }
  }, [role]);

  useEffect(() => {
    if (full_name) {
      localStorage.setItem('full_name', full_name);
    } else {
      localStorage.removeItem('full_name');
    }
  }, [full_name]);

  const logout = () => {
    setToken(null);
    setRole(null);
    setFullName(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ token, role, full_name, setToken, setRole, setFullName, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
