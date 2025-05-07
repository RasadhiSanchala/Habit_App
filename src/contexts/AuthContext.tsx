// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../models/User';
import { getUser, saveUser, removeUser } from '../services/storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => Promise<void>;
  register: (user: User) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const loadUser = async () => {
      const savedUser = await getUser();
      if (savedUser) {
        setUser(savedUser);
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (userData: User) => {
    await saveUser(userData);
    setUser(userData);
  };

  const register = async (userData: User) => {
    await saveUser(userData);
    setUser(userData);
  };

  const logout = async () => {
    await removeUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};