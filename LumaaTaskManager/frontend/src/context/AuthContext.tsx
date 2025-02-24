import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../api';

interface User {
  id: number;
  username: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null; // ✅ Ensures proper JSON parsing
  });
  

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user)); // ✅ Store in localStorage
    } else {
      localStorage.removeItem('user'); // ✅ Clear if user logs out
    }
  }, [user]);

  // ✅ Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await loginUser(username, password);
      const user = {
        id: res.data.userId,
        username,
        token: res.data.token
      };
      
      localStorage.setItem('user', JSON.stringify(user)); // ✅ Store as JSON object
      setUser(user); // ✅ Set user state properly
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // ✅ Register function
  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      await registerUser(username, password);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  // ✅ Logout function
  const logout = () => {
    setUser(null); // ✅ Remove user from state
    localStorage.removeItem('user'); // ✅ Remove from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
